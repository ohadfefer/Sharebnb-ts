import { useEffect, useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setFilter } from "../store/actions/stay.actions"
import searchIcon from "../assets/logo/icons/search-black.svg"

import {
    buildSearchParams,
    formatGuestsLabel,
    buildStayPathWithParams,
    toIsoDate,
    fromIsoDate,
} from "../services/util.service"

import { WherePanel } from "../cmps/WherePanel.jsx"
import { DateRangePanel } from "../cmps/DateRangePanel.jsx"
import { loadGoogleMapsPlaces } from "../services/googleMapsLoader"

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

export function FilterSheet({ id = "filter-sheet", initial = {}, onClose }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [stage, setStage] = useState("where")
    const [dateMode, setDateMode] = useState("dates")

    const [draft, setDraft] = useState(() => ({
        address: initial.address || "",
        placeId: initial.placeId || "",
        checkIn: initial.checkIn || "",
        checkOut: initial.checkOut || "",
        guests:
            typeof initial.guests === "number"
                ? { adults: initial.guests }
                : { ...(initial.guests || {}) },
        loc: initial.loc || null,
    }))

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose?.()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    function updateGuests(key, diff) {
        setDraft((d) => {
            const curr = Number(d.guests?.[key]) || 0
            const next = clamp(curr + diff, 0, 99)
            const guests = { ...d.guests, [key]: next }
            for (const k of Object.keys(guests)) if (!guests[k]) delete guests[k]
            return { ...d, guests }
        })
    }

    async function onPickPlace(sel) {
        const address = typeof sel === "string" ? sel : sel?.address || ""
        const placeId = typeof sel === "object" ? (sel.placeId || "") : ""

        setDraft((d) => ({ ...d, address, placeId }))

        if (placeId) {
            try {
                await loadGoogleMapsPlaces()
                const service = new window.google.maps.places.PlacesService(document.createElement("div"))
                await new Promise((resolve) => {
                    service.getDetails(
                        { placeId, fields: ["geometry.location", "address_components"] },
                        (res) => {
                            if (res?.geometry?.location) {
                                const lat = res.geometry.location.lat()
                                const lng = res.geometry.location.lng()
                                const comps = Object.fromEntries(
                                    (res.address_components || []).flatMap((c) =>
                                        c.types.map((t) => [t, c.long_name])
                                    )
                                )
                                setDraft((d) => ({
                                    ...d,
                                    loc: {
                                        lat,
                                        lng,
                                        city: comps.locality || comps.sublocality || "",
                                        country: comps.country || "",
                                    },
                                }))
                            }
                            resolve()
                        }
                    )
                })
            } catch {
            }
        }

        setStage("when")
    }

    function onApply() {
        setFilter({
            address: draft.address,
            placeId: draft.placeId,
            checkIn: draft.checkIn,
            checkOut: draft.checkOut,
            guests: draft.guests,
            loc: draft.loc,
        })

        const params = buildSearchParams({
            address: draft.address,
            checkIn: draft.checkIn,
            checkOut: draft.checkOut,
            guests: draft.guests,
        })
        const path = buildStayPathWithParams("", params)
        navigate(path.replace(/\/$/, "/stay"))
        onClose?.()
    }

    function onClearAll() {
        setDraft({
            address: "",
            placeId: "",
            checkIn: "",
            checkOut: "",
            guests: {},
            loc: null,
        })
        setStage("where")
    }

    const guestsLabel = formatGuestsLabel(draft.guests)
    const dateSummary =
        draft.checkIn && draft.checkOut
            ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).formatRange(
                new Date(draft.checkIn),
                new Date(draft.checkOut)
            )
            : "Add dates"
    const addressSummary = draft.address || "Where"
    const footerIsNext = stage === "when" && !draft.checkOut

    return (
        <div id={id} className="m-sheet" role="dialog" aria-modal="true">
            <div className="m-sheet__panel">
                {/* header inside sheet */}
                <div className="m-sheet__header">
                    <h3 className="sheet-stage-title">
                        {stage === "where" ? "Where?" : stage === "when" ? "When?" : "Who?"}
                    </h3>
                </div>

                <div className="m-sheet__body">
                    {stage !== "where" && (
                        <DisclosureRow label="Where" value={addressSummary} onClick={() => setStage("where")} />
                    )}

                    {stage === "where" && (
                        <section className="sheet-card sheet-where">
                            <div className="where-input-wrap">
                                <span className="where-icon" aria-hidden><img src={searchIcon} alt="" /></span>
                                <input
                                    className="where-input"
                                    placeholder="Search destinations"
                                    value={draft.address}
                                    onChange={(e) =>
                                        setDraft((d) => ({ ...d, address: e.target.value, placeId: "", loc: null }))
                                    }
                                />
                            </div>

                            <div className="where-suggestions-wrap">
                                <WherePanel
                                    value={{ address: draft.address }}
                                    onChange={onPickPlace}
                                    onAdvance={() => setStage("when")}
                                />
                            </div>
                        </section>
                    )}

                    {stage === "where" && (
                        <>
                            <DisclosureRow
                                label="When"
                                value={dateSummary}
                                onClick={() => setStage("when")}
                                rightHint="I'm flexible"
                            />
                            <DisclosureRow
                                label="Who"
                                value={guestsLabel !== "Add guests" ? guestsLabel : "Add guests"}
                                onClick={() => setStage("who")}
                            />
                        </>
                    )}

                    {stage === "when" && (
                        <section className="sheet-card sheet-when">
                            <div className="segmented">
                                {["dates", "months", "flexible"].map((key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`seg-btn ${dateMode === key ? "active" : ""}`}
                                        onClick={() => setDateMode(key)}
                                    >
                                        {key === "dates" ? "Dates" : key === "months" ? "Months" : "Flexible"}
                                    </button>
                                ))}
                            </div>

                            {dateMode === "dates" ? (
                                <>
                                    <DateRangePanel
                                        value={{ checkIn: draft.checkIn, checkOut: draft.checkOut }}
                                        onChange={({ checkIn, checkOut }) =>
                                            setDraft((d) => ({ ...d, checkIn, checkOut }))
                                        }
                                    />
                                    <div className="tolerances">
                                        {["Exact dates", "+ 1 day", "+ 2 days", "+ 3 days", "+ 7 days"].map(
                                            (chip, i) => (
                                                <button key={chip} type="button" className={`chip ${i === 0 ? "active" : ""}`}>
                                                    {chip}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="coming-soon">This mode is coming soon.</div>
                            )}
                        </section>
                    )}

                    {stage === "when" && (
                        <DisclosureRow
                            label="Who"
                            value={guestsLabel !== "Add guests" ? guestsLabel : "Add guests"}
                            onClick={() => setStage("who")}
                        />
                    )}

                    {stage === "who" && (
                        <section className="sheet-card sheet-who">
                            <CounterRow
                                title="Adults"
                                sub="Ages 13 or above"
                                value={Number(draft.guests?.adults) || 0}
                                onDec={() => updateGuests("adults", -1)}
                                onInc={() => updateGuests("adults", +1)}
                            />
                            <CounterRow
                                title="Children"
                                sub="Ages 2–12"
                                value={Number(draft.guests?.children) || 0}
                                onDec={() => updateGuests("children", -1)}
                                onInc={() => updateGuests("children", +1)}
                            />
                            <CounterRow
                                title="Infants"
                                sub="Under 2"
                                value={Number(draft.guests?.infants) || 0}
                                onDec={() => updateGuests("infants", -1)}
                                onInc={() => updateGuests("infants", +1)}
                            />
                            <CounterRow
                                title="Pets"
                                sub=" "
                                value={Number(draft.guests?.pets) || 0}
                                onDec={() => updateGuests("pets", -1)}
                                onInc={() => updateGuests("pets", +1)}
                            />
                        </section>
                    )}
                </div>

                {/* footer */}
                <div className="m-sheet__footer">
                    <button className="link" onClick={onClearAll}>Clear all</button>
                    {footerIsNext ? (
                        <button className="cta cta-dark" onClick={() => setStage("who")}>Next</button>
                    ) : (
                        <button className="cta" onClick={onApply}>
                            <span className="cta-title">Search</span>
                            <span className="cta-sub">
                                {(draft.checkIn && draft.checkOut) ? `${dateSummary} • ` : ""}
                                {guestsLabel !== "Add guests" ? guestsLabel : "Add guests"}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

/* helpers */
function DisclosureRow({ label, value, rightHint, onClick }) {
    return (
        <button type="button" className="disclosure-row" onClick={onClick}>
            <span className="discl-left">{label}</span>
            <span className={`discl-right ${value ? "" : "placeholder"}`}>{value || "—"}</span>
            {rightHint && <span className="discl-hint">{rightHint}</span>}
        </button>
    )
}

function CounterRow({ title, sub, value, onDec, onInc }) {
    return (
        <div className="counter-row">
            <div className="counter-texts">
                <div className="title">{title}</div>
                {sub && <div className="sub">{sub}</div>}
            </div>
            <div className="counter-controls">
                <button className="round-btn" onClick={onDec} disabled={value <= 0} aria-label={`Remove ${title}`}>–</button>
                <span className="val">{value}</span>
                <button className="round-btn" onClick={onInc} aria-label={`Add ${title}`}>+</button>
            </div>
        </div>
    )
}

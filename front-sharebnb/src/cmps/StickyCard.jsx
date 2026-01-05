import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { DateRangePanel } from './DateRangePanel'
import { GuestsPanel } from './GuestsPanel'
import { useSelector } from "react-redux"
import { buildSearchParams, parseSearchParams, formatGuestsLabel, nightsBetween, formatMoney } from "../services/util.service.js"


export function StickyCard({ selectedDates }) {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { stayId } = useParams()

    const [isFilled, setIsFilled] = useState(false)
    const [formData, setFormData] = useState({
        checkin: '',
        checkout: '',
        guests: ''
    })

    const [activePanel, setActivePanel] = useState(null)
    const dateAnchorRef = useRef(null)
    const guestsAnchorRef = useRef(null)
    const stickyCardRef = useRef(null)
    const datePanelRef = useRef(null)
    const guestsPanelRef = useRef(null)

    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })

    const stay = useSelector(selector => selector.stayModule.stay)
    const nightlyPrice = Number(stay?.price) || 0

    const nights = nightsBetween(formData.checkin, formData.checkout)
    const subtotal = nightlyPrice * nights

    useEffect(() => {
        const parsed = parseSearchParams(searchParams)
        const checkin = parsed.checkIn || ""
        const checkout = parsed.checkOut || ""

        setFormData(prev => ({ ...prev, checkin, checkout }))

        if (parsed.guests) {
            setGuests(parsed.guests)
            setFormData(prev => ({ ...prev, guests: formatGuestsLabel(parsed.guests) }))
        }

        if (checkin && checkout) setIsFilled(true)
    }, [searchParams])

    useEffect(() => {
        if (!selectedDates) return
        const { checkIn, checkOut } = selectedDates
        setFormData(prev => ({ ...prev, checkin: checkIn || prev.checkin, checkout: checkOut || prev.checkout }))
        if (checkIn && checkOut) setIsFilled(true)
    }, [selectedDates])

    useEffect(() => {
        setFormData(prev => ({ ...prev, guests: formatGuestsLabel(guests) }))
    }, [guests])

    // Auto-open DateRangePanel when navigating to sticky-card
    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash === '#sticky-card') {
                setActivePanel('dates')
            }
        }

        // Check on mount
        if (window.location.hash === '#sticky-card') {
            setActivePanel('dates')
        }

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    // Close active panel on outside click (but not on hover/mouseleave)
    useEffect(() => {
        if (!activePanel) return

        const handleDocumentMouseDown = (event) => {
            const target = event.target
            const isInsideDates = datePanelRef.current && datePanelRef.current.contains(target)
            const isInsideGuests = guestsPanelRef.current && guestsPanelRef.current.contains(target)
            const isInsideAnchors = (
                (dateAnchorRef.current && dateAnchorRef.current.contains(target)) ||
                (guestsAnchorRef.current && guestsAnchorRef.current.contains(target))
            )

            if (isInsideDates || isInsideGuests || isInsideAnchors) return
            setActivePanel(null)
        }

        document.addEventListener('mousedown', handleDocumentMouseDown)
        return () => document.removeEventListener('mousedown', handleDocumentMouseDown)
    }, [activePanel])

    const handleCheckAvailability = () => {
        const hasBothDates = Boolean(formData.checkin && formData.checkout)
        if (!hasBothDates) {
            setActivePanel('dates')
            return
        }
        const params = buildSearchParams({
            checkIn: formData.checkin,
            checkOut: formData.checkout,
            guests   // { adults, children, infants, pets }
        })
        navigate(`/stay/${stayId}/order?${params.toString()}`)
    }

    const getButtonText = () => {
        return isFilled ? 'Reserve' : 'Check availability'
    }

    const getFieldValue = (fieldName) => {
        if (!isFilled) {
            return fieldName === 'guests' ? 'Add guests' : 'Add date'
        }
        return formData[fieldName]
    }

    const closePanels = () => setActivePanel(null)

    return (
        <aside className="sticky-card" ref={stickyCardRef}>
            <div className="sticky-card-inner">
                <div className="sticky-card-header">
                    {isFilled && formData.checkin && formData.checkout ? (
                        <>
                            {/* <span style={{ color: "#6b6b6b", fontSize: "16px" }}>{formatMoney(nightlyPrice)} / night</span><br /> */}
                            {nights > 0 && (
                                <>
                                    <span className="total-price">{formatMoney(subtotal)}</span>
                                    <span className="nights-amount">for {nights} night{nights > 1 ? "s" : ""}</span>
                                </>
                            )}
                        </>
                    ) : (
                        <span className="add-dates">Add dates for prices</span>
                    )}
                </div>
                <div className="sticky-card-fields">
                    <div className="field" ref={dateAnchorRef}>
                        <label>Check-in</label>
                        <div
                            className="input like-input"
                            onClick={() => setActivePanel('dates')}
                            role="button"
                            tabIndex={0}
                        >{getFieldValue('checkin')}</div>
                    </div>
                    <div className="field">
                        <label>Check-out</label>
                        <div
                            className="input like-input"
                            onClick={() => setActivePanel('dates')}
                            role="button"
                            tabIndex={0}
                        >{getFieldValue('checkout')}</div>
                    </div>
                    <div className="field" ref={guestsAnchorRef}>
                        <label>Guests</label>
                        <div
                            className="input like-input"
                            onClick={() => setActivePanel('guests')}
                            role="button"
                            tabIndex={0}
                        >{getFieldValue('guests')}</div>
                    </div>
                </div>
                <button
                    className="sticky-card-btn"
                    type="button"
                    onClick={handleCheckAvailability}
                >
                    {getButtonText()}
                </button>

                {activePanel === 'dates' && (
                    <div className="popover-small bottom-aligned" ref={datePanelRef}>
                        <DateRangePanel
                            value={{ checkIn: formData.checkin, checkOut: formData.checkout }}
                            onChange={(next) => {
                                setFormData(prev => ({ ...prev, checkin: next.checkIn, checkout: next.checkOut }))
                                if (next.checkIn && next.checkOut) setIsFilled(true) // DateRangePanel should fill only one field at a time 
                                // if (next.checkIn && next.checkOut) {
                                //     setIsFilled(true)
                                //     setActivePanel(null)
                                // }
                            }}
                            onComplete={closePanels}
                        />
                    </div>
                )}

                {activePanel === 'guests' && (
                    <div className="popover-small-guests bottom-aligned" ref={guestsPanelRef}>
                        <GuestsPanel
                            value={guests}
                            onChange={(partial) => {
                                // partial is {guests: next}
                                if (partial?.guests) setGuests(partial.guests)
                            }}
                            onComplete={closePanels}
                        />
                    </div>
                )}
            </div>
        </aside>
    )
}
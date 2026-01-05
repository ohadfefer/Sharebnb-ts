import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useLocation, NavLink } from "react-router-dom"
import { formatGuestsLabel } from "../services/util.service"
import searchIcon from "../assets/logo/icons/search-black.svg"
import { FilterSheet } from "./FilterSheet.jsx"

function useCenterActiveTab() {
    const { pathname } = useLocation()
    useEffect(() => {
        const scroller = document.querySelector(".nav-links-mobile")
        const active = document.querySelector(".nav-links-mobile a.active")
        if (!scroller || !active) return
        active.scrollIntoView({ behavior: "instant", inline: "center", block: "nearest" })
    }, [pathname])
}


export function AppHeaderMobile() {
    useCenterActiveTab()

    const filterBy = useSelector(s => s.stayModule.filterBy)
    const [open, setOpen] = useState(false)

    const address = filterBy?.address || "Anywhere"
    const dates =
        filterBy?.checkIn && filterBy?.checkOut
            ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
                .formatRange(new Date(filterBy.checkIn), new Date(filterBy.checkOut))
            : "Anytime"
    const guests = formatGuestsLabel(filterBy?.guests) || "Add guests"

    const isDefault = address === "Anywhere" && dates === "Anytime" && guests === "Add guests"

    return (
        <header className={`m-header full ${open ? "is-open" : ""}`}>
            {!open && (
                <nav className="m-header__bar">
                    <button
                        type="button"
                        className="m-search-pill"
                        onClick={() => setOpen(true)}
                        aria-expanded="true"
                        aria-controls="filter-sheet"
                    >
                        {isDefault ? (
                            <span className="search-pill-placeholder">
                                <img src={searchIcon} alt="" width={16} height={16} className="search-icon-mobile"/>
                                <span>Start your search</span>
                            </span>
                        ) : (
                            <>
                                <span className="pill-primary">{address}</span>
                                <span className="pill-dot">•</span>
                                <span className="pill-secondary">{dates}</span>
                                <span className="pill-dot">•</span>
                                <span className="pill-secondary">{guests}</span>
                            </>
                        )}
                    </button>
                </nav>
            )}

            {/* Tabs row + close button */}
            <div className="m-tabs-row">
                <div className="nav-links-mobile" role="tablist" aria-label="Content type">
                    <NavLink to="/stay" role="tab">
                        <img
                            src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-ActivitySetup/original/b5a7ef95-2d3a-4aaa-b9d7-6f8c4a91aa2d.png"
                            alt=""
                            className="nav-icon"
                        />
                        <span className="nav-text">Homes</span>
                    </NavLink>

                    <NavLink to="/about" role="tab">
                        <img
                            src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-ActivitySetup/original/02579423-5d4b-4c71-bedb-0ea18cd293f8.png"
                            alt=""
                            className="nav-icon"
                        />
                        <span className="nav-text">Experiences</span>
                    </NavLink>

                    <NavLink to="/chat" role="tab">
                        <img
                            src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-ActivitySetup/original/1de966ec-197f-4b72-bbb1-cf4c91876dfa.png"
                            alt=""
                            className="nav-icon"
                        />
                        <span className="nav-text">Services</span>
                    </NavLink>
                </div>

                {open && (
                    <button
                        type="button"
                        className="tabs-close"
                        aria-label="Close search"
                        onClick={() => setOpen(false)}
                    >
                        ×
                    </button>
                )}
            </div>

            {open && (
                <FilterSheet id="filter-sheet" initial={filterBy} onClose={() => setOpen(false)} />
            )}
        </header>
    )
}

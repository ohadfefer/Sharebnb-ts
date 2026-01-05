import { NavLink, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState, useRef, useEffect } from "react"

import logo from '../assets/logo/sharebnb-logo.svg'
import hamburger from '../assets/logo/icons/hamburger.svg'
import language from '../assets/logo/icons/language.svg'

import { useHeaderControl } from '../customHooks/useHeaderControl.js'
import { StayFilter } from '../cmps/StayFilter.jsx'
import { logout } from "../store/actions/user.actions"


export function AppHeaderDesktop() {
    const navigate = useNavigate()
    const { filterBy } = useSelector(state => state.stayModule)
    const loggedInUser = useSelector(state => state.userModule.user)

    const { mini: miniFromHook, sticky } = useHeaderControl(80, {
        forceMiniOnMatch: "/stay/:id",
        hysteresisPx: 12,
    })

    const [manualMini, setManualMini] = useState(null)
    const mini = manualMini ?? miniFromHook

    const [openMenu, setOpenMenu] = useState(false)
    const menuAnchorRef = useRef(null)
    const toggleMenu = () => setOpenMenu(v => !v)

    // close on outside click
    useEffect(() => {
        const onDown = (e) => {
            if (!menuAnchorRef.current?.contains(e.target)) setOpenMenu(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, [])


    function handleRequestExpand() {
        setManualMini(false)
    }

    function handlePopoverComplete() {
        setManualMini(true)
        setTimeout(() => setManualMini(null), 350);
    }

    return (
        <header
            className={`app-header ${mini ? "is-mini" : "is-expanded"} ${sticky ? "is-sticky" : "is-unset"
                } full`}
        >
            <div className="main-container">
                <nav className="nav-bar">
                    {/* LOGO */}
                    <NavLink to="/stay" className="logo">
                        <img src={logo} alt="" width={30} height={30} />
                        <span className="brand">sharebnb</span>
                    </NavLink>

                    {/* CENTER: NAV + FILTER */}
                    <div className="header-main">
                        {!mini && (
                            <div className="nav-links">
                                <NavLink to="stay">
                                    <img
                                        src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-ActivitySetup/original/b5a7ef95-2d3a-4aaa-b9d7-6f8c4a91aa2d.png"
                                        alt=""
                                        className="nav-icon"
                                    />
                                    <span className="nav-text">Homes</span>
                                </NavLink>

                                <NavLink to="about">
                                    <img
                                        src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-ActivitySetup/original/02579423-5d4b-4c71-bedb-0ea18cd293f8.png"
                                        alt=""
                                        className="nav-icon"
                                    />
                                    <span className="nav-text">Experiences</span>
                                </NavLink>

                                <NavLink to="chat">
                                    <img
                                        src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-ActivitySetup/original/1de966ec-197f-4b72-bbb1-cf4c91876dfa.png"
                                        alt=""
                                        className="nav-icon"
                                    />
                                    <span className="nav-text">Services</span>
                                </NavLink>
                            </div>
                        )}

                        <div className="filter">
                            <StayFilter
                                mini={mini}
                                filterBy={filterBy}
                                onRequestExpand={handleRequestExpand}
                                onPopoverComplete={handlePopoverComplete}
                            />
                        </div>
                    </div>

                    {/* RIGHT: ICONS + MENU (anchored) */}
                    <div className="side-links" ref={menuAnchorRef}>
                        <button type="button" className="become-host">Become a host</button>

                        {loggedInUser?.imgUrl ? (
                            <img src={loggedInUser.imgUrl} alt="" width={40} height={40} className="icon-btn" />
                        ) : (
                            <button type="button" className="icon-btn" aria-label="Language">
                                <img src={language} alt="" width={24} height={24} />
                            </button>
                        )
                        }

                        <button
                            type="button"
                            className="icon-btn"
                            aria-label="Menu"
                            aria-haspopup="menu"
                            aria-expanded={openMenu ? "true" : "false"}
                            aria-controls="header-menu"
                            onClick={toggleMenu}
                        >
                            <img src={hamburger} alt="" width={24} height={24} />
                        </button>

                        {openMenu && (
                            <div id="header-menu" className="header-menu" role="menu">
                                <div className="menu-header">
                                    <span className="menu-icon">?</span>
                                    <span>Help Center</span>
                                </div>

                                <hr />

                                <button className="menu-row" role="menuitem" onClick={() => { navigate('/hosting/listings'); setOpenMenu(false) }}>
                                    <div className="menu-row-text">
                                        <span className="menu-title">Become a host</span>
                                        <span className="menu-sub">
                                            It's easy to start hosting and earn extra income.
                                        </span>
                                    </div>
                                    <img
                                        className="menu-illus"
                                        alt=""
                                        src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-ActivitySetup/original/1de966ec-197f-4b72-bbb1-cf4c91876dfa.png"
                                    />
                                </button>

                                <hr />

                                <button className="menu-row" role="menuitem" onClick={() => { navigate('/wishlists'); setOpenMenu(false) }}>Wishlists</button>
                                <button className="menu-row" role="menuitem" onClick={() => { navigate('/trips'); setOpenMenu(false) }}>Trips</button>
                                <button className="menu-row" role="menuitem" onClick={() => { navigate('/dashboard/reservations'); setOpenMenu(false) }}>Dashboard</button>
                                <button className="menu-row" role="menuitem" onClick={() => { navigate('/dashboard/listings'); setOpenMenu(false) }}>Listings</button>

                                <hr />

                                <button className="menu-row" role="menuitem">Refer a Host</button>
                                <button className="menu-row" role="menuitem">Find a co-host</button>
                                <button className="menu-row" role="menuitem">Gift cards</button>

                                <hr />

                                {loggedInUser ? (
                                    <div className="menu-auth-rows">
                                        <button
                                            className="menu-row"
                                            role="menuitem"
                                            onClick={async () => {
                                                await logout()
                                                setOpenMenu(false)
                                                navigate('/')
                                            }}
                                        >Logout</button>
                                    </div>
                                ) : (
                                    <div className="menu-auth-rows">
                                        <button className="menu-row" role="menuitem" onClick={() => { navigate('/auth/login'); setOpenMenu(false) }}>Log in</button>
                                        <button className="menu-row" role="menuitem" onClick={() => { navigate('/auth/signup'); setOpenMenu(false) }}>Sign up</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}
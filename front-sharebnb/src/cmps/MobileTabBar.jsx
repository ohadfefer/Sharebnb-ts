import { NavLink, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { shouldHideTabbar } from "../services/helpers/routeFlags.js"

import Explore from '../assets/logo/icons/explore.svg'
import Wishlists from '../assets/logo/icons/wishlist.svg'
import Trips from '../assets/logo/icons/trips.svg'
import Messages from '../assets/logo/icons/messages.svg'
import Profile from '../assets/logo/icons/login.svg'

export function MobileTabBar({ forceHide }) {
    const { pathname } = useLocation()
    const user = useSelector(s => s.userModule?.user)
    const unread = useSelector(s => s.inboxModule?.unreadCount || 0) 

    const hidden = forceHide ?? shouldHideTabbar(pathname)
    if (hidden) return null

    const items = user
        ? [
            { to: "/stay", label: "Explore", icon: Explore },
            { to: "/wishlists", label: "Wishlists", icon: Wishlists },
            { to: "/trips", label: "Trips", icon: Trips },
            { to: "/chat", label: "Messages", icon: Messages, badge: unread },
            { to: `/user/${user._id || "me"}`, label: "Profile", icon: Profile },
        ]
        : [
            { to: "/stay", label: "Explore", icon: Explore },
            { to: "/wishlists", label: "Wishlists", icon:Wishlists },
            { to: "/auth/login", label: "Log in", icon: Profile },
        ]

    return (
        <>
            <nav className="m-tabbar" role="navigation" aria-label="Bottom tabs">
                {items.map(({ to, label, icon, badge }) => (
                    <NavLink key={to} to={to} className={({ isActive }) => `tab${isActive ? " active" : ""}`} end>
                        <img className="icon" src={icon} alt="" width={24} aria-hidden />
                        {badge ? <span className="badge" aria-label={`${badge} unread`}>{badge}</span> : null}
                        <span className="text">{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="m-tabbar-spacer" aria-hidden />
        </>
    )
}

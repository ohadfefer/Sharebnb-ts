import { Routes, Route, Navigate } from 'react-router'
import { useEffect } from 'react'

import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs.jsx'
import { StayIndex } from './pages/StayIndex.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'
import { StayExplore } from './pages/StayExplore.jsx'
import { StayEditor } from './pages/StayEditor.jsx'
import { TripIndex } from './pages/TripIndex.jsx'
import { OrderConfirmation } from './pages/OrderConfirmation.jsx'

import { StayDetails } from './pages/StayDetails.jsx'

import { UserDetails } from './pages/UserDetails.jsx'
import { WishlistIndex } from './pages/WishlistIndex.jsx'

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { UserMsg } from './cmps/UserMsg.jsx'
import { MobileTabBar } from './cmps/MobileTabBar.jsx'

import { LoginSignup, Login, Signup } from './pages/LoginSignup.jsx'
import { StayOrder } from './pages/StayOrder.jsx'
import { StayReservations } from './pages/StayReservations.jsx'
import { StayListings } from './pages/StayListings.jsx'
import { initUser } from './store/actions/user.actions.js'


export function RootCmp() {
    useEffect(() => {
        // Initialize user state from sessionStorage when app loads
        initUser()
    }, [])

    return (
        <div className="main-container">
            <AppHeader />
            <UserMsg />
            <main>
                <Routes>
                    <Route path="/" element={<Navigate to="/stay" replace />} />
                    <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route>
                    <Route path="dashboard/reservations" element={<StayReservations />} />
                    <Route path="dashboard/listings" element={<StayListings />} />
                    <Route path="trips" element={<TripIndex />} />
                    <Route path="stay" element={<StayIndex />} />
                    <Route path="explore" element={<StayExplore />} />
                    <Route path="stay/:stayId" element={<StayDetails />} />
                    <Route path="stay/:stayId/order" element={<StayOrder />} />
                    <Route path="wishlists" element={<WishlistIndex />} />
                    <Route path="order/:orderId/confirmation" element={<OrderConfirmation />} />
                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="review" element={<ReviewIndex />} />
                    <Route path="chat" element={<ChatApp />} />
                    <Route path="admin" element={<AdminIndex />} />
                    <Route path="auth" element={<LoginSignup />}>
                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                    <Route path="hosting/listings" element={<StayEditor />} />
                    <Route path="hosting/listings/edit/:stayId" element={<StayEditor />} />
                </Routes>
            </main>
            <AppFooter />
            <MobileTabBar />
        </div>
    )
}



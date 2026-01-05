
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { stayService } from '../services/stay'
import { StayList } from '../cmps/StayList'
import Skeleton from 'react-loading-skeleton'
import '../assets/styles/cmps/WishlistIndex.css'

export function WishlistIndex() {
    const { user } = useSelector(s => s.userModule)
    const [wishlistStays, setWishlistStays] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (user) {
            loadWishlistStays()
        } else {
            setIsLoading(false)
        }
    }, [user])

    const loadWishlistStays = async () => {
        try {
            setIsLoading(true)
            const stays = await stayService.getWishlistStays(user._id)
            setWishlistStays(stays)
        } catch (err) {
            console.error('Failed to load wishlist stays:', err)
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="wishlist-index">
                <div className="wishlist-header">
                    <h1>Your Wishlist</h1>
                    <p>Please log in to view your saved stays.</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="wishlist-index">
                <div className="wishlist-header">
                    <h1>Your Wishlist</h1>
                </div>
                <section>
                    <ul className="stay-list">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <li key={`skel-${i}`}>
                                <div className="stay-preview skeleton">
                                    <div className="carousel skel-img">
                                        <Skeleton width="100%" height={300} />
                                    </div>
                                    <div className="preview-txt">
                                        <Skeleton width="60%" height={16} />
                                        <div style={{ marginTop: 2 }}><Skeleton width={120} height={16} /></div>
                                        <div style={{ marginTop: 2 }}><Skeleton width={100} height={16} /></div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        )
    }

    return (
        <div className="wishlist-index">
            <div className="wishlist-header">
                <h1>Your Wishlist</h1>
                <p>{wishlistStays.length} {wishlistStays.length === 1 ? 'stay' : 'stays'} saved</p>
            </div>
            
            {wishlistStays.length === 0 ? (
                <div className="empty-wishlist">
                    <h2>No stays saved yet</h2>
                    <p>Start exploring and save stays you love to your wishlist!</p>
                </div>
            ) : (
                <StayList stays={wishlistStays} />
            )}
        </div>
    )
}

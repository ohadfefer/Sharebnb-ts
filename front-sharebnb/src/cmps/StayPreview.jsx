import { NavLink, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Mousewheel, Keyboard } from 'swiper/modules'
import { formatDateRangeShort } from '../services/util.service'
import { useSelector } from 'react-redux'
import { stayService } from '../services/stay'
import heart2 from '../assets/logo/icons/heart2.svg'
import filledHeart2 from '../assets/logo/icons/filledHeart2.svg'
import '../assets/styles/cmps/WishlistIndex.css'

export function StayPreview({ stay, loading = false }) {
    const { user } = useSelector(s => s.userModule)
    const [isSaved, setIsSaved] = useState(false)

    // Check if stay is already saved when component loads
    useEffect(() => {
        if (stay && user && stay.wishlist) {
            const isInWishlist = stay.wishlist.some(entry => entry.userId === user._id)
            setIsSaved(isInWishlist)
        }
    }, [stay, user])

    const handleSaveClick = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!user) {
            // Redirect to login or show login modal
            return
        }

        try {
            if (isSaved) {
                await stayService.removeFromWishlist(stay._id, user._id)
                setIsSaved(false)
            } else {
                await stayService.addToWishlist(stay._id, user._id)
                setIsSaved(true)
            }
        } catch (err) {
            console.error('Error updating wishlist:', err)
        }
    }

    if (loading) {
        return (
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
        )
    }

    // ---------- Real card ----------
    const [imgReady, setImgReady] = useState(false)
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()
    const toUrl = queryString ? `/stay/${stay._id}?${queryString}` : `/stay/${stay._id}`

    const imgs = Array.isArray(stay.imgUrls) && stay.imgUrls.length ? stay.imgUrls : ['']

    return (
        <NavLink to={toUrl} className="stay-preview">
            <div className="carousel skel-holder">
                {/* overlay skeleton until first image loads */}
                {!imgReady && <Skeleton className="skel-abs" />}

                <Swiper
                    cssMode
                    navigation
                    pagination
                    mousewheel
                    keyboard
                    modules={[Navigation, Pagination, Mousewheel, Keyboard]}
                    className="carousel-inner"
                >
                    <button 
                        className={`heart-icon ${isSaved ? 'saved' : ''}`}
                        onClick={handleSaveClick}
                        title={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <img src={isSaved ? filledHeart2 : heart2} alt={isSaved ? "filledHeart2" : "heart2"} width={16} />
                    </button>

                    {imgs.map((img, idx) => (
                        <SwiperSlide className="preview-picture" key={idx}>
                            <img
                                className="carousel-img"
                                src={img}
                                alt=""
                                onLoad={() => idx === 0 && setImgReady(true)}
                                onError={() => idx === 0 && setImgReady(true)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="preview-txt">
                <p className="preview-title">{stay.type} in {stay.loc?.city}</p>

                {stay.availableDates?.map((range, idx) => (
                    <p key={idx} className="preview-date">
                        {formatDateRangeShort(range.start, range.end)}
                    </p>
                ))}

                <p className="preview-details">
                    <span>${Number(stay.price || 0).toLocaleString()} for 1 night</span>
                </p>
            </div>
        </NavLink>
    )
}

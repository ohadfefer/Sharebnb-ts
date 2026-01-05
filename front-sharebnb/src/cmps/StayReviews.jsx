import cleanliness from '../assets/logo/icons/cleanliness.svg'
import accuracy from '../assets/logo/icons/accuracy.svg'
import key from '../assets/logo/icons/key.svg'
import chat from '../assets/logo/icons/chat.svg'
import map from '../assets/logo/icons/map.svg'
import value from '../assets/logo/icons/value.svg'
import star from '../assets/logo/icons/star.svg'

import { FaStar } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { eventBus, OPEN_REVIEWS_MODAL } from '../services/event-bus.service'

export function StayReviews({ stay }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!stay || !stay.reviews || stay.reviews.length === 0) {
        return (
            <div className="stay-reviews">
                <h2>Reviews</h2>
                <p>No reviews yet</p>
            </div>
        )
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar
                key={index}
                className={`star ${index < rating ? 'filled' : 'empty'}`}
            />
        ))
    }

    // const avgRate = stay.reviews.length
    //     ? stay.reviews.reduce((acc, r) => acc + r.rate, 0) / stay.reviews.length
    //     : 0
    const avgRate = stay.rating

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    useEffect(() => {
        const off = eventBus.on(OPEN_REVIEWS_MODAL, () => setIsModalOpen(true))
        return () => off && off()
    }, [])

    return (
        <>
            <div className="reviews-cmp-container">

                <div className="rates-info">
                    <div className="rates-header">
                        <img src={star} alt="average rating" width={20} />
                        <span>
                            {/* {avgRate.toFixed(2)} · {stay.reviews.length} reviews */}
                            {avgRate} · {stay.reviews.length} reviews
                        </span>
                    </div>
                    <div className="rates-details">
                        <div className="rate-type-container">
                            <div className="rate-type">
                                <div className="rate-type-header">
                                    <div>Cleanliness</div>
                                    <div>4.9</div>
                                </div>
                                <img src={cleanliness} alt="cleanliness" width={32} />
                            </div>
                            <div className="rate-type">
                                <div className="rate-type-header">
                                    <div>Accuracy</div>
                                    <div>4.9</div>
                                </div>
                                <img src={accuracy} alt="accuracy" width={32} />
                            </div>
                            <div className="rate-type">
                                <div className="rate-type-header">
                                    <div>Check-in</div>
                                    <div>4.9</div>
                                </div>
                                <img src={key} alt="key" width={32} />
                            </div>
                            <div className="rate-type">
                                <div className="rate-type-header">
                                    <div>Communication</div>
                                    <div>4.9</div>
                                </div>
                                <img src={chat} alt="chat" width={32} />
                            </div>
                            <div className="rate-type">
                                <div className="rate-type-header">
                                    <div>Location</div>
                                    <div>4.9</div>
                                </div>
                                <img src={map} alt="map" width={32} />
                            </div>
                            <div className="rate-type">
                                <div className="rate-type-header">
                                    <div>Value</div>
                                    <div>4.9</div>
                                </div>
                                <img src={value} alt="value" width={32} />
                            </div>
                        </div>

                    </div>
                    <hr className='divider-long' />
                </div>
                <div className="stay-reviews">
                    <div className="reviews-grid">
                        {stay.reviews.slice(0, 6).map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <div className="user-info">
                                        <div className="user-personal-info">
                                            <img
                                                src={review.by.imgUrl}
                                                alt={review.by.fullname}
                                                className="user-avatar"
                                                onError={(e) => {
                                                    e.target.src = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
                                                }}
                                            />
                                            <div className="user-details">
                                                <h4 className="user-name">{review.by.fullname}</h4>
                                                <p className="user-location">
                                                    {stay.loc.city}, {stay.loc.country}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="additional-info-container">
                                            <div className="rating">
                                                {/* {renderStars(review.rate)} */}
                                                {renderStars(stay.rating)}
                                            </div>
                                            ·<span className='date-published'> June 2025 </span> ·
                                            <span className='additional-user-info'>Stayed with kids</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="review-content">
                                    <p className="review-text">{review.txt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {stay.reviews.length > 8 && (
                        <div className="show-all-reviews">
                            <button onClick={openModal}>Show all {stay.reviews.length} reviews</button>
                        </div>
                    )}
                </div>

            </div>

            {/* reviews modal */}
            {isModalOpen && (
                <div className="reviews-modal-overlay" onClick={closeModal}>
                    <div className="reviews-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">
                                <img src={star} alt="average rating" width={20} />
                                {/* <span>{avgRate.toFixed(2)} · {stay.reviews.length} reviews</span> */}
                                <span>{stay.rating} · {stay.reviews.length} reviews</span>
                            </div>
                            <button className="modal-close" onClick={closeModal}>x</button>
                        </div>
                        <div className="modal-content">
                            {stay.reviews.map((review) => (
                                <div key={review.id} className="modal-review-item">
                                    <div className="review-header">
                                        <div className="user-info">
                                            <div className="user-personal-info">
                                                <img
                                                    src={review.by.imgUrl}
                                                    alt={review.by.fullname}
                                                    className="user-avatar"
                                                    onError={(e) => {
                                                        e.target.src = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
                                                    }}
                                                />
                                                <div className="user-details">
                                                    <h4 className="user-name">{review.by.fullname}</h4>
                                                    <p className="user-location">
                                                        {stay.loc.city}, {stay.loc.country}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="additional-info-container">
                                                <div className="rating">
                                                    {/* {renderStars(review.rate)} */}
                                                    {renderStars(stay.rating)}
                                                </div>
                                                ·<span className='date-published'> June 2025 </span> ·
                                                <span className='additional-user-info'>Stayed with kids</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="review-content">
                                        <p className="review-text">{review.txt}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}
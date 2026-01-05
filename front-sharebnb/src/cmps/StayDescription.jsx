import door from '../assets/logo/icons/door.svg'
import pin from '../assets/logo/icons/pin.svg'
import parking from '../assets/logo/icons/parking.svg'
import star from '../assets/logo/icons/star.svg'
import { eventBus, OPEN_REVIEWS_MODAL } from '../services/event-bus.service'

export function StayDescription({ stay }) {
    // guard input
    const reviews = Array.isArray(stay?.reviews) ? stay.reviews : []

    // numeric ratings only
    const ratings = reviews
        .map(r => Number(r?.rate))
        .filter(n => Number.isFinite(n))

    const avgRate = ratings.length
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null

    const ratingText = Number.isFinite(avgRate) ? avgRate.toFixed(2) : 'No ratings yet'
    const reviewsCount = reviews.length

    const capacity = Number.isFinite(+stay?.capacity) ? +stay.capacity : null
    const bedrooms = Number.isFinite(+stay?.bedrooms) ? +stay.bedrooms : null
    const beds = Number.isFinite(+stay?.beds) ? +stay.beds : null
    const baths = Number.isFinite(+stay?.bathrooms) ? +stay.bathrooms : null

    return (
        <div className="stay-description">
            <div className="stay-info">
                <div className='header'>
                    {stay?.type || 'Stay'} hosted by {stay?.host?.fullname || 'Host'}
                </div>

                <p className="capacity">
                    {capacity ?? '2'} guests · {bedrooms ?? '2'} bedrooms · {beds ?? '2'} beds · {baths ?? '2'} baths
                </p>

                <div className="reviews-modal">
                    <img src={star} alt="" width={8} />
                    <span>
                        {/* {Number.isFinite(avgRate)
                            ? `${ratingText} · ${reviewsCount} review${reviewsCount === 1 ? '' : 's'}`
                            : 'No ratings yet'} */}
                        {stay.rating} · 
                        <button className="reviews-count-btn" onClick={() => eventBus.emit(OPEN_REVIEWS_MODAL)}>
                            <span className='open-reviews-modal'>{reviewsCount} review{reviewsCount === 1 ? '' : 's'}</span>
                        </button>
                    </span>
                </div>
            </div>

            <hr className="divider" />

            <div className="stay-info-grid host-grid">
                <div className="column-1">
                    <img 
                        src={stay.host.pictureUrl} 
                        alt={stay.host.fullname} 
                        className="host-image"
                        onError={(e) => {
                            e.target.src = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
                        }}
                    />
                </div>
                <div className="column-2">
                    <p>Hosted by {stay.host.fullname}</p>
                    <p>Superhost · 3 years of hosting</p>
                </div>
            </div>

            <hr className="divider" />

            <div className="stay-info-grid features-grid">
                <div className="grid-row">
                    <div className="column-1">
                        <span className="icon"><img src={door} alt="" width={24} /></span>
                    </div>
                    <div className="column-2">
                        <div className="info-item">
                            <p>Self check-in</p>
                            <p>Check yourself in with the lockbox.</p>
                        </div>
                    </div>
                </div>

                <div className="grid-row">
                    <div className="column-1">
                        <span className="icon"><img src={pin} alt="" width={24} /></span>
                    </div>
                    <div className="column-2">
                        <div className="info-item">
                            <p>Beautiful and walkable</p>
                            <p>Guests say this area is scenic and it's easy to get around.</p>
                        </div>
                    </div>
                </div>

                <div className="grid-row">
                    <div className="column-1">
                        <span className="icon"><img src={parking} alt="" width={24} /></span>
                    </div>
                    <div className="column-2">
                        <div className="info-item">
                            <p>Park for free</p>
                            <p>This is one of the few places in the area with free parking.</p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="divider" />
        </div>
    )
}

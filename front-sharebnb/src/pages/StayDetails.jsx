import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { showSuccessMsg, showRemoveMsg, showErrorMsg } from '../services/event-bus.service'
import { addStayMsg, getCmdSetStay } from '../store/actions/stay.actions'
import { stayService } from '../services/stay/index'
import { StayGallery } from '../cmps/StayGallery'
import { StayDescription } from '../cmps/StayDescription'
import { StayAmenities } from '../cmps/StayAmenities'
import { StayReviews } from '../cmps/StayReviews'
import { StayMap } from '../cmps/StayMap'
import { StickyCard } from '../cmps/StickyCard'
import { DateRangePanel } from '../cmps/DateRangePanel'
import { GuestsPanel } from '../cmps/GuestsPanel'
import { buildSearchParams, parseSearchParams, formatGuestsLabel, nightsBetween, formatMoney } from '../services/util.service.js'

import star from '../assets/logo/icons/star.svg'

export function StayDetails() {
  const { stayId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const stay = useSelector((storeState) => storeState.stayModule.stay)
  const { user } = useSelector(s => s.userModule)
  const dispatch = useDispatch()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNav, setShowNav] = useState(false)
  const [showCardLink, setShowCardLink] = useState(false)
  const [showMobileModal, setShowMobileModal] = useState(false)
  const [dateRange, setDateRange] = useState({ checkIn: '', checkOut: '' })
  const galleryRef = useRef(null)
  const stickyRef = useRef(null)

  // Mobile modal form state
  const [mobileFormData, setMobileFormData] = useState({
    checkin: '',
    checkout: '',
    guests: ''
  })
  const [mobileGuests, setMobileGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })
  const [mobileActivePanel, setMobileActivePanel] = useState(null)
  const [mobileIsFilled, setMobileIsFilled] = useState(false)
  const mobileDatePanelRef = useRef(null)
  const mobileGuestsPanelRef = useRef(null)

  useEffect(() => {
    async function fetchStay() {
      setIsLoading(true)
      try {
        const stay = await stayService.getById(stayId)
        dispatch(getCmdSetStay(stay))
        
        // Check if stay is already saved
        if (user && stay.wishlist) {
          const isInWishlist = stay.wishlist.some(entry => entry.userId === user._id)
          setIsSaved(isInWishlist)
        }
        
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load stay details')
        setIsLoading(false)
        showErrorMsg('Cannot load stay details')
      }
    }
    fetchStay()
  }, [stayId, dispatch, user])

  useEffect(() => {
    function handleScroll() {
      if (galleryRef.current) {
        const rect = galleryRef.current.getBoundingClientRect()
        const shouldShow = rect.bottom <= 0
        setShowNav(shouldShow)
      }
      if (stickyRef.current) {
        const cr = stickyRef.current.getBoundingClientRect()
        const inView = cr.bottom > 0 && cr.top < window.innerHeight
        setShowCardLink(!inView)
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  // Mobile modal form effects
  useEffect(() => {
    const parsed = parseSearchParams(searchParams)
    const checkin = parsed.checkIn || ""
    const checkout = parsed.checkOut || ""

    setMobileFormData(prev => ({ ...prev, checkin, checkout }))

    if (parsed.guests) {
      setMobileGuests(parsed.guests)
      setMobileFormData(prev => ({ ...prev, guests: formatGuestsLabel(parsed.guests) }))
    }

    if (checkin && checkout) setMobileIsFilled(true)
  }, [searchParams])

  useEffect(() => {
    if (!dateRange) return
    const { checkIn, checkOut } = dateRange
    setMobileFormData(prev => ({ ...prev, checkin: checkIn || prev.checkin, checkout: checkOut || prev.checkout }))
    if (checkIn && checkOut) setMobileIsFilled(true)
  }, [dateRange])

  useEffect(() => {
    setMobileFormData(prev => ({ ...prev, guests: formatGuestsLabel(mobileGuests) }))
  }, [mobileGuests])

  // Close mobile panels on outside click
  useEffect(() => {
    if (!mobileActivePanel) return

    const handleDocumentMouseDown = (event) => {
      const target = event.target
      const isInsideDates = mobileDatePanelRef.current && mobileDatePanelRef.current.contains(target)
      const isInsideGuests = mobileGuestsPanelRef.current && mobileGuestsPanelRef.current.contains(target)

      if (isInsideDates || isInsideGuests) return
      setMobileActivePanel(null)
    }

    document.addEventListener('mousedown', handleDocumentMouseDown)
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown)
  }, [mobileActivePanel])

  async function onAddStayMsg(stayId) {
    try {
      await addStayMsg(stayId, 'bla bla ' + parseInt(Math.random() * 10))
      showSuccessMsg(`Stay msg added`)
    } catch (err) {
      showErrorMsg('Cannot add stay msg')
    }
  }

  function handleShare() {
    alert('share')
  }

  async function handleSave() {
    if (!user) {
      showErrorMsg('Please log in to save stays')
      return
    }

    try {
      if (isSaved) {
        await stayService.removeFromWishlist(stay._id, user._id)
        setIsSaved(false)
        showRemoveMsg('Removed from wishlist', stay)
      } else {
        await stayService.addToWishlist(stay._id, user._id)
        setIsSaved(true)
        showSuccessMsg('Added to wishlist', stay)
      }
    } catch (err) {
      console.error('Error updating wishlist:', err)
      showErrorMsg('Failed to update wishlist')
    }
  }

  // Mobile modal helper functions
  const handleMobileCheckAvailability = () => {
    const hasBothDates = Boolean(mobileFormData.checkin && mobileFormData.checkout)
    if (!hasBothDates) {
      setMobileActivePanel('dates')
      return
    }
    const params = buildSearchParams({
      checkIn: mobileFormData.checkin,
      checkOut: mobileFormData.checkout,
      guests: mobileGuests
    })
    navigate(`/stay/${stayId}/order?${params.toString()}`)
  }

  const getMobileButtonText = () => {
    return mobileIsFilled ? 'Reserve' : 'Check availability'
  }

  const getMobileFieldValue = (fieldName) => {
    if (!mobileIsFilled) {
      return fieldName === 'guests' ? 'Add guests' : 'Add date'
    }
    return mobileFormData[fieldName]
  }

  const closeMobilePanels = () => setMobileActivePanel(null)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!stay) return <div>No stay found</div>

  const reviewsCount = stay.reviews?.length || 0
  const avgRate = reviewsCount ? (stay.reviews.reduce((acc, r) => acc + r.rate, 0) / reviewsCount) : 0
  
  // Mobile modal calculations
  const nightlyPrice = Number(stay?.price) || 0
  const mobileNights = nightsBetween(mobileFormData.checkin, mobileFormData.checkout)
  const mobileSubtotal = nightlyPrice * mobileNights

  return (
    <section className="stay-details">
      <nav className={`details-nav ${showNav ? 'shown' : ''}`}>
        <div className="details-nav-left">
          <a href="#photos"><span>Photos</span></a>
          <a href="#amenities"><span>Amenities</span></a>
          <a href="#reviews"><span>Reviews</span></a>
          <a href="#location"><span>Location</span></a>
        </div>
        {showCardLink && (
          <div className="details-nav-right">
            <div className="nav-right-text">
              <div className="title">Add dates for prices</div>
              <div className="sub">
                <img src={star} alt="" width={10} />
                {/* <span className='reviews-avg'>{avgRate.toFixed(2)} · </span>  */}
                <span className='reviews-avg'>{stay.rating} · </span> 
                <span>{reviewsCount} reviews</span>
              </div>
            </div>
            <a href="#sticky-card" className="btn-link"><span>Check availability</span></a>
          </div>
        )}
      </nav>

      <div id="photos" ref={galleryRef}>
        <StayGallery stay={stay} onShare={handleShare} onSave={handleSave} isSaved={isSaved} />
      </div>

      <div className="stay-details-grid">
        <div className="left-col">
          <StayDescription stay={stay} />

          <div className='amenities-header' id="amenities">What this place offers</div>
          <StayAmenities stay={stay} />

          <hr className="divider" />

          <div className='date-picker-header'>
            <div>Select check-in date</div>
            <p>Add your travel dates for exact pricing</p>
          </div>
          <div className="date-picker-container">
            <DateRangePanel value={dateRange} onChange={setDateRange} />
          </div>

        </div>

        <div className="right-col" id="sticky-card" ref={stickyRef}>
          <StickyCard selectedDates={dateRange} />
        </div>
      </div>

      <hr className='divider-long' />

      <div id="reviews">
        <StayReviews stay={stay} />
      </div>

      <hr className='divider-long' />

      <div id="location">
        <StayMap stay={stay} />
      </div>

      {/* Mobile Footer */}
      <div className="mobile-footer">
        <div className="mobile-footer-content">
          <div className="mobile-footer-left">
            <div className="title">Add dates for prices</div>
            <div className="sub">
              <img src={star} alt="" width={10} />
              <span className='reviews-avg'>{stay.rating} · </span> 
              <span>{reviewsCount} reviews</span>
            </div>
          </div>
          <button 
            className="mobile-check-availability-btn" 
            onClick={() => setShowMobileModal(true)}
          >
            Check availability
          </button>
        </div>
      </div>

      {/* Mobile Modal */}
      {showMobileModal && (
        <div className="mobile-modal-overlay" onClick={() => setShowMobileModal(false)}>
          <div className="mobile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-modal-header">
              <h3>Check availability</h3>
              <button 
                className="mobile-modal-close" 
                onClick={() => setShowMobileModal(false)}
              >
                x
              </button>
            </div>
            
            <div className="mobile-modal-sticky-content">
              <div className="mobile-sticky-header">
                {mobileIsFilled && mobileFormData.checkin && mobileFormData.checkout ? (
                  <>
                    {mobileNights > 0 && (
                      <>
                        <span className="total-price">{formatMoney(mobileSubtotal)}</span>
                        <span className="nights-amount">for {mobileNights} night{mobileNights > 1 ? "s" : ""}</span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="add-dates">Add dates for prices</span>
                )}
              </div>
              
              <div className="mobile-sticky-fields">
                <div className="field">
                  <label>Check-in</label>
                  <div
                    className="input like-input"
                    onClick={() => setMobileActivePanel('dates')}
                    role="button"
                    tabIndex={0}
                  >{getMobileFieldValue('checkin')}</div>
                </div>
                <div className="field">
                  <label>Check-out</label>
                  <div
                    className="input like-input"
                    onClick={() => setMobileActivePanel('dates')}
                    role="button"
                    tabIndex={0}
                  >{getMobileFieldValue('checkout')}</div>
                </div>
                <div className="field">
                  <label>Guests</label>
                  <div
                    className="input like-input"
                    onClick={() => setMobileActivePanel('guests')}
                    role="button"
                    tabIndex={0}
                  >{getMobileFieldValue('guests')}</div>
                </div>
              </div>
              
              <button
                className="mobile-sticky-btn"
                type="button"
                onClick={handleMobileCheckAvailability}
              >
                {getMobileButtonText()}
              </button>

              {mobileActivePanel === 'dates' && (
                <div className="mobile-popover-overlay" onClick={closeMobilePanels}>
                  <div className="mobile-popover-small bottom-aligned" ref={mobileDatePanelRef} onClick={(e) => e.stopPropagation()}>
                    <DateRangePanel
                      value={{ checkIn: mobileFormData.checkin, checkOut: mobileFormData.checkout }}
                      onChange={(next) => {
                        setMobileFormData(prev => ({ ...prev, checkin: next.checkIn, checkout: next.checkOut }))
                        if (next.checkIn && next.checkOut) setMobileIsFilled(true)
                      }}
                      onComplete={closeMobilePanels}
                    />
                  </div>
                </div>
              )}

              {mobileActivePanel === 'guests' && (
                <div className="mobile-popover-overlay" onClick={closeMobilePanels}>
                  <div className="mobile-popover-small-guests bottom-aligned" ref={mobileGuestsPanelRef} onClick={(e) => e.stopPropagation()}>
                    <GuestsPanel
                      value={mobileGuests}
                      onChange={(partial) => {
                        if (partial?.guests) setMobileGuests(partial.guests)
                      }}
                      onComplete={closeMobilePanels}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  )
}
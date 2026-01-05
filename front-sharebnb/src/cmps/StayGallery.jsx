import heart from '../assets/logo/icons/heart.svg'
import share from '../assets/logo/icons/share.svg'
import filledHeart from '../assets/logo/icons/filledHeart.svg'
import { Link } from 'react-router-dom'

export function StayGallery({ stay, onShare, onSave, isSaved }) {

  return (
    <section className="stay-gallery">
      <div className="stay-gallery-container">
        <div className="stay-header">
          <h1>Welcome to {stay.name}</h1>
          <div className="stay-actions">
            <button className="share-btn" onClick={onShare}>
              <div className='share-btn-container'>
                <img src={share} alt="share" width={16} /> Share
              </div>
            </button>
            <button className="save-btn" onClick={onSave}>
              <div className="save-btn-container">
                <img src={isSaved ? filledHeart : heart} alt={isSaved ? "filledHeart" : "heart"} width={16} />
                {isSaved ? 'Saved' : 'Save'}
              </div>
            </button>
          </div>
        </div>
        <div className="gallery-grid">
          {stay.imgUrls && stay.imgUrls.length > 0 ? (
            <>
              <img
                src={stay.imgUrls[0]}
                alt="Main stay"
                className="main-img"
              />
              {stay.imgUrls.slice(1, 5).map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Stay ${idx + 1}`}
                  className={`side-img side-img-${idx}`}
                />
              ))}
            </>
          ) : (
            <p>No images available</p>
          )}
        </div>
        <div className="mobile-actions">
          <Link to="/" className="back-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <button className="mobile-share-btn" onClick={onShare}>
            <img src={share} alt="share" width={20} />
          </button>
          <button className="mobile-save-btn" onClick={onSave}>
            <img src={isSaved ? filledHeart : heart} alt={isSaved ? "filledHeart" : "heart"} width={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
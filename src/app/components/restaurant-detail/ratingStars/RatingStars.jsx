'use client'
import './RatingStars.css'

export default function RatingStars({ rating, onRate, size = 'medium', readonly = false }) {
  const stars = [1, 2, 3, 4, 5]
  
  const getStarSize = () => {
    switch(size) {
      case 'small': return '0.9rem'
      case 'large': return '1.8rem'
      default: return '1.3rem'
    }
  }

  return (
    <div className="rating-stars">
      {stars.map(star => (
        <button
          key={star}
          className={`star ${star <= rating ? 'active' : ''} ${size} ${readonly ? 'readonly' : ''}`}
          onClick={() => !readonly && onRate && onRate(star)}
          disabled={readonly}
          style={{ fontSize: getStarSize() }}
        >
          ★
        </button>
      ))}
    </div>
  )
}
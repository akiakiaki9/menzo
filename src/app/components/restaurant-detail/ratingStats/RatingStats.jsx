'use client'
import { FaStar, FaConciergeBell, FaCrown, FaSmile, FaThumbsUp } from 'react-icons/fa'
import { GiMeal } from 'react-icons/gi'
import './RatingStats.css'

export default function RatingStats({ stats, onRateClick, userRated = false, isGold = false }) {
  if (!stats) return null

  const getRatingText = (rating) => {
    if (rating >= 4.8) return 'Превосходно'
    if (rating >= 4.5) return 'Отлично'
    if (rating >= 4.0) return 'Очень хорошо'
    if (rating >= 3.5) return 'Хорошо'
    if (rating >= 3.0) return 'Неплохо'
    return 'Средне'
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#f39c12'
    if (rating >= 4.0) return '#e67e22'
    if (rating >= 3.5) return '#d35400'
    if (rating >= 3.0) return '#f1c40f'
    return '#95a5a6'
  }

  const overallRating = stats.overall || stats.rating || 0
  const ratingColor = getRatingColor(overallRating)
  const ratingText = getRatingText(overallRating)

  const categories = [
    { key: 'food', label: 'Еда', icon: <GiMeal />, color: '#e67e22', emoji: '🍜' },
    { key: 'service', label: 'Обслуживание', icon: <FaConciergeBell />, color: '#3498db', emoji: '🤵' },
    { key: 'atmosphere', label: 'Атмосфера', icon: <FaCrown />, color: '#9b59b6', emoji: '🕯️' },
    { key: 'price_quality', label: 'Цена/Качество', icon: <FaThumbsUp />, color: '#2ecc71', emoji: '💰' },
    { key: 'cleanliness', label: 'Чистота', icon: <FaSmile />, color: '#1abc9c', emoji: '✨' }
  ]

  const availableCategories = categories.filter(cat => stats[cat.key] !== undefined)

  return (
    <div className={`rating-stats-container ${isGold ? 'gold-rating-stats' : ''}`}>
      {isGold && (
        <div className="rating-gold-badge">
          <FaCrown />
          <span>PREMIUM РЕЙТИНГ</span>
        </div>
      )}

      <div className="rating-main">
        <div className="rating-score">
          <div className="score-number" style={{ color: ratingColor }}>
            {overallRating.toFixed(1)}
          </div>
          <div className="score-divider">
            <span className="score-max">/5</span>
          </div>
          <div className="score-stars">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`star ${i < Math.floor(overallRating) ? 'filled' : ''} ${isGold ? 'gold-star' : ''}`}
                style={{ color: i < Math.floor(overallRating) ? ratingColor : 'rgba(255,255,255,0.2)' }}
              />
            ))}
          </div>
        </div>

        <div className="rating-info">
          <div className="rating-text" style={{ color: ratingColor }}>
            {ratingText}
          </div>
          <div className="rating-count">
            {stats.total || 0} {getDeclension(stats.total || 0, 'оценка', 'оценки', 'оценок')}
          </div>
        </div>
      </div>

      {availableCategories.length > 0 && (
        <div className="rating-categories">
          {availableCategories.map(cat => (
            <div key={cat.key} className={`rating-category ${isGold ? 'gold-category' : ''}`}>
              <div className="category-icon" style={{ background: `${cat.color}20`, color: cat.color }}>
                {cat.icon}
              </div>
              <div className="category-info">
                <span className="category-label">{cat.label}</span>
                <div className="category-rating">
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${(stats[cat.key] / 5) * 100}%`, background: cat.color }}
                    />
                  </div>
                  <span className="category-score" style={{ color: cat.color }}>
                    {stats[cat.key].toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onRateClick}
        className={`rating-action-btn ${userRated ? 'rated' : ''} ${isGold ? 'gold-action-btn' : ''}`}
      >
        <FaStar />
        <span>{userRated ? 'Изменить' : 'Оценить'}</span>
      </button>
    </div>
  )
}

function getDeclension(num, one, two, five) {
  const n = Math.abs(num) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) return five
  if (n1 > 1 && n1 < 5) return two
  if (n1 === 1) return one
  return five
}
'use client'
import { useState, useEffect } from 'react'
import { FaCrown } from 'react-icons/fa'
import './RatingModal.css'

export default function RatingModal({ restaurantId, restaurantName, onClose, onSuccess, isGold = false }) {
  const [categories, setCategories] = useState([])
  const [ratings, setRatings] = useState({})
  const [comment, setComment] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [hasRated, setHasRated] = useState({})
  const [existingReviewId, setExistingReviewId] = useState(null)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [isCooldown, setIsCooldown] = useState(false)

  const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

  // Таймер обратного отсчета
  useEffect(() => {
    let timer
    if (isCooldown && cooldownSeconds > 0) {
      timer = setTimeout(() => {
        setCooldownSeconds(prev => prev - 1)
      }, 1000)
    } else if (cooldownSeconds === 0 && isCooldown) {
      setIsCooldown(false)
    }
    return () => clearTimeout(timer)
  }, [cooldownSeconds, isCooldown])

  useEffect(() => {
    if (!isLoadingData && categories.length > 0) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`

      return () => {
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    }
  }, [isLoadingData, categories.length])

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/ratings/categories/`).then(res => res.json()),
      fetch(`${API_URL}/api/ratings/${restaurantId}/user_rating/`).then(res => res.json())
    ]).then(([catsData, userRatings]) => {
      setCategories(catsData)
      setHasRated(userRatings)

      const initial = {}
      catsData.forEach(cat => {
        initial[cat.id] = userRatings[cat.id] || null
      })
      setRatings(initial)

      if (userRatings.customer_name) {
        setCustomerName(userRatings.customer_name)
      }

      if (userRatings.comment) {
        setComment(userRatings.comment)
      }
      if (userRatings.id) {
        setExistingReviewId(userRatings.id)
      }
      setIsLoadingData(false)
    }).catch(error => {
      console.error('Ошибка загрузки:', error)
      setIsLoadingData(false)
    })
  }, [restaurantId, API_URL])

  const handleRating = (categoryId, score) => {
    setRatings({ ...ratings, [categoryId]: score })
  }

  const handleSubmit = async () => {
    if (isCooldown) {
      return
    }
    
    setLoading(true)

    const ratingsArray = categories.map(cat => ({
      category_id: cat.id,
      score: ratings[cat.id]
    })).filter(r => r.score !== null)

    if (ratingsArray.length === 0) {
      setLoading(false)
      onSuccess()
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/ratings/${restaurantId}/rate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratings: ratingsArray,
          comment: comment,
          customer_name: customerName || 'Аноним',
          update_existing: true
        })
      })

      const data = await response.json()

      // Обработка ошибки 429
      if (response.status === 429) {
        let waitSeconds = 60
        
        const retryAfter = response.headers.get('Retry-After')
        if (retryAfter) {
          waitSeconds = parseInt(retryAfter)
        } else if (data.detail && typeof data.detail === 'string') {
          const match = data.detail.match(/\d+/)
          if (match) {
            waitSeconds = parseInt(match[0])
          }
        }
        
        setCooldownSeconds(waitSeconds)
        setIsCooldown(true)
        setLoading(false)
        return
      }

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        console.error('Ошибка:', data)
      }
    } catch (error) {
      console.error('Ошибка отправки:', error)
    } finally {
      setLoading(false)
    }
  }

  const allRated = categories.length > 0 && categories.every(cat => ratings[cat.id] !== null)
  const hasExistingRating = hasRated[Object.keys(hasRated)[0]]

  if (isLoadingData) {
    return (
      <div className="rating-modal-overlay" onClick={onClose}>
        <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
          <div className="rating-loading">
            <div className="spinner"></div>
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!categories.length) return null

  return (
    <div className={`rating-modal-overlay ${isGold ? 'gold-overlay' : ''}`} onClick={onClose}>
      <div className={`rating-modal ${isGold ? 'gold-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="rating-modal-close" onClick={onClose}>×</button>

        {isGold && (
          <div className="modal-gold-badge">
            <FaCrown />
            <span>PREMIUM</span>
          </div>
        )}

        {step === 1 && (
          <>
            <h2 className={isGold ? 'gold-title' : ''}>
              {hasExistingRating ? 'Изменить оценку' : `Оцените ${restaurantName}`}
            </h2>
            <p className="rating-modal-subtitle">
              {hasExistingRating ? 'Вы можете изменить свои оценки' : 'Ваше мнение поможет другим выбрать лучшее место'}
            </p>

            <div className="rating-name-field">
              <label>Ваше имя</label>
              <input
                type="text"
                placeholder="Как к вам обращаться?"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <small>Будет показано в отзыве</small>
            </div>

            {categories.map(cat => (
              <div key={cat.id} className="rating-category-item">
                <div className="category-header">
                  <span className="category-name">{cat.name}</span>
                  {hasRated[cat.id] && (
                    <span className="already-rated">✓ Оценено</span>
                  )}
                </div>

                <div className="stars-container">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => handleRating(cat.id, star)}
                      className={`star-btn ${ratings[cat.id] >= star ? 'active' : ''} ${isGold ? 'gold-star-btn' : ''}`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {ratings[cat.id] && (
                  <div className="current-rating">
                    {hasRated[cat.id] ? 'Новая' : 'Ваша'} оценка: {ratings[cat.id]} ★
                  </div>
                )}
              </div>
            ))}

            <div className="rating-comment">
              <label>Ваш отзыв {hasExistingRating && '(можно изменить)'}</label>
              <textarea
                rows="3"
                placeholder="Расскажите о своем опыте..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="rating-actions">
              <button className="rating-cancel" onClick={onClose}>
                Отмена
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!allRated}
                className={`rating-submit ${allRated ? 'active' : ''} ${isGold ? 'gold-submit' : ''}`}
              >
                {hasExistingRating ? 'Обновить' : 'Далее'}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="rating-success">
            <div className="success-icon">{hasExistingRating ? '✏️' : '🎉'}</div>
            <h2 className={isGold ? 'gold-title' : ''}>
              {hasExistingRating ? 'Оценка обновлена!' : 'Спасибо за оценку!'}
            </h2>
            <p className="rating-modal-subtitle">
              {hasExistingRating ? 'Ваши изменения сохранены' : 'Ваше мнение очень важно для нас'}
            </p>

            <div className="success-stats">
              {categories.map(cat => {
                const score = ratings[cat.id]
                if (!score) return null
                return (
                  <div key={cat.id}>
                    {cat.name}: {score} ★
                  </div>
                )
              })}
            </div>

            <button onClick={handleSubmit} className={`rating-done ${isGold ? 'gold-done' : ''}`} disabled={loading || isCooldown}>
              {loading ? 'Сохранение...' : isCooldown ? `Подождите ${cooldownSeconds}с` : (hasExistingRating ? 'Сохранить' : 'Готово')}
            </button>
          </div>
        )}

        {loading && (
          <div className="rating-loading">
            <div className={`spinner ${isGold ? 'gold-spinner' : ''}`}></div>
            <p>Сохранение оценки...</p>
          </div>
        )}
      </div>
    </div>
  )
}
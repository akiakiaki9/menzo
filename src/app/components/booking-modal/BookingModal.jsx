'use client'
import { useState, useEffect } from 'react'
import { FaTimes, FaPhone, FaInfoCircle } from 'react-icons/fa'
import './booking-modal.css'

export default function BookingModal({ restaurant, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    date: '',
    time: '',
    guests: 2,
    comment: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [isCooldown, setIsCooldown] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Таймер обратного отсчета
  useEffect(() => {
    let timer
    if (isCooldown && cooldownSeconds > 0) {
      timer = setTimeout(() => {
        setCooldownSeconds(prev => prev - 1)
      }, 1000)
    } else if (cooldownSeconds === 0 && isCooldown) {
      setIsCooldown(false)
      setLoading(false)
    }
    return () => clearTimeout(timer)
  }, [cooldownSeconds, isCooldown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isCooldown) {
      setError(`Пожалуйста, подождите ${cooldownSeconds} секунд перед повторной отправкой`)
      return
    }
    
    setLoading(true)
    setError('')
    
    if (!formData.customer_name.trim()) {
      setError('Введите ваше имя')
      setLoading(false)
      return
    }
    
    if (!formData.customer_phone.trim()) {
      setError('Введите номер телефона')
      setLoading(false)
      return
    }
    
    if (!formData.date) {
      setError('Выберите дату')
      setLoading(false)
      return
    }
    
    if (!formData.time) {
      setError('Выберите время')
      setLoading(false)
      return
    }
    
    if (!restaurant || !restaurant.id) {
      setError('Ошибка: ресторан не найден')
      setLoading(false)
      return
    }
    
    try {
      const payload = {
        restaurant: restaurant.id,
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim() || '',
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests),
        comment: formData.comment || ''
      }
      
      const response = await fetch(`${API_URL}/api/bookings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
      
      const data = await response.json()
      
      // Обработка ошибки 429 (Too Many Requests)
      if (response.status === 429) {
        let waitSeconds = 60
        
        // Пытаемся получить Retry-After заголовок
        const retryAfter = response.headers.get('Retry-After')
        if (retryAfter) {
          waitSeconds = parseInt(retryAfter)
        } else if (data.detail && typeof data.detail === 'string') {
          // Парсим число из сообщения
          const match = data.detail.match(/\d+/)
          if (match) {
            waitSeconds = parseInt(match[0])
          }
        }
        
        setCooldownSeconds(waitSeconds)
        setIsCooldown(true)
        setError(`Превышен лимит запросов. Попробуйте через ${waitSeconds} секунд.`)
        setLoading(false)
        return
      }
      
      if (response.ok) {
        onSuccess(data)
        onClose()
      } else {
        if (typeof data === 'object') {
          const errors = []
          for (const [field, messages] of Object.entries(data)) {
            if (Array.isArray(messages)) {
              errors.push(`${field}: ${messages.join(', ')}`)
            } else if (typeof messages === 'string') {
              errors.push(messages)
            } else {
              errors.push(`${field}: ${JSON.stringify(messages)}`)
            }
          }
          setError(errors.join('; ') || 'Ошибка при бронировании')
        } else {
          setError(data.error || data.message || 'Ошибка при бронировании')
        }
      }
    } catch (err) {
      console.error('❌ Ошибка:', err)
      setError('Ошибка соединения с сервером. Проверьте подключение.')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  
  const timeSlots = []
  for (let hour = 10; hour <= 22; hour++) {
    timeSlots.push(`${hour}:00`)
    timeSlots.push(`${hour}:30`)
  }

  if (restaurant && restaurant.is_accepting_bookings === false) {
    return (
      <div className="booking-modal-overlay" onClick={onClose}>
        <div className="booking-modal-container booking-unavailable-modal" onClick={(e) => e.stopPropagation()}>
          <button className="booking-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
          
          <div className="booking-unavailable-content">
            <div className="unavailable-animation">
              <div className="unavailable-shield">🔒</div>
            </div>
            
            <h2>Бронирование временно недоступно</h2>
            
            <p className="unavailable-message">
              К сожалению, ресторан временно не принимает бронирования через сайт.
            </p>
            
            <div className="unavailable-divider">
              <span>Но вы можете связаться напрямую</span>
            </div>
            
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} className="booking-phone-button">
                <FaPhone />
                <span>Позвонить ресторану</span>
                <small>{restaurant.phone}</small>
              </a>
            )}
            
            <div className="unavailable-note">
              <FaInfoCircle />
              <span>Ресторан сам свяжется с вами, если появятся свободные места</span>
            </div>
            
            <button className="booking-unavailable-close" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <h2>Бронирование столика</h2>
          <button className="booking-modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="booking-modal-restaurant">
          <p>Ресторан: <strong>{restaurant?.name}</strong></p>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="booking-form-group">
            <label>Ваше имя *</label>
            <input
              type="text"
              required
              placeholder="Иван Иванов"
              value={formData.customer_name}
              onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
            />
          </div>
          
          <div className="booking-form-group">
            <label>Телефон *</label>
            <input
              type="tel"
              required
              placeholder="+998 90 123-45-67"
              value={formData.customer_phone}
              onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
            />
          </div>
          
          <div className="booking-form-row">
            <div className="booking-form-group">
              <label>Дата *</label>
              <input
                type="date"
                required
                min={today}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            
            <div className="booking-form-group">
              <label>Время *</label>
              <select
                required
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              >
                <option value="">Выберите время</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="booking-form-group">
            <label>Количество гостей *</label>
            <select
              required
              value={formData.guests}
              onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
            >
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'гость' : (num < 5 ? 'гостя' : 'гостей')}</option>
              ))}
            </select>
          </div>
          
          <div className="booking-form-group">
            <label>Комментарий (пожелания)</label>
            <textarea
              rows="2"
              placeholder="Особые пожелания, аллергии и т.д."
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
            />
          </div>
          
          {error && <div className="booking-error-message">{error}</div>}
          
          <div className="booking-modal-buttons">
            <button type="button" className="booking-btn-cancel" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="booking-btn-submit" disabled={loading || isCooldown}>
              {loading ? 'Отправка...' : isCooldown ? `Подождите ${cooldownSeconds}с` : 'Забронировать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
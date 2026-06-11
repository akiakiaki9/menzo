'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaPhone, FaTelegramPlane } from 'react-icons/fa'
import { GiKnifeFork, GiTakeMyMoney } from 'react-icons/gi'
import BookingModal from '../../booking-modal/BookingModal'
import './StickyCTA.css'

export default function StickyCTA({ phone, telegram, restaurantId, restaurantSlug, restaurantName, isAcceptingBookings, isAcceptingOrders }) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollPosition > 300 && scrollPosition < documentHeight - windowHeight - 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleBookingClick = () => {
    if (!restaurantId) {
      console.error('❌ restaurantId не передан в StickyCTA')
      alert('Ошибка: данные ресторана не загружены')
      return
    }
    setShowBookingModal(true)
  }

  const handleOrderClick = () => {
    const routeSlug = restaurantSlug || restaurantId
    if (!routeSlug) {
      console.error('❌ restaurantSlug / restaurantId не передан в StickyCTA')
      alert('Ошибка: данные ресторана не загружены')
      return
    }
    router.push(`/restaurants/${routeSlug}/menu`)
  }

  return (
    <>
      <div className={`sticky-cta ${isVisible ? 'visible' : ''}`}>
        <div className="sticky-cta-container">
          {phone && (
            <a href={`tel:${phone}`} className="sticky-cta-btn sticky-cta-call">
              <FaPhone />
              <span>Позвонить</span>
            </a>
          )}
          {telegram && (
            <a
              href={telegram.startsWith('http') ? telegram : `https://t.me/${telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="sticky-cta-btn sticky-cta-telegram"
            >
              <FaTelegramPlane />
              <span>Написать</span>
            </a>
          )}
          {/* Кнопка заказа - показывается только если ресторан принимает заказы */}
          {isAcceptingOrders === true && (
            <button className="sticky-cta-btn sticky-cta-order" onClick={handleOrderClick}>
              <GiTakeMyMoney />
              <span>Заказать</span>
            </button>
          )}
          {/* Кнопка бронирования - показывается только если ресторан принимает бронирования */}
          {isAcceptingBookings === true && (
            <button className="sticky-cta-btn sticky-cta-booking" onClick={handleBookingClick}>
              <GiKnifeFork />
              <span>Забронировать</span>
            </button>
          )}
        </div>
      </div>

      {/* Модалка бронирования открывается только если ресторан принимает бронирования */}
      {showBookingModal && restaurantId && isAcceptingBookings === true && (
        <BookingModal
          restaurant={{ id: restaurantId, name: restaurantName || 'Ресторан', is_accepting_bookings: isAcceptingBookings }}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false)
            const toast = document.createElement('div')
            toast.className = 'booking-toast'
            toast.innerHTML = '✅ Бронирование успешно создано!'
            document.body.appendChild(toast)
            setTimeout(() => toast.remove(), 3000)
          }}
        />
      )}
    </>
  )
}
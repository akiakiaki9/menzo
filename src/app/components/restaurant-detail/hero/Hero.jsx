'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaChevronLeft, FaChevronRight, FaPhone, FaMapMarkerAlt, FaClock, FaStar, FaCrown, FaBookOpen, FaListUl, FaEye } from 'react-icons/fa'
import { GiKnifeFork } from 'react-icons/gi'
import BookingModal from '../../booking-modal/BookingModal'
import './Hero.css'

export default function Hero({ restaurant, images }) {
    const [currentImage, setCurrentImage] = useState(0)
    const [showBookingModal, setShowBookingModal] = useState(false)
    const router = useRouter()

    const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

    const getWorkingHoursStatus = () => {
        const currentHour = new Date().getHours()
        if (currentHour < 10) return { status: 'closed', text: 'Откроется в 10:00' }
        if (currentHour >= 23) return { status: 'closed', text: 'Закрыто до 10:00' }
        return { status: 'open', text: 'Открыто' }
    }

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder.jpg'
        if (imagePath.startsWith('http')) return imagePath
        if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
        return `${API_URL}/media/${imagePath}`
    }

    const handlePrevImage = () => {
        setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const handleNextImage = () => {
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }

    const handleMenuClick = () => {
        router.push(`/restaurants/${restaurant.slug}/menu`)
    }

    const handleBookingSuccess = () => {
        setShowBookingModal(false)
        const toast = document.createElement('div')
        toast.className = 'booking-toast'
        toast.innerHTML = '✅ Бронирование успешно создано!'
        document.body.appendChild(toast)
        setTimeout(() => toast.remove(), 3000)
    }

    const hoursStatus = getWorkingHoursStatus()

    return (
        <>
            <section className="restaurant-hero">
                <div className="hero-slider">
                    {images.length > 0 ? (
                        <>
                            <div className="hero-image-wrapper">
                                <img
                                    src={getImageUrl(images[currentImage].image)}
                                    alt={restaurant.name}
                                    className="hero-image"
                                    onError={(e) => {
                                        e.target.src = '/placeholder.jpg'
                                    }}
                                />
                                <div className="image-overlay"></div>
                            </div>

                            {restaurant.is_gold && (
                                <div className="hero-gold-badge">
                                    <FaCrown />
                                    <span>GOLD</span>
                                </div>
                            )}

                            {images.length > 1 && (
                                <>
                                    <button className="slider-btn slider-prev" onClick={handlePrevImage} aria-label="Предыдущее фото">
                                        <FaChevronLeft />
                                    </button>
                                    <button className="slider-btn slider-next" onClick={handleNextImage} aria-label="Следующее фото">
                                        <FaChevronRight />
                                    </button>
                                    <div className="slider-dots">
                                        {images.map((_, idx) => (
                                            <span
                                                key={idx}
                                                className={`slider-dot ${currentImage === idx ? 'active' : ''}`}
                                                onClick={() => setCurrentImage(idx)}
                                            />
                                        ))}
                                    </div>
                                    <div className="image-counter">
                                        {currentImage + 1}/{images.length}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="hero-image-placeholder">
                            <GiKnifeFork />
                            <span>Нет фото</span>
                        </div>
                    )}
                </div>

                <div className="hero-content">
                    <div className="hero-info">
                        <h1 className={restaurant.is_gold ? 'gold-title' : ''}>
                            {restaurant.name}
                        </h1>

                        <div className="hero-tags">
                            {restaurant.region_label && (
                                <span className="tag region-tag">
                                    <FaMapMarkerAlt /> {restaurant.region_label}
                                </span>
                            )}
                            <span className="tag cuisine-tag">
                                <GiKnifeFork />
                                {restaurant.cuisine_type_label || restaurant.cuisine_type || 'Разная кухня'}
                            </span>
                            {restaurant.price_level && (
                                <span className="tag price-tag">
                                    {restaurant.price_level === '$' && '💰 Эконом'}
                                    {restaurant.price_level === '$$' && '💰💰 Средний'}
                                    {restaurant.price_level === '$$$' && '💰💰💰 Высокий'}
                                    {restaurant.price_level === '$$$$' && '💰💰💰💰 Премиум'}
                                </span>
                            )}
                            <span className={`tag status-tag ${hoursStatus.status}`}>
                                <FaClock />
                                {hoursStatus.text}
                            </span>
                        </div>

                        <div className="hero-rating">
                            <div className="rating-stars">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`rating-star ${i < Math.floor(restaurant.rating || 0) ? 'filled' : ''}`}
                                    />
                                ))}
                            </div>
                            <span className="rating-value">{restaurant.rating?.toFixed(1) || 'Новое'}</span>
                            <span className="rating-count">
                                ({restaurant.analytics?.total_ratings || restaurant.reviews_count || 0})
                            </span>
                            <span className="rating-views">
                                <FaEye /> {restaurant.analytics?.views_count || 0}
                            </span>
                        </div>

                        {restaurant.address && (
                            <div className="hero-address">
                                <FaMapMarkerAlt />
                                <span>{restaurant.address}</span>
                            </div>
                        )}
                    </div>

                    <div className="hero-actions">
                        <a href={`tel:${restaurant.phone}`} className="action-btn call-btn">
                            <FaPhone />
                            <span>Позвонить</span>
                        </a>

                        {restaurant.is_accepting_bookings === true && (
                            <button onClick={() => setShowBookingModal(true)} className="action-btn booking-btn">
                                <FaBookOpen />
                                <span>Забронировать</span>
                            </button>
                        )}

                        <button onClick={handleMenuClick} className="action-btn menu-btn">
                            <FaListUl />
                            <span>Меню</span>
                        </button>

                        {restaurant.latitude && restaurant.longitude && (
                            <a
                                href={`https://maps.google.com/?q=${restaurant.latitude},${restaurant.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn map-btn"
                            >
                                <FaMapMarkerAlt />
                                <span>Маршрут</span>
                            </a>
                        )}
                    </div>
                </div>
            </section>

            {showBookingModal && restaurant.is_accepting_bookings === true && (
                <BookingModal
                    restaurant={{ id: restaurant.id, name: restaurant.name, is_accepting_bookings: restaurant.is_accepting_bookings }}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </>
    )
}
'use client'
import { useState, useEffect, useRef } from 'react'
import { FaStar, FaUser, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaRegClock, FaThumbsUp, FaTimes, FaExpand } from 'react-icons/fa'
import './Reviews.css'

export default function Reviews({ reviews, isGold = false }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [reviewsPerView, setReviewsPerView] = useState(3)
    const [isAnimating, setIsAnimating] = useState(false)
    const [selectedReview, setSelectedReview] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Определяем количество отзывов на экране
    useEffect(() => {
        const updateReviewsPerView = () => {
            if (window.innerWidth >= 1200) setReviewsPerView(3)
            else if (window.innerWidth >= 768) setReviewsPerView(2)
            else setReviewsPerView(1)
        }
        updateReviewsPerView()
        window.addEventListener('resize', updateReviewsPerView)
        return () => window.removeEventListener('resize', updateReviewsPerView)
    }, [])

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isModalOpen])

    if (!reviews || reviews.length === 0) return null

    const totalPages = Math.ceil(reviews.length / reviewsPerView)
    const maxIndex = Math.max(0, totalPages - 1)

    const handlePrev = () => {
        if (currentIndex > 0 && !isAnimating) {
            setIsAnimating(true)
            setCurrentIndex(prev => prev - 1)
            setTimeout(() => setIsAnimating(false), 400)
        }
    }

    const handleNext = () => {
        if (currentIndex < maxIndex && !isAnimating) {
            setIsAnimating(true)
            setCurrentIndex(prev => prev + 1)
            setTimeout(() => setIsAnimating(false), 400)
        }
    }

    const goToSlide = (index) => {
        if (!isAnimating && index !== currentIndex && index >= 0 && index <= maxIndex) {
            setIsAnimating(true)
            setCurrentIndex(index)
            setTimeout(() => setIsAnimating(false), 400)
        }
    }

    const openReviewModal = (review) => {
        setSelectedReview(review)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedReview(null)
    }

    const getVisibleReviews = () => {
        const start = currentIndex * reviewsPerView
        return reviews.slice(start, start + reviewsPerView)
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Недавно'
        const date = new Date(dateStr)
        const now = new Date()
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
        if (diffDays === 0) return 'Сегодня'
        if (diffDays === 1) return 'Вчера'
        if (diffDays < 7) return `${diffDays} дн. назад`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    }

    const truncateText = (text, maxLength = 100) => {
        if (!text) return ''
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const renderStars = (score) => {
        const fullStars = Math.floor(score)
        const hasHalf = score % 1 >= 0.5
        return (
            <div className="stars-group">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={`star ${i < fullStars ? 'filled' : (hasHalf && i === fullStars ? 'half' : 'empty')}`}
                    />
                ))}
            </div>
        )
    }

    const renderModalStars = (score) => {
        const fullStars = Math.floor(score)
        return (
            <div className="modal-stars-group">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={`modal-star ${i < fullStars ? 'filled' : 'empty'}`}
                    />
                ))}
                <span className="modal-star-score">{score.toFixed(1)}</span>
            </div>
        )
    }

    const getCategoryIcon = (categoryName) => {
        const icons = {
            'Еда': '🍜',
            'Обслуживание': '🤵',
            'Атмосфера': '🕯️',
            'Цена/Качество': '💰',
            'Чистота': '✨'
        }
        return icons[categoryName] || '⭐'
    }

    const visibleReviews = getVisibleReviews()
    const startCount = currentIndex * reviewsPerView + 1
    const endCount = Math.min(startCount + reviewsPerView - 1, reviews.length)

    return (
        <>
            <div className={`reviews-module ${isGold ? 'gold-reviews' : ''}`}>
                <div className="reviews-module-header">
                    <div className="reviews-title-group">
                        <div className="reviews-icon">📝</div>
                        <div>
                            <h3>Отзывы посетителей</h3>
                            <p className="reviews-subtitle">
                                {reviews.length} {declension(reviews.length, 'отзыв', 'отзыва', 'отзывов')}
                            </p>
                        </div>
                    </div>

                    {reviews.length > reviewsPerView && (
                        <div className="reviews-controls">
                            <button
                                className="review-nav-btn prev"
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                aria-label="Предыдущие отзывы"
                            >
                                <FaChevronLeft />
                            </button>
                            <div className="reviews-pagination">
                                {[...Array(totalPages)].map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={`pagination-dot ${idx === currentIndex ? 'active' : ''}`}
                                        onClick={() => goToSlide(idx)}
                                        aria-label={`Перейти к странице ${idx + 1}`}
                                    />
                                ))}
                            </div>
                            <button
                                className="review-nav-btn next"
                                onClick={handleNext}
                                disabled={currentIndex === maxIndex}
                                aria-label="Следующие отзывы"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </div>

                <div className="reviews-carousel-wrapper">
                    <div className="reviews-grid" style={{ '--reviews-per-view': reviewsPerView }}>
                        {visibleReviews.map((review, idx) => {
                            const isLongComment = review.comment && review.comment.length > 100
                            return (
                                <div key={idx} className="review-card">
                                    <div className="review-card-inner">
                                        <FaQuoteLeft className="review-quote-icon" />

                                        <div className="reviewer-section">
                                            <div className="reviewer-avatar">
                                                <FaUser />
                                            </div>
                                            <div className="reviewer-info">
                                                <div className="reviewer-name-wrapper">
                                                    <span className="reviewer-name">{review.customer_name || 'Аноним'}</span>
                                                    <span className="reviewer-rating">{renderStars(review.avg_score || 0)}</span>
                                                </div>
                                                <div className="review-date">
                                                    <FaRegClock />
                                                    <span>{formatDate(review.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {review.ratings && Array.isArray(review.ratings) && review.ratings.length > 0 && (
                                            <div className="review-categories">
                                                {review.ratings.slice(0, 3).map((rating, rIdx) => (
                                                    <div key={rIdx} className="category-row">
                                                        <span className="category-icon">{getCategoryIcon(rating.category_name)}</span>
                                                        <span className="category-name">{rating.category_name}</span>
                                                        <div className="category-stars">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar
                                                                    key={i}
                                                                    className={`small-star ${i < (rating.score || 0) ? 'filled' : 'empty'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="category-score">{rating.score || 0}/5</span>
                                                    </div>
                                                ))}
                                                {review.ratings.length > 3 && (
                                                    <div className="more-categories">
                                                        +{review.ratings.length - 3} {declension(review.ratings.length - 3, 'категория', 'категории', 'категорий')}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {review.comment && (
                                            <div className="review-comment">
                                                <p>{truncateText(review.comment, 100)}</p>
                                                {isLongComment && (
                                                    <button 
                                                        className="read-more-btn"
                                                        onClick={() => openReviewModal(review)}
                                                    >
                                                        Подробнее
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        <div className="review-footer">
                                            <button className="helpful-btn">
                                                <FaThumbsUp />
                                                <span>Полезно</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {reviews.length > reviewsPerView && (
                    <div className="reviews-mobile-controls">
                        <button className="mobile-nav-btn" onClick={handlePrev} disabled={currentIndex === 0}>
                            <FaChevronLeft />
                            <span>Назад</span>
                        </button>
                        <span className="mobile-counter">{startCount}–{endCount} из {reviews.length}</span>
                        <button className="mobile-nav-btn" onClick={handleNext} disabled={currentIndex === maxIndex}>
                            <span>Вперед</span>
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </div>

            {/* Модальное окно для полного отзыва */}
            {isModalOpen && selectedReview && (
                <div className="review-modal-overlay" onClick={closeModal}>
                    <div className={`review-modal-container ${isGold ? 'gold-modal-container' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <button className="review-modal-close" onClick={closeModal}>
                            <FaTimes />
                        </button>
                        
                        <div className="review-modal-header">
                            <div className="review-modal-avatar">
                                <FaUser />
                            </div>
                            <div className="review-modal-user">
                                <h3>{selectedReview.customer_name || 'Аноним'}</h3>
                                <div className="review-modal-date">
                                    <FaRegClock />
                                    <span>{formatDate(selectedReview.created_at)}</span>
                                </div>
                            </div>
                            <div className="review-modal-rating">
                                {renderModalStars(selectedReview.avg_score || 0)}
                            </div>
                        </div>

                        {selectedReview.ratings && Array.isArray(selectedReview.ratings) && selectedReview.ratings.length > 0 && (
                            <div className="review-modal-categories">
                                <h4>Оценки по категориям</h4>
                                {selectedReview.ratings.map((rating, idx) => (
                                    <div key={idx} className="modal-category-row">
                                        <span className="modal-category-icon">{getCategoryIcon(rating.category_name)}</span>
                                        <span className="modal-category-name">{rating.category_name}</span>
                                        <div className="modal-category-stars">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className={`modal-category-star ${i < (rating.score || 0) ? 'filled' : 'empty'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="modal-category-score">{rating.score || 0}/5</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedReview.comment && (
                            <div className="review-modal-comment">
                                <h4>Отзыв</h4>
                                <p>{selectedReview.comment}</p>
                            </div>
                        )}

                        <div className="review-modal-footer">
                            <button className="review-modal-helpful">
                                <FaThumbsUp />
                                <span>Полезный отзыв</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

function declension(num, one, two, five) {
    const n = Math.abs(num) % 100
    const n1 = n % 10
    if (n > 10 && n < 20) return five
    if (n1 > 1 && n1 < 5) return two
    if (n1 === 1) return one
    return five
}
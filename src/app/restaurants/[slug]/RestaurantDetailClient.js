'use client'
import { useState, useEffect } from 'react'

import './restaurant-detail.css'
import Navbar from '@/app/components/navbar/Navbar'
import Hero from '@/app/components/restaurant-detail/hero/Hero'
import InfoPanel from '@/app/components/restaurant-detail/infoPanel/InfoPanel'
import Features from '@/app/components/restaurant-detail/features/Features'
import Map from '@/app/components/restaurant-detail/map/Map'
import Description from '@/app/components/restaurant-detail/description/Description'
import Gallery from '@/app/components/restaurant-detail/gallery/Gallery'
import RatingStats from '@/app/components/restaurant-detail/ratingStats/RatingStats'
import RatingModal from '@/app/components/restaurant-detail/ratingModal/RatingModal'
import Reviews from '@/app/components/restaurant-detail/reviews/Reviews'

export default function RestaurantDetailClient({ slug: propSlug }) {
    const [restaurant, setRestaurant] = useState(null)
    const [goodReviews, setGoodReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [ratingStats, setRatingStats] = useState(null)
    const [userRated, setUserRated] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)

    const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

    useEffect(() => {
        if (!propSlug) return

        const fetchRestaurant = async () => {
            try {
                const res = await fetch(`${API_URL}/api/restaurants/${propSlug}/`)
                if (!res.ok) throw new Error('Restaurant not found')
                const data = await res.json()
                setRestaurant(data)
                setRatingStats(data.rating_stats)

                const ratingRes = await fetch(`${API_URL}/api/ratings/${data.id}/user_rating/`).catch(() => ({ ok: false }))
                if (ratingRes.ok) {
                    const ratingData = await ratingRes.json()
                    const hasRated = Object.values(ratingData).some(v => v !== null)
                    setUserRated(hasRated)
                }

                const reviewsRes = await fetch(`${API_URL}/api/restaurants/${propSlug}/good_reviews/`).catch(() => ({ ok: false }))
                if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json()
                    setGoodReviews(reviewsData)
                }
            } catch (err) {
                // console.error('Error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurant()
    }, [propSlug, API_URL])

    const handleRatingSuccess = async () => {
        if (restaurant) {
            const res = await fetch(`${API_URL}/api/restaurants/${restaurant.id}/`)
            if (res.ok) {
                const data = await res.json()
                setRatingStats(data.rating_stats)
                setUserRated(true)

                const reviewsRes = await fetch(`${API_URL}/api/restaurants/${restaurant.slug}/good_reviews/`)
                if (reviewsRes.ok) {
                    const reviewsData = await reviewsRes.json()
                    setGoodReviews(reviewsData)
                }
            }
        }
    }

    const handleFavorite = () => setIsFavorite(!isFavorite)

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: restaurant.name,
                    text: `Посмотрите ${restaurant.name} на TAVSIA.UZ`,
                    url: window.location.href
                })
            } catch (err) {
                // console.log('Ошибка шаринга:', err)
            }
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert('Ссылка скопирована!')
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Загрузка...</p>
                </div>
            </>
        )
    }

    if (!restaurant) {
        return (
            <>
                <Navbar />
                <div className="error-container">
                    <div className="error-icon">🍽️</div>
                    <h2>Место не найдено</h2>
                    <p>Запрашиваемое место не существует</p>
                    <a href="/" className="back-home-btn">Вернуться на главную</a>
                </div>
            </>
        )
    }

    const images = restaurant.images || []
    const features = restaurant.features || []

    return (
        <>
            <Navbar />
            <div className="restaurant-detail-page">
                <div className="container">
                    {/* Хлебные крошки */}
                    <div className="breadcrumb">
                        <a href="/">Главная</a>
                        <span>/</span>
                        <a href={`/city/${restaurant.region}`}>{restaurant.region_label || 'Города'}</a>
                        <span>/</span>
                        <span>{restaurant.name}</span>
                    </div>

                    {/* Основные компоненты */}
                    <Hero restaurant={restaurant} images={images} />
                    <InfoPanel restaurant={restaurant} />
                    <RatingStats
                        stats={ratingStats}
                        onRateClick={() => setShowRatingModal(true)}
                        userRated={userRated}
                        isGold={restaurant.is_gold}
                    />
                    <Description description={restaurant.description} isGold={restaurant.is_gold} />
                    <Features features={features} isGold={restaurant.is_gold} />
                    <Gallery images={images} isGold={restaurant.is_gold} />

                    {/* Отзывы - компонент карусели */}
                    {goodReviews && goodReviews.length > 0 && (
                        <Reviews reviews={goodReviews} isGold={restaurant.is_gold} />
                    )}

                    {/* Карта */}
                    {restaurant.latitude && restaurant.longitude && (
                        <Map
                            latitude={parseFloat(restaurant.latitude)}
                            longitude={parseFloat(restaurant.longitude)}
                            address={restaurant.address}
                            name={restaurant.name}
                        />
                    )}
                </div>
            </div>

            {/* Модальное окно оценки */}
            {showRatingModal && (
                <RatingModal
                    restaurantId={restaurant.id}
                    restaurantName={restaurant.name}
                    onClose={() => setShowRatingModal(false)}
                    onSuccess={handleRatingSuccess}
                    isGold={restaurant.is_gold}
                />
            )}
        </>
    )
};
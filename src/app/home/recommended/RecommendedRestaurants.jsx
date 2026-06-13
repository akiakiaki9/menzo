'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaStar, FaMapMarkerAlt, FaCrown, FaArrowRight, FaUtensils, FaFire } from 'react-icons/fa'
import './RecommendedRestaurants.css'
import '../../styles/gold-card.css'

export default function RecommendedRestaurants() {
    const [recommended, setRecommended] = useState([])
    const [loading, setLoading] = useState(true)
    const [topRated, setTopRated] = useState(null)

    const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const recommendedRes = await fetch(`${API_URL}/api/restaurants/recommended/?limit=6`)
                if (recommendedRes.ok) {
                    const data = await recommendedRes.json()
                    setRecommended(data)
                }

                const topRes = await fetch(`${API_URL}/api/restaurants/top_rated/`)
                if (topRes.ok) {
                    const data = await topRes.json()
                    setTopRated(data)
                }
            } catch (err) {
                // console.error('Error fetching:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [API_URL])

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder.jpg'
        if (imagePath.startsWith('http')) return imagePath
        if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
        return `${API_URL}/media/${imagePath}`
    }

    if (loading) {
        return (
            <div className="places-loading">
                <div className="loading-spinner"></div>
                <p>Открываем лучшие места...</p>
            </div>
        )
    }

    return (
        <section className="places-section">
            <div className="container">
                <div className="section-header">
                    <div className="header-badge">
                        <FaFire className="badge-icon" />
                        <span>Популярное</span>
                    </div>
                    <h2 className="gold-title">Места, которые стоит посетить</h2>
                    <p>Выбор наших гостей — лучшие гастрономические точки Узбекистана</p>
                </div>

                {topRated && (
                    <div className="top-place-block">
                        <div className="top-place-badge gold-badge">
                            <FaCrown />
                            <span>ВЫБОР НЕДЕЛИ</span>
                        </div>
                        <div className="top-place-content">
                            <div className="top-place-image">
                                <img
                                    src={getImageUrl(topRated.images?.[0]?.image || topRated.logo)}
                                    alt={topRated.name}
                                />
                                {topRated.is_gold && (
                                    <div className="image-gold-badge">
                                        <FaCrown />
                                        <span>GOLD</span>
                                    </div>
                                )}
                            </div>
                            <div className="top-place-info">
                                <h3>{topRated.name}</h3>
                                <div className="top-place-stats">
                                    <span className="rating gold-rating">
                                        <FaStar /> {topRated.rating?.toFixed(1) || '4.8'}
                                    </span>
                                    <span className="reviews-count">
                                        {topRated.analytics?.total_ratings || 128} оценок
                                    </span>
                                    <span className="cuisine-type">
                                        <FaUtensils />
                                        {topRated.cuisine_type || 'Разнообразная'}
                                    </span>
                                </div>
                                <p className="top-place-description">
                                    {topRated.description?.substring(0, 160) || 'Откройте для себя уникальную атмосферу и изысканные блюда.'}...
                                </p>
                                <Link href={`/restaurants/${topRated.slug}`} className="top-place-btn gold-button">
                                    Узнать подробнее
                                    <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <div className="places-grid">
                    {recommended.map(place => (
                        <div
                            key={place.id}
                            className={`place-card ${place.is_gold ? 'gold-card gold-card-shine' : ''}`}
                        >
                            {place.is_gold && (
                                <div className="gold-badge">
                                    <FaCrown />
                                    <span>GOLD</span>
                                </div>
                            )}
                            <div className="card-image">
                                <img
                                    src={getImageUrl(place.images?.[0]?.image || place.logo)}
                                    alt={place.name}
                                />
                                <div className="card-overlay">
                                </div>
                            </div>
                            <div className="card-content">
                                <h3>{place.name}</h3>
                                <div className="card-meta">
                                    <span className="rating gold-rating">
                                        <FaStar /> {place.rating?.toFixed(1) || '4.5'}
                                    </span>
                                    <span className="price-level">
                                        {place.price_level || 'Средний'}
                                    </span>
                                </div>
                                <div className="card-location">
                                    <FaMapMarkerAlt />
                                    <span>{place.region_label || place.address?.split(',')[0] || 'Ташкент'}</span>
                                </div>
                                <Link href={`/restaurants/${place.slug}`} className="card-link">
                                    Подробнее
                                    <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="places-footer">
                    <Link href="/recommended" className="explore-all-btn gold-button">
                        <FaCrown />
                        <span>Все популярные места</span>
                        <FaArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    )
};
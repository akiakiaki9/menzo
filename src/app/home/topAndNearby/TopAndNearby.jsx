'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaTrophy, FaMapMarkerAlt, FaStar, FaEye, FaSpinner, FaCrown } from 'react-icons/fa'
import { GiKnifeFork } from 'react-icons/gi'
import './TopAndNearby.css'
import '../../styles/gold-card.css'

export default function TopAndNearby() {
    const [topRestaurants, setTopRestaurants] = useState([])
    const [nearbyRestaurants, setNearbyRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [locationError, setLocationError] = useState(false)

    const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

    // Загружаем топ места
    useEffect(() => {
        fetch(`${API_URL}/api/restaurants/top_restaurants/?sort=rating&limit=3`)
            .then(res => res.json())
            .then(data => {
                setTopRestaurants(data)
            })
            .catch(err => {
                console.error('Error:', err)
            })
    }, [API_URL])

    // Определяем местоположение и загружаем ближайшие
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                    fetchNearbyRestaurants(coords.lat, coords.lng)
                },
                (error) => {
                    console.error("Геолокация отклонена:", error)
                    setLocationError(true)
                    setLoading(false)
                }
            )
        } else {
            setLocationError(true)
            setLoading(false)
        }
    }, [])

    const fetchNearbyRestaurants = async (lat, lng) => {
        try {
            const response = await fetch(
                `${API_URL}/api/restaurants/nearby/?lat=${lat}&lng=${lng}&radius=5`
            )
            const data = await response.json()
            setNearbyRestaurants(data.slice(0, 3))
            setLoading(false)
        } catch (error) {
            console.error('Ошибка:', error)
            setLoading(false)
        }
    }

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder.jpg'
        if (imagePath.startsWith('http')) return imagePath
        if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
        return `${API_URL}/media/${imagePath}`
    }

    const getDistanceText = (distance) => {
        if (distance < 1) {
            return `${Math.round(distance * 1000)} м`
        }
        return `${distance.toFixed(1)} км`
    }

    const getPriceIcon = (price) => {
        switch (price) {
            case '$': return '💰'
            case '$$': return '💰💰'
            case '$$$': return '💰💰💰'
            case '$$$$': return '💰💰💰💰'
            default: return '💰'
        }
    }

    if (loading) {
        return (
            <section className="top-nearby-section">
                <div className="container">
                    <div className="loading-skeleton">
                        <FaSpinner className="spinner" />
                        <span>Загрузка...</span>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="top-nearby-section">
            <div className="container">
                <div className="section-header">
                    <div className="header-badge">
                        <FaTrophy className="badge-icon" />
                        <span>Выбор редакции</span>
                    </div>
                    <h2 className="section-title gold-title">Популярные места</h2>
                    <p className="section-subtitle">Лучшие гастрономические точки и места рядом с вами</p>
                </div>

                <div className="top-nearby-grid">
                    {/* Левый блок - Топ 3 */}
                    <div className="top-block">
                        <div className="block-header">
                            <h2>
                                <FaTrophy className="header-icon trophy" />
                                <span>Лучшие места</span>
                            </h2>
                            <Link href="/type/restaurants" className="view-all">
                                Все <FaEye />
                            </Link>
                        </div>
                        <div className="ranked-list">
                            {topRestaurants.map((place, index) => (
                                <Link 
                                    key={place.id} 
                                    href={`/restaurants/${place.slug}`} 
                                    className={`ranked-item ${place.is_gold ? 'gold-card-shine' : ''}`}
                                >
                                    {place.is_gold && (
                                        <div className="item-gold-badge gold-badge-small">
                                            <FaCrown />
                                            <span>GOLD</span>
                                        </div>
                                    )}
                                    <div className="rank-number">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                    </div>
                                    <div className="ranked-image">
                                        <img
                                            src={getImageUrl(place.image || place.images?.[0]?.image)}
                                            alt={place.name}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="ranked-info">
                                        <h3>{place.name}</h3>
                                        <p className="ranked-cuisine">
                                            <GiKnifeFork size={12} />
                                            {place.cuisine || place.cuisine_type || 'Разная кухня'}
                                        </p>
                                        <div className="ranked-meta">
                                            <span className="gold-rating gold-rating-small">
                                                <FaStar /> {place.rating || place.overall_rating || '4.5'}
                                            </span>
                                            <span className="price">{getPriceIcon(place.price_level)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Правый блок - Рядом с вами */}
                    <div className="nearby-block">
                        <div className="block-header">
                            <h2>
                                <FaMapMarkerAlt className="header-icon" />
                                <span>Рядом с вами</span>
                            </h2>
                            {nearbyRestaurants.length > 0 && (
                                <Link href="/map" className="view-all">
                                    Все <FaEye />
                                </Link>
                            )}
                        </div>
                        {nearbyRestaurants.length === 0 ? (
                            <div className="nearby-empty">
                                <FaMapMarkerAlt size={40} />
                                <p>{locationError ? '📍 Не удалось определить местоположение' : 'Нет мест поблизости'}</p>
                                <Link href="/map" className="empty-link">Смотреть на карте →</Link>
                            </div>
                        ) : (
                            <div className="nearby-list">
                                {nearbyRestaurants.map((place) => (
                                    <Link 
                                        key={place.id} 
                                        href={`/restaurants/${place.slug}`} 
                                        className={`nearby-item ${place.is_gold ? 'gold-card-shine' : ''}`}
                                    >
                                        {place.is_gold && (
                                            <div className="nearby-gold-badge gold-badge-small">
                                                <FaCrown />
                                                <span>GOLD</span>
                                            </div>
                                        )}
                                        <div className="nearby-image">
                                            <img
                                                src={getImageUrl(place.image || place.images?.[0]?.image)}
                                                alt={place.name}
                                                loading="lazy"
                                            />
                                            <span className="distance-badge">{getDistanceText(place.distance)}</span>
                                        </div>
                                        <div className="nearby-info">
                                            <h3>{place.name}</h3>
                                            <p className="nearby-cuisine">
                                                <GiKnifeFork size={12} />
                                                {place.cuisine || place.cuisine_type || 'Разная кухня'}
                                            </p>
                                            <div className="nearby-meta">
                                                <span className="gold-rating gold-rating-small">
                                                    <FaStar /> {place.rating?.toFixed(1) || '4.5'}
                                                </span>
                                                <span className="price">{getPriceIcon(place.price_level)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
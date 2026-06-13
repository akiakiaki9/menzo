'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaMapMarkerAlt, FaEye, FaSpinner, FaCrown } from 'react-icons/fa'
import { GiKnifeFork } from 'react-icons/gi'
import './TopAndNearby.css'
import '../../styles/gold-card.css'

export default function TopAndNearby() {
    const [nearbyRestaurants, setNearbyRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [locationError, setLocationError] = useState(false)

    const API_URL = 'https://api.menzo.uz'

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
                        <FaMapMarkerAlt className="badge-icon" />
                        <span>Рядом с вами</span>
                    </div>
                    <h2 className="section-title">Места поблизости</h2>
                    <p className="section-subtitle">Лучшие гастрономические точки рядом с вами</p>
                </div>

                <div className="nearby-block">
                    <div className="block-header">
                        <h2>
                            <FaMapMarkerAlt className="header-icon" />
                            <span>Рекомендуем рядом</span>
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
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FaMapMarkedAlt, FaWallet, FaStar, FaLocationArrow, FaCrown, FaCrosshairs, FaExpand } from 'react-icons/fa'
import { GiKnifeFork } from 'react-icons/gi'
import './map-page.css'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'

const Map = dynamic(() => import('../components/map/Map'), {
    ssr: false,
    loading: () => (
        <div className="map-loading">
            <div className="map-loading-spinner"></div>
            <span>Загрузка карты...</span>
        </div>
    )
})

export default function MapPageClient() {
    const [restaurants, setRestaurants] = useState([])
    const [nearbyRestaurants, setNearbyRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [location, setLocation] = useState(null)
    const [locationError, setLocationError] = useState(null)
    const [showNearbyOnly, setShowNearbyOnly] = useState(false)
    const [isLocating, setIsLocating] = useState(false)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    // Сохранение местоположения в localStorage
    const saveLocationToStorage = (lat, lng) => {
        localStorage.setItem('userLocation', JSON.stringify({ lat, lng, timestamp: Date.now() }))
    }

    const getStoredLocation = () => {
        const stored = localStorage.getItem('userLocation')
        if (stored) {
            const { lat, lng, timestamp } = JSON.parse(stored)
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                return { lat, lng }
            }
        }
        return null
    }

    // Определение местоположения
    const getLocation = () => {
        setIsLocating(true)

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                    setLocation(coords)
                    saveLocationToStorage(coords.lat, coords.lng)
                    setLocationError(null)
                    setIsLocating(false)
                },
                (error) => {
                    console.error("Ошибка геолокации:", error)
                    const storedLocation = getStoredLocation()
                    if (storedLocation) {
                        setLocation(storedLocation)
                        setLocationError("Используется сохраненное местоположение")
                    } else {
                        let message = "Не удалось определить ваше местоположение"
                        if (error.code === 1) message = "Доступ к геолокации запрещён. Разрешите доступ в настройках браузера"
                        if (error.code === 2) message = "Позиция недоступна"
                        if (error.code === 3) message = "Превышено время ожидания"
                        setLocationError(message)
                    }
                    setIsLocating(false)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            )
        } else {
            setLocationError("Ваш браузер не поддерживает геолокацию")
            setIsLocating(false)
        }
    }

    // Загружаем рестораны
    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/api/restaurants/`).then(res => res.json()),
            location ? fetch(`${API_URL}/api/restaurants/nearby/?lat=${location.lat}&lng=${location.lng}&radius=10`).then(res => res.json()) : Promise.resolve([])
        ]).then(([allData, nearbyData]) => {
            setRestaurants(Array.isArray(allData) ? allData : [])
            setNearbyRestaurants(Array.isArray(nearbyData) ? nearbyData : [])
            setLoading(false)
        }).catch(err => {
            console.error('Error:', err)
            setLoading(false)
        })
    }, [location, API_URL])

    // Инициализация геолокации
    useEffect(() => {
        const storedLocation = getStoredLocation()
        if (storedLocation) {
            setLocation(storedLocation)
        }
        getLocation()
    }, [])

    const getDistance = (restaurantId) => {
        const nearby = nearbyRestaurants.find(r => r.id === restaurantId)
        return nearby ? nearby.distance : null
    }

    const getDistanceText = (distance) => {
        if (!distance) return null
        if (distance < 1) return `${Math.round(distance * 1000)} м`
        return `${distance.toFixed(1)} км`
    }

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder.jpg'
        if (imagePath.startsWith('http')) return imagePath
        if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
        return `${API_URL}/media/${imagePath}`
    }

    const displayedRestaurants = showNearbyOnly
        ? restaurants.filter(r => getDistance(r.id))
        : restaurants

    const retryLocation = () => {
        getLocation()
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="map-page-loading">
                    <div className="loading-spinner"></div>
                    <p>Загрузка ресторанов...</p>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="map-page">
                <div className="container">
                    {/* Hero секция */}
                    <div className="map-hero">
                        <h1>
                            <FaMapMarkedAlt className="hero-icon" />
                            Карта заведений
                        </h1>
                        <p>Найдите ближайшие рестораны, кафе и другие заведения на карте Узбекистана</p>
                    </div>

                    {/* Управление */}
                    <div className="map-controls-panel">
                        {location && (
                            <label className="nearby-toggle">
                                <input
                                    type="checkbox"
                                    checked={showNearbyOnly}
                                    onChange={(e) => setShowNearbyOnly(e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                                <span className="toggle-text">
                                    <FaLocationArrow />
                                    Только рядом (до 10 км)
                                </span>
                            </label>
                        )}

                        <button
                            className={`refresh-location-btn ${isLocating ? 'loading' : ''}`}
                            onClick={retryLocation}
                            disabled={isLocating}
                        >
                            <FaCrosshairs className={isLocating ? 'spin' : ''} />
                            <span>{isLocating ? 'Определение...' : 'Обновить позицию'}</span>
                        </button>
                    </div>

                    {/* Статус геолокации */}
                    {locationError && (
                        <div className="location-status warning">
                            <FaLocationArrow />
                            <span>{locationError}</span>
                            {locationError.includes("сохраненное") && (
                                <button onClick={retryLocation} className="retry-btn">
                                    Обновить
                                </button>
                            )}
                        </div>
                    )}

                    {location && !locationError && (
                        <div className="location-status success">
                            <FaLocationArrow />
                            <span>Ваше местоположение определено</span>
                        </div>
                    )}

                    {/* Карта */}
                    <Map
                        restaurants={displayedRestaurants}
                        userLocation={location}
                    />

                    {/* Статистика */}
                    <div className="map-stats-card">
                        <div className="stat-item">
                            <GiKnifeFork className="stat-icon" />
                            <div className="stat-info">
                                <span className="stat-value">{displayedRestaurants.length}</span>
                                <span className="stat-label">заведений на карте</span>
                            </div>
                        </div>
                        {location && (
                            <div className="stat-item">
                                <FaLocationArrow className="stat-icon" />
                                <div className="stat-info">
                                    <span className="stat-value">
                                        {nearbyRestaurants.filter(r => r.distance <= 5).length}
                                    </span>
                                    <span className="stat-label">в радиусе 5 км</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Список ресторанов */}
                    {displayedRestaurants.length > 0 && (
                        <div className="restaurants-list">
                            <div className="list-header">
                                <h3>
                                    <FaStar className="list-icon" />
                                    Список заведений
                                </h3>
                                <span className="list-count">{displayedRestaurants.length}</span>
                            </div>

                            <div className="list-grid">
                                {displayedRestaurants.map(restaurant => {
                                    const distance = getDistance(restaurant.id)
                                    const isGold = restaurant.is_gold || false
                                    return (
                                        <div
                                            key={restaurant.id}
                                            className={`list-item ${isGold ? 'gold-card' : ''}`}
                                        >
                                            {isGold && (
                                                <div className="gold-badge-card">
                                                    <FaCrown />
                                                    <span>GOLD</span>
                                                </div>
                                            )}
                                            <a href={`/restaurants/${restaurant.slug}`} className="list-link">
                                                <div className="list-image">
                                                    <img
                                                        src={getImageUrl(restaurant.images?.[0]?.image || restaurant.image)}
                                                        alt={restaurant.name}
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.src = '/placeholder.jpg'
                                                        }}
                                                    />
                                                </div>
                                                <div className="list-info">
                                                    <h4>{restaurant.name}</h4>
                                                    <p className="list-cuisine">
                                                        <GiKnifeFork size={12} />
                                                        {restaurant.cuisine_type || 'Разная кухня'}
                                                    </p>
                                                    <div className="list-meta">
                                                        <span className="list-price">
                                                            <FaWallet size={10} />
                                                            {restaurant.price_level || '$$'}
                                                        </span>
                                                        <span className="list-rating">
                                                            <FaStar size={10} />
                                                            {restaurant.rating?.toFixed(1) || 'Новый'}
                                                        </span>
                                                        {distance && (
                                                            <span className="list-distance">
                                                                <FaLocationArrow size={10} />
                                                                {getDistanceText(distance)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Пустое состояние */}
                    {displayedRestaurants.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-icon">🗺️</div>
                            <h3>Заведения не найдены</h3>
                            <p>Попробуйте изменить параметры поиска</p>
                            {showNearbyOnly && (
                                <button className="reset-btn" onClick={() => setShowNearbyOnly(false)}>
                                    Показать все заведения
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}
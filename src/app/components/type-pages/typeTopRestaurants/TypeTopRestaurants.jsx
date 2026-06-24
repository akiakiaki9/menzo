'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaTrophy, FaStar, FaWallet, FaEye, FaSpinner, FaArrowRight, FaCrown, FaMapMarkerAlt } from 'react-icons/fa'
import { GiKnifeFork } from 'react-icons/gi'
import './TypeTopRestaurants.css'

export default function TypeTopRestaurants({ type }) {
    const [topRestaurants, setTopRestaurants] = useState([])
    const [nearbyRestaurants, setNearbyRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [locationError, setLocationError] = useState(false)

    const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

    // Загружаем рестораны и сортируем по рейтингу
    useEffect(() => {
        if (!type) return

        setLoading(true)
        fetch(`${API_URL}/api/restaurants/?type=${type}`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok')
                return res.json()
            })
            .then(data => {
                // Фильтруем рестораны с рейтингом и сортируем по убыванию
                const withRating = data
                    .filter(r => r.rating !== null && r.rating !== undefined && r.rating > 0)
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                
                // Берем первые 5
                setTopRestaurants(withRating.slice(0, 5))
                setLoading(false)
            })
            .catch(err => {
                // console.error('Error:', err)
                setLoading(false)
            })
    }, [type, API_URL])

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
            setNearbyRestaurants(data.slice(0, 5))
            setLoading(false)
        } catch (error) {
            // console.error('Ошибка:', error)
            setLoading(false)
        }
    }

    const getPriceIcon = (price) => {
        switch (price) {
            case '$': return <FaWallet className="price-icon level-1" />
            case '$$': return <><FaWallet className="price-icon level-1" /><FaWallet className="price-icon level-2" /></>
            case '$$$': return <><FaWallet className="price-icon level-1" /><FaWallet className="price-icon level-2" /><FaWallet className="price-icon level-3" /></>
            case '$$$$': return <><FaWallet className="price-icon level-1" /><FaWallet className="price-icon level-2" /><FaWallet className="price-icon level-3" /><FaWallet className="price-icon level-4" /></>
            default: return <FaWallet className="price-icon" />
        }
    }

    const getTypeTitle = () => {
        const titles = {
            'restaurants': 'ресторанов',
            'cafes': 'кафе',
            'fast-food': 'фастфуда',
            'coffeehouses': 'кофеен',
            'teahouses': 'чайхан',
            'restobars': 'рестобаров',
            'bakeries': 'пекарен',
            'canteens': 'столовых'
        }
        return titles[type] || 'заведений'
    }

    const getImageUrl = (restaurant) => {
        const imagePath = restaurant.images?.[0]?.image || restaurant.image
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

    const formatRating = (rating) => {
        if (!rating || rating === 0) return 'Новый'
        return rating.toFixed(1)
    }

    if (loading) {
        return (
            <div className="type-top-block loading-state">
                <div className="type-top-header">
                    <h3>
                        <FaTrophy className="header-icon" />
                        Загрузка...
                    </h3>
                </div>
                <div className="loading-skeleton">
                    <FaSpinner className="spinner" />
                    <span>Загрузка лучших мест</span>
                </div>
            </div>
        )
    }

    if (topRestaurants.length === 0 && nearbyRestaurants.length === 0) return null

    return (
        <div className="type-top-block">
            {/* Топ рестораны */}
            {topRestaurants.length > 0 && (
                <>
                    <div className="type-top-header">
                        <h3>
                            <FaTrophy className="header-icon trophy" />
                            <span>Топ 5 {getTypeTitle()}</span>
                        </h3>
                    </div>

                    <div className="type-top-list">
                        {topRestaurants.map((restaurant, index) => (
                            <Link
                                key={restaurant.id}
                                href={`/restaurants/${restaurant.slug}`}
                                className={`type-top-item ${restaurant.is_gold ? 'gold-top-item' : ''}`}
                            >
                                <div className="top-rank">
                                    <span className="rank-number">{index + 1}</span>
                                    {index === 0 && <span className="rank-crown">👑</span>}
                                </div>

                                <div className="top-image">
                                    <img
                                        src={getImageUrl(restaurant)}
                                        alt={restaurant.name}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = '/placeholder.jpg'
                                        }}
                                    />
                                    {restaurant.is_gold && (
                                        <div className="top-gold-badge">
                                            <FaCrown />
                                        </div>
                                    )}
                                </div>

                                <div className="top-info">
                                    <h4>{restaurant.name}</h4>
                                    <div className="top-cuisine">
                                        <GiKnifeFork size={10} />
                                        <span>{restaurant.cuisine_type_label || restaurant.cuisine || restaurant.cuisine_type || 'Разная кухня'}</span>
                                    </div>
                                    <div className="top-meta">
                                        <span className="rating">
                                            <FaStar className="star-icon" />
                                            {formatRating(restaurant.rating)}
                                        </span>
                                        <span className="price">
                                            {getPriceIcon(restaurant.price_level)}
                                        </span>
                                        {restaurant.reviews_count > 0 && (
                                            <span className="reviews">
                                                {restaurant.reviews_count}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="top-arrow">
                                    <FaEye className="arrow-icon" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}

            {/* Разделитель */}
            {topRestaurants.length > 0 && nearbyRestaurants.length > 0 && (
                <div className="type-top-divider">
                    <span>Рядом с вами</span>
                </div>
            )}

            {/* Рестораны рядом */}
            {nearbyRestaurants.length > 0 && (
                <div className="nearby-section">
                    <div className="nearby-header">
                        <h4>
                            <FaMapMarkerAlt className="nearby-icon" />
                            <span>Рядом с вами</span>
                        </h4>
                        <Link href="/map" className="view-all-link">
                            <span>Все</span>
                            <FaArrowRight />
                        </Link>
                    </div>

                    <div className="nearby-list">
                        {nearbyRestaurants.map((place) => (
                            <Link
                                key={place.id}
                                href={`/restaurants/${place.slug}`}
                                className={`nearby-item ${place.is_gold ? 'gold-nearby-item' : ''}`}
                            >
                                <div className="nearby-image">
                                    <img
                                        src={getImageUrl(place)}
                                        alt={place.name}
                                        loading="lazy"
                                    />
                                    <span className="distance-badge">{getDistanceText(place.distance)}</span>
                                    {place.is_gold && (
                                        <div className="nearby-gold-badge">
                                            <FaCrown />
                                        </div>
                                    )}
                                </div>
                                <div className="nearby-info">
                                    <h4>{place.name}</h4>
                                    <div className="nearby-cuisine">
                                        <GiKnifeFork size={10} />
                                        <span>{place.cuisine_type_label || place.cuisine || place.cuisine_type || 'Разная кухня'}</span>
                                    </div>
                                    <div className="nearby-meta">
                                        <span className="rating">
                                            <FaStar className="star-icon" />
                                            {formatRating(place.rating)}
                                        </span>
                                        <span className="price">
                                            {getPriceIcon(place.price_level)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaTrophy, FaStar, FaWallet, FaEye, FaSpinner, FaArrowRight, FaCrown } from 'react-icons/fa'
import { GiKnifeFork } from 'react-icons/gi'
import './TypeTopRestaurants.css'

export default function TypeTopRestaurants({ type }) {
    const [topRestaurants, setTopRestaurants] = useState([])
    const [loading, setLoading] = useState(true)

    const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

    useEffect(() => {
        if (!type) return

        setLoading(true)
        fetch(`${API_URL}/api/restaurants/?type=${type}&limit=6&sort=rating`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok')
                return res.json()
            })
            .then(data => {
                setTopRestaurants(data.slice(0, 3))
                setLoading(false)
            })
            .catch(err => {
                console.error('Error:', err)
                setLoading(false)
            })
    }, [type, API_URL])

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
            'restaurants': 'ресторана',
            'cafes': 'кафе',
            'fast-food': 'фастфуда',
            'coffeehouses': 'кофейни',
            'teahouses': 'чайханы',
            'restobars': 'рестобара',
            'bakeries': 'пекарни',
            'canteens': 'столовой'
        }
        return titles[type] || 'заведения'
    }

    const getImageUrl = (restaurant) => {
        const imagePath = restaurant.images?.[0]?.image || restaurant.image
        if (!imagePath) return '/placeholder.jpg'
        if (imagePath.startsWith('http')) return imagePath
        if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
        return `${API_URL}/media/${imagePath}`
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

    if (topRestaurants.length === 0) return null

    return (
        <div className="type-top-block">
            <div className="type-top-header">
                <h3>
                    <FaTrophy className="header-icon trophy" />
                    <span>Топ 3 {getTypeTitle()}</span>
                </h3>
                <Link href={`/type/${type}?sort=rating`} className="view-all-link">
                    <span>Все</span>
                    <FaArrowRight />
                </Link>
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
        </div>
    )
}
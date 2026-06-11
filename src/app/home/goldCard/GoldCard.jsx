'use client'
import Link from 'next/link'
import { FaStar, FaMapMarkerAlt, FaWallet, FaCrown, FaUtensils } from 'react-icons/fa'

export default function GoldCard({ restaurant }) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder.jpg'
        if (imagePath.startsWith('http')) return imagePath
        if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
        return `${API_URL}/media/${imagePath}`
    }

    return (
        <div className="gold-card">
            <div className="gold-card-badge">
                <FaCrown />
                <span>GOLD</span>
            </div>
            <div className="gold-card-image">
                <img
                    src={getImageUrl(restaurant.images?.[0]?.image || restaurant.logo)}
                    alt={restaurant.name}
                    onError={(e) => e.target.src = '/placeholder.jpg'}
                />
            </div>
            <div className="gold-card-content">
                <h3>{restaurant.name}</h3>
                <div className="gold-card-meta">
                    <span className="rating">
                        <FaStar /> {restaurant.rating?.toFixed(1) || 'Новый'}
                    </span>
                    <span className="price">
                        <FaWallet /> {restaurant.price_level || '$$'}
                    </span>
                </div>
                <div className="gold-card-location">
                    <FaMapMarkerAlt />
                    <span>{restaurant.region_label || 'Ташкент'}</span>
                </div>
                <div className="gold-card-cuisine">
                    <FaUtensils />
                    <span>{restaurant.cuisine_type_label || restaurant.cuisine_type || 'Разная кухня'}</span>
                </div>
                <Link href={`/restaurants/${restaurant.slug}`} className="gold-card-btn">
                    Подробнее
                </Link>
            </div>
        </div>
    )
}
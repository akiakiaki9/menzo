import Link from 'next/link'
import { FaStar, FaMapMarkerAlt, FaWallet, FaEye, FaCrown } from 'react-icons/fa'
import './TypeRestaurantCard.css'

export default function TypeRestaurantCard({ restaurant }) {
    const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'
    const isGold = restaurant.is_gold || false

    const getPriceText = (price) => {
        switch (price) {
            case '$': return 'Эконом'
            case '$$': return 'Средний'
            case '$$$': return 'Высокий'
            case '$$$$': return 'Премиум'
            default: return ''
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

    const getCuisineIcon = (cuisineType) => {
        const cuisineMap = {
            'uzbek': '🇺🇿',
            'european': '🇪🇺',
            'italian': '🇮🇹',
            'turkish': '🇹🇷',
            'caucasian': '🏔️',
            'asian': '🥢',
            'japanese': '🍣',
            'korean': '🇰🇷',
            'chinese': '🇨🇳',
            'fastfood': '🍟',
            'georgian': '🇬🇪'
        }
        return cuisineMap[cuisineType] || '🍽️'
    }

    const getCuisineText = (cuisineType) => {
        const cuisineMap = {
            'uzbek': 'Узбекская',
            'european': 'Европейская',
            'italian': 'Итальянская',
            'turkish': 'Турецкая',
            'caucasian': 'Кавказская',
            'asian': 'Азиатская',
            'japanese': 'Японская',
            'korean': 'Корейская',
            'chinese': 'Китайская',
            'fastfood': 'Фастфуд',
            'georgian': 'Грузинская'
        }
        return cuisineMap[cuisineType] || restaurant.cuisine_type || 'Разное'
    }

    const getImageUrl = () => {
        if (restaurant.images && restaurant.images.length > 0 && restaurant.images[0].image) {
            const imagePath = restaurant.images[0].image
            if (imagePath.startsWith('http')) return imagePath
            if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
            return `${API_URL}/media/${imagePath}`
        }
        if (restaurant.image) {
            const imagePath = restaurant.image
            if (imagePath.startsWith('http')) return imagePath
            if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
            return `${API_URL}/media/${imagePath}`
        }
        return '/placeholder.jpg'
    }

    const truncateText = (text, maxLength = 25) => {
        if (!text) return ''
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    const formatRating = (rating) => {
        if (!rating || rating === 0) return 'Новый'
        return rating.toFixed(1)
    }

    return (
        <div className={`type-restaurant-card ${isGold ? 'gold-card' : ''}`}>
            {isGold && (
                <div className="card-gold-badge">
                    <FaCrown />
                    <span>GOLD</span>
                </div>
            )}
            <Link href={`/restaurants/${restaurant.slug}`}>
                <div className="card-image">
                    <img
                        src={getImageUrl()}
                        alt={restaurant.name}
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = '/placeholder.jpg'
                        }}
                    />
                    <div className="price-badge" title={getPriceText(restaurant.price_level)}>
                        {getPriceIcon(restaurant.price_level)}
                    </div>
                    {restaurant.is_open_now !== false && (
                        <span className="open-now-badge">
                            <span className="dot"></span>
                            Открыто
                        </span>
                    )}
                </div>

                <div className="card-info">
                    <h3>{truncateText(restaurant.name)}</h3>

                    <div className="cuisine-location">
                        <span className="cuisine">
                            {getCuisineIcon(restaurant.cuisine_type)} {getCuisineText(restaurant.cuisine_type)}
                        </span>
                        {restaurant.region_label && (
                            <span className="location">
                                <FaMapMarkerAlt size={10} />
                                {truncateText(restaurant.region_label, 20)}
                            </span>
                        )}
                    </div>

                    <div className="card-meta">
                        <div className={`rating ${isGold ? 'gold-rating' : ''}`}>
                            <FaStar className="star-icon" />
                            <span className="rating-value">{formatRating(restaurant.rating)}</span>
                            <span className="reviews-count">
                                ({restaurant.analytics?.total_ratings || restaurant.reviews_count || 0})
                            </span>
                        </div>
                    </div>

                    {restaurant.features && restaurant.features.length > 0 && (
                        <div className="card-features">
                            {restaurant.features.slice(0, 3).map((feature, i) => (
                                <span key={i} className="feature" title={feature.label}>
                                    {truncateText(feature.label, 12)}
                                </span>
                            ))}
                            {restaurant.features.length > 3 && (
                                <span className="feature more">+{restaurant.features.length - 3}</span>
                            )}
                        </div>
                    )}

                    <div className="card-footer-hint">
                        <FaEye className="hint-icon" />
                        <span>Подробнее</span>
                    </div>
                </div>
            </Link>
        </div>
    )
}
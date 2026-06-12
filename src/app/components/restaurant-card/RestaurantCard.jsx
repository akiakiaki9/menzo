'use client'
import Link from 'next/link'
import './restaurant-card.css'

export default function RestaurantCard({ restaurant }) {
  const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg'
    if (imagePath.startsWith('http')) return imagePath
    return `${API_URL}${imagePath}`
  }

  const firstImage = restaurant.images && restaurant.images.length > 0
    ? getImageUrl(restaurant.images[0].image)
    : '/placeholder.jpg'

  const cuisines = restaurant.cuisines_list || [restaurant.cuisine]

  return (
    <div className="restaurant-card">
      <div className="card-image-wrapper">
        <img src={firstImage} alt={restaurant.name} className="card-image" />
        <div className="card-badge">{restaurant.price_level}</div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{restaurant.name}</h3>
        <div className="card-cuisines">
          {cuisines.slice(0, 2).map((c, i) => (
            <span key={i} className="cuisine-badge">{c}</span>
          ))}
        </div>
        <div className="card-info">
          <span className="card-rating">★ {restaurant.rating}</span>
          <span className="card-price">{restaurant.price_level}</span>
        </div>
        <Link href={`/restaurants/${restaurant.slug}`} className="card-link">
          Подробнее →
        </Link>
      </div>
    </div>
  )
};
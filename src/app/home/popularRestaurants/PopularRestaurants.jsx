import Link from 'next/link'
import { FaStar, FaRegClock, FaUtensils, FaWallet, FaTag, FaCrown } from 'react-icons/fa'
import { BiTrendingUp } from 'react-icons/bi'
import './PopularRestaurants.css'
import '../../styles/gold-card.css'

export default function PopularRestaurants({ restaurants }) {
  const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

  const isOpenNow = () => {
    const currentHour = new Date().getHours()
    return currentHour >= 10 && currentHour < 23
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg'
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
    return `${API_URL}/media/${imagePath}`
  }

  const getPriceLevel = (price) => {
    switch (price) {
      case '$': return 'Доступно'
      case '$$': return 'Средний'
      case '$$$': return 'Высокий'
      case '$$$$': return 'Премиум'
      default: return price || 'Средний'
    }
  }

  // Если нет данных - вообще не показываем компонент
  if (!restaurants || !Array.isArray(restaurants) || restaurants.length === 0) {
    return null
  }

  return (
    <section className="popular-section">
      <div className="container">
        <div className="section-header">
          <div className="header-badge">
            <BiTrendingUp className="badge-icon" />
            <span>Популярное</span>
          </div>
          <h2 className="section-title gold-title">Популярные места</h2>
          <p className="section-subtitle">Лучшие гастрономические точки по версии наших гостей</p>
        </div>

        <div className="places-grid">
          {restaurants.map(place => (
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

              <div className="card-image-wrapper">
                <img
                  src={getImageUrl(place.images?.[0]?.image || place.image)}
                  alt={place.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg'
                  }}
                />
                {isOpenNow() && (
                  <span className="open-badge">
                    <FaRegClock /> Открыто
                  </span>
                )}
                {place.rating >= 4.5 && (
                  <span className="top-badge">
                    <FaStar /> Топ рейтинг
                  </span>
                )}
              </div>

              <div className="card-content">
                <h3>{place.name}</h3>
                <p className="location">{place.region_label || place.location || 'Ташкент'}</p>

                <div className="card-tags">
                  <span className="cuisine-tag">
                    <FaUtensils size={12} />
                    {place.cuisine_type || place.cuisine || 'Разная кухня'}
                  </span>
                  <span className="price-tag">
                    <FaWallet size={12} />
                    {getPriceLevel(place.price_level)}
                  </span>
                </div>

                {place.features && place.features.length > 0 && (
                  <div className="card-features">
                    {place.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="feature-badge">
                        <FaTag size={10} />
                        {feature.label || feature}
                      </span>
                    ))}
                  </div>
                )}

                <div className="card-footer">
                  <div className="rating gold-rating">
                    <FaStar className="star-icon" />
                    <span>{place.rating?.toFixed(1) || '4.5'}</span>
                    <span className="reviews-count">({place.reviews_count || 0})</span>
                  </div>
                  <Link href={`/restaurants/${place.slug}`} className="card-link">
                    Подробнее →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
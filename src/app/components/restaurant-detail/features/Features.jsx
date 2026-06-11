import {
  FaWifi, FaParking, FaTree, FaUsers, FaHeart, FaMusic,
  FaSmoking, FaChild, FaTruck, FaBox, FaDog, FaWheelchair,
  FaCreditCard, FaSnowflake, FaCoffee, FaTv, FaGamepad,
  FaCalendarAlt, FaPhoneAlt, FaLock, FaRegSmile, FaCrown
} from 'react-icons/fa'
import { GiMeal, GiCakeSlice, GiCupcake, GiPartyPopper } from 'react-icons/gi'
import './Features.css'

export default function Features({ features, isGold = false }) {
  // Расширенная карта иконок
  const featureIcons = {
    wifi: <FaWifi />,
    parking: <FaParking />,
    terrace: <FaTree />,
    family: <FaUsers />,
    romantic: <FaHeart />,
    live_music: <FaMusic />,
    hookah: <GiCupcake />,
    kids_friendly: <FaChild />,
    delivery: <FaTruck />,
    takeaway: <FaBox />,
    smoking: <FaSmoking />,
    pet_friendly: <FaDog />,
    wheelchair: <FaWheelchair />,
    card_payment: <FaCreditCard />,
    air_conditioning: <FaSnowflake />,
    coffee: <FaCoffee />,
    tv: <FaTv />,
    board_games: <FaGamepad />,
    banquet_hall: <FaCalendarAlt />,
    call_waiter: <FaPhoneAlt />,
    cloak_room: <FaLock />,
    vegetarian: <GiMeal />,
    champagne: <GiPartyPopper />,
    birthday: <GiCakeSlice />,
    smile: <FaRegSmile />
  }

  // Цвета для разных категорий фич
  const getFeatureColor = (featureValue) => {
    const colors = {
      wifi: '#3498db',
      parking: '#2ecc71',
      terrace: '#27ae60',
      romantic: '#e74c3c',
      live_music: '#9b59b6',
      hookah: '#e67e22',
      delivery: '#f39c12',
      smoking: '#95a5a6',
      pet_friendly: '#e67e22',
      wheelchair: '#1abc9c',
      air_conditioning: '#3498db'
    }
    return colors[featureValue] || '#95a5a6'
  }

  if (!features || features.length === 0) return null

  return (
    <div className={`features-section ${isGold ? 'gold-features' : ''}`}>
      <div className="features-header">
        <div className="header-icon">
          <FaRegSmile />
        </div>
        <h3>Особенности и удобства</h3>
        <span className="features-count">{features.length}</span>
        {isGold && (
          <div className="features-gold-badge">
            <FaCrown />
            <span>PREMIUM</span>
          </div>
        )}
      </div>

      <div className="features-grid">
        {features.map((feature, idx) => {
          const icon = featureIcons[feature.value] || featureIcons[feature.label?.toLowerCase().replace(/\s+/g, '_')] || <FaRegSmile />
          const color = getFeatureColor(feature.value)

          return (
            <div
              key={idx}
              className={`feature-item ${isGold ? 'gold-feature-item' : ''}`}
              style={{ '--feature-color': color }}
              data-type={feature.value}
            >
              <span className="feature-icon" style={{ color: color }}>
                {icon}
              </span>
              <span className="feature-label">{feature.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
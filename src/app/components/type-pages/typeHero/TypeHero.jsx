import { FaStore, FaStar, FaMoneyBillWave, FaMapMarkerAlt, FaUtensils, FaCoffee, FaHamburger, FaGlassCheers, FaMugHot, FaLeaf, FaBreadSlice, FaConciergeBell } from 'react-icons/fa'
import './TypeHero.css'

export default function TypeHero({ typeData, count }) {
  // Функция для получения правильной иконки на основе типа заведения
  const getTypeIcon = () => {
    const type = typeData.type?.toLowerCase()
    const iconMap = {
      'restaurants': <FaUtensils />,
      'cafes': <FaCoffee />,
      'fast-food': <FaHamburger />,
      'restobars': <FaGlassCheers />,
      'coffeehouses': <FaMugHot />,
      'teahouses': <FaLeaf />,
      'bakeries': <FaBreadSlice />,
      'canteens': <FaConciergeBell />,
      'default': <FaStore />
    }
    return iconMap[type] || iconMap['default']
  }

  // Дефолтные фичи для разных типов заведений
  const getDefaultFeatures = (type) => {
    const featuresMap = {
      'restaurants': ['🍽️ Авторская кухня', '🍷 Винная карта', '🎵 Живая музыка'],
      'cafes': ['☕ Ароматный кофе', '🍰 Домашние десерты', '📚 Уютная атмосфера'],
      'fast-food': ['⚡ Быстрое обслуживание', '🍟 Вкусные бургеры', '🚗 Доставка 24/7'],
      'restobars': ['🍹 Коктейльная карта', '🎶 Вечеринки', '🍕 Легкие закуски'],
      'coffeehouses': ['☕ Кофе из разных стран', '🥐 Свежие круассаны', '💻 Wi-Fi'],
      'teahouses': ['🍵 Настоящий чай', '🍬 Восточные сладости', '🧘 Атмосфера уюта'],
      'bakeries': ['🥖 Свежая выпечка', '🎂 Торты на заказ', '🥐 Круассаны'],
      'canteens': ['🍲 Домашняя еда', '💰 Доступные цены', '🍛 Комплексные обеды']
    }
    return featuresMap[type] || ['⭐ Проверенные заведения', '📋 Актуальные меню', '📍 Удобное расположение']
  }

  const features = typeData.features?.length > 0 ? typeData.features : getDefaultFeatures(typeData.type)

  return (
    <section className="type-hero">
      <div className="container">
        <div className="type-hero-content">
          <div className="type-hero-icon">
            {getTypeIcon()}
          </div>
          
          <h1>
            <span className="hero-title-main">{typeData.plural}</span>
            <span className="hero-title-location"> в Узбекистане</span>
          </h1>
          
          <p className="type-hero-description">{typeData.description}</p>

          {features.length > 0 && (
            <div className="type-hero-features">
              {features.map((feature, idx) => (
                <span key={idx} className="feature-badge">
                  {feature}
                </span>
              ))}
            </div>
          )}

          <div className="type-hero-stats">
            <span className="stat">
              <FaStore className="stat-icon" />
              <strong>{count}+</strong> заведений
            </span>
            <span className="stat">
              <FaStar className="stat-icon star-icon" />
              <span>Рейтинг от посетителей</span>
            </span>
            <span className="stat">
              <FaMoneyBillWave className="stat-icon" />
              <span>Актуальные цены</span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="type-hero-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="var(--bg-primary)" fillOpacity="1" d="M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,208C672,213,768,203,864,186.7C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
        </svg>
      </div>
    </section>
  )
}
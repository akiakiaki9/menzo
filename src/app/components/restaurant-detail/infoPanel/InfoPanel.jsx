import { FaWallet, FaUtensils, FaClock, FaCoffee, FaPhone, FaTelegramPlane, FaTags, FaGlassCheers, FaBreadSlice, FaInstagram, FaCrown } from 'react-icons/fa'
import { GiKnifeFork, GiMeal } from 'react-icons/gi'
import './InfoPanel.css'

export default function InfoPanel({ restaurant }) {
    const getPriceRange = (priceLevel) => {
        const ranges = {
            '$': { min: 0, max: 50000, text: 'До 50K', icon: '💰' },
            '$$': { min: 50000, max: 150000, text: '50-150K', icon: '💰💰' },
            '$$$': { min: 150000, max: 300000, text: '150-300K', icon: '💰💰💰' },
            '$$$$': { min: 300000, max: null, text: '300K+', icon: '💰💰💰💰' }
        }
        return ranges[priceLevel] || { text: 'Средний', icon: '💰💰' }
    }

    const getEstablishmentType = (type) => {
        const types = {
            'restaurant': { label: 'Ресторан', icon: <FaUtensils />, color: '#e67e22' },
            'cafe': { label: 'Кафе', icon: <FaCoffee />, color: '#3498db' },
            'fastfood': { label: 'Фастфуд', icon: <GiMeal />, color: '#e74c3c' },
            'coffeehouse': { label: 'Кофейня', icon: <FaCoffee />, color: '#8e44ad' },
            'teahouse': { label: 'Чайхана', icon: <GiKnifeFork />, color: '#2ecc71' },
            'restobar': { label: 'Рестобар', icon: <FaGlassCheers />, color: '#f39c12' },
            'bakery': { label: 'Пекарня', icon: <FaBreadSlice />, color: '#d35400' },
            'canteen': { label: 'Столовая', icon: <GiMeal />, color: '#1abc9c' }
        }
        return types[type] || { label: 'Заведение', icon: <FaUtensils />, color: '#95a5a6' }
    }

    const priceRange = getPriceRange(restaurant.price_level)
    const establishmentType = getEstablishmentType(restaurant.establishment_type)
    const cuisineList = restaurant.cuisines_list || (restaurant.cuisine_type ? [restaurant.cuisine_type] : ['Разная'])

    const infoItems = [
        {
            icon: <FaWallet />,
            title: 'Чек',
            value: priceRange.text,
            extra: priceRange.icon,
            color: '#2ecc71'
        },
        {
            icon: establishmentType.icon,
            title: 'Тип',
            value: establishmentType.label,
            color: establishmentType.color
        },
        {
            icon: <GiKnifeFork />,
            title: 'Кухня',
            value: cuisineList.slice(0, 2).join(' • '),
            color: '#e67e22'
        },
        {
            icon: <FaClock />,
            title: 'Часы',
            value: restaurant.working_hours?.split('-')[0] || '10:00',
            color: '#3498db'
        }
    ]

    const hasContacts = restaurant.phone || restaurant.telegram || restaurant.instagram

    return (
        <div className={`info-panel-mobile ${restaurant.is_gold ? 'gold-panel' : ''}`}>
            {restaurant.is_gold && (
                <div className="panel-gold-badge">
                    <FaCrown />
                    <span>GOLD</span>
                </div>
            )}

            <div className="info-grid-mobile">
                {infoItems.map((item, index) => (
                    <div key={index} className="info-card-mobile">
                        <div className="info-icon-mobile" style={{ color: item.color }}>
                            {item.icon}
                        </div>
                        <div className="info-content-mobile">
                            <span className="info-label-mobile">{item.title}</span>
                            <span className="info-value-mobile">
                                {item.extra && <span className="info-extra">{item.extra}</span>}
                                {item.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {hasContacts && (
                <div className="contacts-mobile">
                    <div className="contacts-header-mobile">
                        <span>📞 Контакты</span>
                    </div>
                    <div className="contacts-list-mobile">
                        {restaurant.phone && (
                            <a href={`tel:${restaurant.phone}`} className="contact-mobile phone-mobile">
                                <FaPhone size={12} />
                                <span>{restaurant.phone}</span>
                            </a>
                        )}
                        {restaurant.telegram && (
                            <a
                                href={restaurant.telegram.startsWith('http') ? restaurant.telegram : `https://t.me/${restaurant.telegram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-mobile telegram-mobile"
                            >
                                <FaTelegramPlane size={12} />
                                <span>TG</span>
                            </a>
                        )}
                        {restaurant.instagram && (
                            <a
                                href={restaurant.instagram.startsWith('http') ? restaurant.instagram : `https://instagram.com/${restaurant.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-mobile instagram-mobile"
                            >
                                <FaInstagram size={12} />
                                <span>IG</span>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {restaurant.features && restaurant.features.length > 0 && (
                <div className="features-mobile">
                    <div className="features-header-mobile">
                        <FaTags size={10} />
                        <span>Особенности</span>
                    </div>
                    <div className="features-list-mobile">
                        {restaurant.features.slice(0, 4).map((feature, idx) => (
                            <span key={idx} className="feature-mobile">
                                {feature.icon || '✓'} {typeof feature === 'string' ? feature.substring(0, 18) : feature.label.substring(0, 18)}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    FaStar, FaMapMarkerAlt, FaCrown, FaArrowLeft, FaArrowRight, FaPhone, FaTelegramPlane, FaInstagram
} from 'react-icons/fa'
import Navbar from '@/app/components/navbar/Navbar'
import Footer from '@/app/components/footer/Footer'
import './recommended.css'

export default function RecommendedPage() {
    const [recommended, setRecommended] = useState([])
    const [topRated, setTopRated] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [debugInfo, setDebugInfo] = useState({})

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            
            // Логируем информацию об окружении
            console.log('=== ДЕБАГ ИНФОРМАЦИЯ ===')
            console.log('API_URL:', API_URL)
            console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
            console.log('Текущий URL страницы:', window.location.href)
            console.log('Хост:', window.location.host)
            
            setDebugInfo({
                apiUrl: API_URL,
                envVar: process.env.NEXT_PUBLIC_API_URL,
                currentHost: window.location.host,
                currentUrl: window.location.href
            })

            try {
                // Проверяем доступность API
                console.log(`🟡 Пытаемся подключиться к: ${API_URL}/api/restaurants/recommended/?limit=20`)
                
                // Загружаем рекомендованные рестораны
                const recommendedRes = await fetch(`${API_URL}/api/restaurants/recommended/?limit=20`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                
                console.log('📊 Статус ответа recommended:', recommendedRes.status)
                console.log('📊 Заголовки ответа:', Object.fromEntries(recommendedRes.headers.entries()))
                
                if (recommendedRes.ok) {
                    const data = await recommendedRes.json()
                    console.log('✅ Рекомендованные рестораны получены:', data)
                    console.log('📊 Количество ресторанов:', data.length)
                    setRecommended(data)
                } else {
                    const errorText = await recommendedRes.text()
                    console.error('❌ Ошибка загрузки recommended:', recommendedRes.status, errorText)
                    setError(`Ошибка ${recommendedRes.status}: ${errorText}`)
                }

                // Загружаем топ ресторан
                console.log(`🟡 Пытаемся подключиться к: ${API_URL}/api/restaurants/top_rated/`)
                const topRes = await fetch(`${API_URL}/api/restaurants/top_rated/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                
                console.log('📊 Статус ответа top_rated:', topRes.status)
                
                if (topRes.ok) {
                    const data = await topRes.json()
                    console.log('✅ Топ ресторан получен:', data)
                    setTopRated(data)
                } else {
                    const errorText = await topRes.text()
                    console.error('❌ Ошибка загрузки top_rated:', topRes.status, errorText)
                }
            } catch (err) {
                console.error('❌❌❌ КРИТИЧЕСКАЯ ОШИБКА:', err)
                console.error('Тип ошибки:', err.name)
                console.error('Сообщение:', err.message)
                console.error('Полный объект ошибки:', err)
                setError(`Ошибка соединения: ${err.message}. API_URL: ${API_URL}`)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [API_URL])

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder.jpg'
        if (imagePath.startsWith('http')) return imagePath
        if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
        return `${API_URL}/media/${imagePath}`
    }

    // Отделяем Gold рестораны от обычных для отображения
    const goldRestaurants = recommended.filter(r => r.is_gold === true)
    const regularRestaurants = recommended.filter(r => r.is_gold !== true)

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="recommended-loading">
                    <div className="loading-spinner"></div>
                    <p>Загрузка рекомендаций...</p>
                    <div style={{ fontSize: '12px', marginTop: '10px', color: '#666' }}>
                        Подключение к: {API_URL}
                    </div>
                </div>
                <Footer />
            </>
        )
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="recommended-loading" style={{ color: 'red' }}>
                    <h3>Ошибка загрузки данных</h3>
                    <p>{error}</p>
                    <div style={{ fontSize: '12px', marginTop: '10px', textAlign: 'left', background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
                        <strong>Дебаг информация:</strong><br />
                        API_URL: {debugInfo.apiUrl}<br />
                    Переменная окружения: {debugInfo.envVar || 'не задана'}<br />
                        Хост страницы: {debugInfo.currentHost}<br />
                        URL страницы: {debugInfo.currentUrl}
                    </div>
                    <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
                        Попробовать снова
                    </button>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="recommended-page">
                <div className="container">
                    {/* Дебаг панель (только для разработки) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div style={{ background: '#f0f0f0', padding: '10px', marginBottom: '20px', fontSize: '12px', borderRadius: '5px' }}>
                            <details>
                                <summary>🔧 Дебаг информация (API: {API_URL})</summary>
                                <pre style={{ overflow: 'auto' }}>
                                    {JSON.stringify(debugInfo, null, 2)}
                                </pre>
                            </details>
                        </div>
                    )}

                    {/* Header */}
                    <div className="page-header">
                        <Link href="/" className="back-link">
                            <FaArrowLeft />
                            <span>На главную</span>
                        </Link>
                        <div className="page-title">
                            <FaCrown className="title-icon" />
                            <h1>Рекомендованные рестораны</h1>
                        </div>
                        <p className="page-subtitle">
                            Лучшие заведения с высоким рейтингом и премиум сервисом
                        </p>
                    </div>

                    {/* Остальной JSX без изменений... */}
                    {/* Топ ресторан */}
                    {topRated && (
                        <div className="top-rated-section">
                            <div className="top-rated-badge">
                                <FaCrown />
                                <span>РЕСТОРАН НЕДЕЛИ</span>
                            </div>
                            <div className="top-rated-card">
                                <div className="top-rated-image">
                                    <img
                                        src={getImageUrl(topRated.images?.[0]?.image || topRated.logo)}
                                        alt={topRated.name}
                                    />
                                    {topRated.is_gold && <span className="gold-label">GOLD</span>}
                                </div>
                                <div className="top-rated-details">
                                    <h2>{topRated.name}</h2>
                                    <div className="top-rated-meta">
                                        <span className="rating">
                                            <FaStar /> {topRated.rating?.toFixed(1) || 'Новый'}
                                        </span>
                                        <span className="price">{topRated.price_level || '$$'}</span>
                                        <span className="cuisine">{topRated.cuisine_type_label || 'Разная кухня'}</span>
                                    </div>
                                    <p className="top-rated-desc">{topRated.description?.substring(0, 200)}...</p>
                                    <div className="top-rated-contacts">
                                        {topRated.phone && (
                                            <a href={`tel:${topRated.phone}`} className="contact-item">
                                                <FaPhone />
                                                <span>{topRated.phone}</span>
                                            </a>
                                        )}
                                        {topRated.telegram && (
                                            <a href={topRated.telegram} target="_blank" rel="noopener noreferrer" className="contact-item telegram">
                                                <FaTelegramPlane />
                                                <span>Telegram</span>
                                            </a>
                                        )}
                                        {topRated.instagram && (
                                            <a href={topRated.instagram} target="_blank" rel="noopener noreferrer" className="contact-item instagram">
                                                <FaInstagram />
                                                <span>Instagram</span>
                                            </a>
                                        )}
                                    </div>
                                    <Link href={`/restaurants/${topRated.slug}`} className="top-rated-btn">
                                        Подробнее о ресторане
                                        <FaArrowRight />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gold рестораны (премиум) */}
                    {goldRestaurants.length > 0 && (
                        <div className="gold-section">
                            <div className="section-header">
                                <h2>
                                    <FaCrown className="section-icon" />
                                    Gold рестораны
                                </h2>
                                <p>Премиум заведения с лучшим сервисом</p>
                            </div>
                            <div className="gold-grid">
                                {goldRestaurants.map(restaurant => (
                                    <div key={restaurant.id} className="gold-card">
                                        <div className="gold-card-badge">
                                            <FaCrown />
                                            <span>GOLD</span>
                                        </div>
                                        <div className="gold-card-image">
                                            <img
                                                src={getImageUrl(restaurant.images?.[0]?.image || restaurant.logo)}
                                                alt={restaurant.name}
                                            />
                                        </div>
                                        <div className="gold-card-info">
                                            <h3>{restaurant.name}</h3>
                                            <div className="gold-card-stats">
                                                <span className="rating">
                                                    <FaStar /> {restaurant.rating?.toFixed(1) || 'Новый'}
                                                </span>
                                                <span className="price">{restaurant.price_level || '$$'}</span>
                                            </div>
                                            <div className="gold-card-location">
                                                <FaMapMarkerAlt />
                                                <span>{restaurant.address?.split(',')[0] || restaurant.region_label || 'Ташкент'}</span>
                                            </div>
                                            <div className="gold-card-buttons">
                                                <Link href={`/restaurants/${restaurant.slug}`} className="gold-details-btn">
                                                    Подробнее
                                                </Link>
                                                <Link href={`/restaurants/${restaurant.slug}/menu`} className="gold-menu-btn">
                                                    Меню
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Обычные рекомендованные рестораны */}
                    {regularRestaurants.length > 0 && (
                        <div className="regular-section">
                            <div className="section-header">
                                <h2>🍽️ Популярные рестораны</h2>
                                <p>Заведения с высоким рейтингом</p>
                            </div>
                            <div className="regular-grid">
                                {regularRestaurants.map(restaurant => (
                                    <div key={restaurant.id} className="regular-card">
                                        <div className="regular-card-image">
                                            <img
                                                src={getImageUrl(restaurant.images?.[0]?.image || restaurant.logo)}
                                                alt={restaurant.name}
                                            />
                                        </div>
                                        <div className="regular-card-info">
                                            <h3>{restaurant.name}</h3>
                                            <div className="regular-card-stats">
                                                <span className="rating">
                                                    <FaStar /> {restaurant.rating?.toFixed(1) || 'Новый'}
                                                </span>
                                                <span className="price">{restaurant.price_level || '$$'}</span>
                                            </div>
                                            <div className="regular-card-location">
                                                <FaMapMarkerAlt />
                                                <span>{restaurant.address?.split(',')[0] || restaurant.region_label || 'Ташкент'}</span>
                                            </div>
                                            <Link href={`/restaurants/${restaurant.slug}`} className="regular-card-link">
                                                Подробнее →
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Если нет ресторанов вообще */}
                    {recommended.length === 0 && (
                        <div className="empty-state">
                            <FaCrown />
                            <h3>Пока нет рекомендованных ресторанов</h3>
                            <p>Скоро здесь появятся лучшие заведения</p>
                            <Link href="/" className="empty-btn">На главную</Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}
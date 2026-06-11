'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    FaArrowLeft, FaStar, FaMapMarkerAlt, FaUtensils, FaSearch, FaFilter, FaTimes, FaCrown
} from 'react-icons/fa'
import Navbar from '@/app/components/navbar/Navbar'
import Footer from '@/app/components/footer/Footer'
import './city.css'
import '../../styles/gold-card.css'

export default function CityClient({ initialSlug }) {
    const slug = initialSlug

    console.log('🏙️ CityClient - slug:', slug)

    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filters, setFilters] = useState({ cuisine: 'Все', price: 'Все' })
    const [showFilters, setShowFilters] = useState(false)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    const cityNames = {
        'tashkent': 'Ташкент',
        'tashkent_region': 'Ташкентская область',
        'samarkand': 'Самарканд',
        'bukhara': 'Бухара',
        'khiva': 'Хива',
        'fergana': 'Фергана',
        'andijan': 'Андижан',
        'namangan': 'Наманган',
        'kokand': 'Коканд',
        'nukus': 'Нукус',
        'termiz': 'Термез',
        'qarshi': 'Карши',
        'navoi': 'Навои',
        'jizzakh': 'Джизак',
        'gulistan': 'Гулистан',
        'urgench': 'Ургенч'
    }

    const cityName = cityNames[slug] || slug || 'Узбекистане'

    useEffect(() => {
        console.log('🔍 useEffect - slug:', slug)

        if (!slug) {
            console.log('❌ slug пустой, выходим')
            setLoading(false)
            return
        }

        const fetchRestaurants = async () => {
            setLoading(true)
            setError(null)
            try {
                const url = `${API_URL}/api/restaurants/?region=${slug}`
                console.log('📡 Запрос к API:', url)
                const res = await fetch(url)
                console.log('📡 Статус ответа:', res.status)

                if (res.ok) {
                    const data = await res.json()
                    console.log('✅ Получено мест:', data.length)
                    setRestaurants(data)
                } else {
                    const errorText = await res.text()
                    console.error('❌ Ошибка:', errorText)
                    setError(`Ошибка загрузки: ${res.status}`)
                }
            } catch (err) {
                console.error('❌ Error fetching:', err)
                setError('Ошибка соединения с сервером')
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurants()
    }, [slug, API_URL])

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder.jpg'
        if (imagePath.startsWith('http')) return imagePath
        if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
        return `${API_URL}/media/${imagePath}`
    }

    const getPriceLabel = (price) => {
        switch (price) {
            case '$': return 'Эконом'
            case '$$': return 'Средний'
            case '$$$': return 'Высокий'
            case '$$$$': return 'Премиум'
            default: return 'Средний'
        }
    }

    const filteredRestaurants = restaurants.filter(r => {
        const matchesSearch = r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.cuisine_type_label && r.cuisine_type_label.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesCuisine = filters.cuisine === 'Все' || r.cuisine_type_label === filters.cuisine
        const matchesPrice = filters.price === 'Все' || r.price_level === filters.price
        return matchesSearch && matchesCuisine && matchesPrice
    })

    const uniqueCuisines = ['Все', ...new Set(restaurants.map(r => r.cuisine_type_label).filter(Boolean))]
    const priceLevels = ['Все', '$', '$$', '$$$', '$$$$']

    if (loading && slug) {
        return (
            <>
                <Navbar />
                <div className="city-loading">
                    <div className="loading-spinner"></div>
                    <p>Загрузка мест в {cityName}...</p>
                </div>
                <Footer />
            </>
        )
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="city-error">
                    <p>❌ {error}</p>
                    <Link href="/" className="back-link">Вернуться на главную</Link>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="city-page">
                <div className="container">
                    <div className="city-hero">
                        <Link href="/" className="back-link">
                            <FaArrowLeft />
                            <span>На главную</span>
                        </Link>
                        <h1 className="gold-title">Места в {cityName}</h1>
                        <p>{restaurants.length} локаций ждут вас</p>
                    </div>

                    <div className="city-controls">
                        <div className="search-bar">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Поиск по названию или кухне..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="clear-search" onClick={() => setSearchQuery('')}>
                                    <FaTimes />
                                </button>
                            )}
                        </div>

                        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
                            <FaFilter />
                            <span>Фильтры</span>
                        </button>
                    </div>

                    <div className={`filters-panel ${showFilters ? 'open' : ''}`}>
                        <div className="filter-group">
                            <label>Кухня</label>
                            <select value={filters.cuisine} onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}>
                                {uniqueCuisines.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Цена</label>
                            <select value={filters.price} onChange={(e) => setFilters({ ...filters, price: e.target.value })}>
                                {priceLevels.map(p => (
                                    <option key={p} value={p}>
                                        {p === 'Все' ? 'Все цены' : getPriceLabel(p)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="reset-filters" onClick={() => setFilters({ cuisine: 'Все', price: 'Все' })}>
                            Сбросить
                        </button>
                    </div>

                    {filteredRestaurants.length === 0 && !loading ? (
                        <div className="no-results">
                            <FaUtensils />
                            <h3>Ничего не найдено</h3>
                            <p>Попробуйте изменить параметры поиска</p>
                        </div>
                    ) : (
                        <div className="restaurants-grid">
                            {filteredRestaurants.map(restaurant => (
                                <div
                                    key={restaurant.id}
                                    className={`restaurant-card ${restaurant.is_gold ? 'gold-card gold-card-shine' : ''}`}
                                >
                                    {restaurant.is_gold && (
                                        <div className="gold-badge gold-badge-small">
                                            <FaCrown />
                                            <span>GOLD</span>
                                        </div>
                                    )}
                                    <div className="card-image">
                                        <img
                                            src={getImageUrl(restaurant.images?.[0]?.image || restaurant.logo)}
                                            alt={restaurant.name}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="card-info">
                                        <h3>{restaurant.name}</h3>
                                        <div className="card-meta">
                                            <span className="rating gold-rating gold-rating-small">
                                                <FaStar /> {restaurant.rating?.toFixed(1) || 'Новое'}
                                            </span>
                                            <span className="price">{getPriceLabel(restaurant.price_level)}</span>
                                        </div>
                                        <div className="card-cuisine">
                                            <FaUtensils size={12} />
                                            <span>{restaurant.cuisine_type_label || 'Разная кухня'}</span>
                                        </div>
                                        <div className="card-location">
                                            <FaMapMarkerAlt />
                                            <span>{restaurant.region_label || restaurant.address?.split(',')[0] || cityName}</span>
                                        </div>
                                        <Link href={`/restaurants/${restaurant.slug}`} className="card-link">
                                            Подробнее →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
};
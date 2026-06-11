'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiMapPin, FiUsers, FiClock, FiSearch, FiArrowRight, FiStar, FiTrendingUp, FiGlobe, FiMap } from 'react-icons/fi'
import './Hero.css'

export default function Hero({ restaurants }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [cities, setCities] = useState([])
  const [citiesLoading, setCitiesLoading] = useState(true)
  const searchRef = useRef(null)
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const cityNames = {
    'tashkent': 'Ташкент',
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

  useEffect(() => {
    if (searchQuery.length > 1 && restaurants) {
      const suggestions = restaurants.filter(r =>
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.cuisine_type?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
      setSearchSuggestions(suggestions)
    } else {
      setSearchSuggestions([])
    }
  }, [searchQuery, restaurants])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`${API_URL}/api/restaurants/cities/`)
        if (res.ok) {
          const data = await res.json()
          setCities(data)
        }
      } catch (err) {
        console.error('Error fetching cities:', err)
      } finally {
        setCitiesLoading(false)
      }
    }
    fetchCities()
  }, [API_URL])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery) {
      router.push(`/type/restaurants?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSuggestionClick = (slug) => {
    router.push(`/restaurants/${slug}`)
  }

  return (
    <section className="hero-section" id="hero">
      {/* Анимированный фон */}
      <div className="hero-bg-animation">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
      </div>

      <div className="container">
        <div className="hero-badge">
          <FiTrendingUp size={14} />
          <span>Открывайте лучшие места</span>
        </div>

        <h1 className="hero-title">
          Откройте для себя <span className="hero-highlight"> лучшие места</span>
          <br />
          в Узбекистане
        </h1>

        <p className="hero-subtitle">
          Найдите идеальное место для вашего вечера —
          от уютных уголков до премиум-локаций по всему Узбекистану
        </p>

        {/* Обновлённая статистика */}
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <FiGlobe size={22} />
            </div>
            <div className="stat-number">15+</div>
            <div className="stat-label">Городов Узбекистана</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <FiMap size={22} />
            </div>
            <div className="stat-number">100+</div>
            <div className="stat-label">Ресторанов-партнёров</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <FiClock size={22} />
            </div>
            <div className="stat-number">24/7</div>
            <div className="stat-label">Онлайн-бронирование</div>
          </div>
        </div>

        {/* Поиск */}
        <div className="search-wrapper" ref={searchRef}>
          <form onSubmit={handleSearch} className="search-container">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Поиск по названию или кухне..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-button">
              Найти
              <FiArrowRight size={16} />
            </button>
          </form>

          {isSearchFocused && searchSuggestions.length > 0 && (
            <div className="search-suggestions">
              {searchSuggestions.map(r => (
                <div 
                  key={r.id} 
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(r.slug)}
                >
                  <div className="suggestion-icon">🍴</div>
                  <div className="suggestion-info">
                    <strong>{r.name}</strong>
                    <span className="suggestion-cuisine">{r.cuisine_type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Города */}
        <div className="cities-section">
          <div className="section-label">
            <FiMapPin size={14} />
            <span>Популярные города</span>
          </div>
          {citiesLoading ? (
            <div className="cities-loading">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          ) : (
            <div className="cities-grid">
              {cities.slice(0, 12).map(city => (
                <Link
                  key={city.region}
                  href={`/city/${city.region}`}
                  className="city-card"
                >
                  <span className="city-name">{cityNames[city.region] || city.region}</span>
                  <span className="city-count">{city.count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
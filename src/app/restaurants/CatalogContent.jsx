'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaFilter, FaTimes, FaSearch, FaCrown, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import './catalog.css'

export default function CatalogContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [restaurants, setRestaurants] = useState([])
    const [filteredRestaurants, setFilteredRestaurants] = useState([])
    const [filterOptions, setFilterOptions] = useState({
        types: [],
        cuisines: [],
        prices: [],
        features: []
    })
    const [loading, setLoading] = useState(true)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(12)

    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        cuisine: searchParams.get('cuisine') || '',
        type: searchParams.get('type') || '',
        price: searchParams.get('price') || '',
        feature: searchParams.get('feature') || ''
    })

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    // Определение заголовка для hero
    const getHeroTitle = () => {
        if (filters.search) {
            return `Результаты поиска: "${filters.search}"`
        }
        if (filters.type) {
            const typeLabel = filterOptions.types.find(t => t.value === filters.type)?.label
            return `${typeLabel || 'Заведения'} в Узбекистане`
        }
        if (filters.cuisine) {
            const cuisineLabel = filterOptions.cuisines.find(c => c.value === filters.cuisine)?.label
            return `${cuisineLabel || 'Рестораны'} в Узбекистане`
        }
        return 'Рестораны и кафе в Узбекистане'
    }

    // Загружаем рестораны и опции фильтров
    useEffect(() => {
        Promise.all([
            fetch(`${API_URL}/api/restaurants/`).then(res => res.json()),
            fetch(`${API_URL}/api/restaurants/filters/`).then(res => res.json())
        ])
            .then(([restaurantsData, filtersData]) => {
                setRestaurants(restaurantsData)
                setFilterOptions(filtersData)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error:', err)
                setLoading(false)
            })
    }, [API_URL])

    // Применяем фильтры
    useEffect(() => {
        let filtered = [...restaurants]

        if (filters.search) {
            const query = filters.search.toLowerCase()
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(query) ||
                r.cuisine_type?.toLowerCase().includes(query) ||
                (r.additional_cuisines && r.additional_cuisines.toLowerCase().includes(query))
            )
        }

        if (filters.type) {
            filtered = filtered.filter(r => r.establishment_type === filters.type)
        }

        if (filters.cuisine) {
            filtered = filtered.filter(r =>
                r.cuisine_type?.toLowerCase().replace(' ', '_') === filters.cuisine ||
                (r.additional_cuisines && r.additional_cuisines.toLowerCase().includes(filters.cuisine.replace('_', ' ')))
            )
        }

        if (filters.price) {
            filtered = filtered.filter(r => r.price_level === filters.price)
        }

        if (filters.feature) {
            filtered = filtered.filter(r =>
                r.features?.some(f => f.value === filters.feature)
            )
        }

        setFilteredRestaurants(filtered)
        setCurrentPage(1)
    }, [restaurants, filters])

    const updateFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value === filters[key] ? '' : value }
        setFilters(newFilters)

        const params = new URLSearchParams()
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v) params.set(k, v)
        })
        router.push(`/restaurants${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
    }

    const clearFilters = () => {
        setFilters({ search: '', cuisine: '', type: '', price: '', feature: '' })
        router.push('/restaurants', { scroll: false })
        setShowMobileFilters(false)
    }

    const hasActiveFilters = filters.search || filters.cuisine || filters.type || filters.price || filters.feature
    const activeFiltersCount = [filters.search, filters.cuisine, filters.type, filters.price, filters.feature].filter(Boolean).length

    // Пагинация
    const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage)
    const paginatedRestaurants = filteredRestaurants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const goToPage = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Загрузка заведений...</p>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />

            <div className="catalog-page">
                {/* Hero секция */}
                <div className="catalog-hero">
                    <div className="container">
                        <div className="catalog-hero-content">
                            <h1>{getHeroTitle()}</h1>
                            <p>
                                {filteredRestaurants.length} {declension(filteredRestaurants.length, 'заведение', 'заведения', 'заведений')}
                                {filters.search ? ' найдено' : ' доступно'}
                            </p>
                        </div>
                    </div>
                    <div className="catalog-hero-wave">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
                            <path fill="var(--bg-primary)" fillOpacity="1" d="M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,208C672,213,768,203,864,186.7C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                        </svg>
                    </div>
                </div>

                <div className="container">
                    {/* Кнопка фильтров для мобильных */}
                    <div className="mobile-filter-toggle">
                        <button className="filter-toggle-btn" onClick={() => setShowMobileFilters(true)}>
                            <FaFilter />
                            <span>Фильтры</span>
                            {hasActiveFilters && <span className="active-dot">{activeFiltersCount}</span>}
                        </button>
                    </div>

                    <div className="catalog-layout">
                        {/* Десктопные фильтры - боковая панель */}
                        <aside className="filters-sidebar">
                            <div className="filters-header-sidebar">
                                <h3>Фильтры</h3>
                                {hasActiveFilters && (
                                    <button className="clear-filters-sidebar" onClick={clearFilters}>
                                        <FaTimes />
                                        <span>Сбросить</span>
                                    </button>
                                )}
                            </div>

                            {/* Поиск */}
                            <div className="filter-group">
                                <label>🔍 Поиск</label>
                                <div className="search-group-sidebar">
                                    <FaSearch className="search-icon-catalog" />
                                    <input
                                        type="text"
                                        placeholder="Название или кухня..."
                                        value={filters.search}
                                        onChange={(e) => updateFilter('search', e.target.value)}
                                        className="search-input-catalog"
                                    />
                                </div>
                            </div>

                            {/* Тип заведения */}
                            {filterOptions.types.length > 0 && (
                                <div className="filter-group">
                                    <label>📌 Тип места</label>
                                    <div className="filter-chips">
                                        <button className={`filter-chip ${filters.type === '' ? 'active' : ''}`} onClick={() => updateFilter('type', '')}>
                                            Все
                                        </button>
                                        {filterOptions.types.map(option => (
                                            <button key={option.value} className={`filter-chip ${filters.type === option.value ? 'active' : ''}`} onClick={() => updateFilter('type', option.value)}>
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Кухня */}
                            {filterOptions.cuisines.length > 0 && (
                                <div className="filter-group">
                                    <label>🍜 Кухня</label>
                                    <div className="filter-chips">
                                        <button className={`filter-chip ${filters.cuisine === '' ? 'active' : ''}`} onClick={() => updateFilter('cuisine', '')}>
                                            Все
                                        </button>
                                        {filterOptions.cuisines.map(option => (
                                            <button key={option.value} className={`filter-chip ${filters.cuisine === option.value ? 'active' : ''}`} onClick={() => updateFilter('cuisine', option.value)}>
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Цена */}
                            {filterOptions.prices.length > 0 && (
                                <div className="filter-group">
                                    <label>💰 Цена</label>
                                    <div className="filter-chips">
                                        <button className={`filter-chip ${filters.price === '' ? 'active' : ''}`} onClick={() => updateFilter('price', '')}>
                                            Все
                                        </button>
                                        {filterOptions.prices.map(option => (
                                            <button key={option.value} className={`filter-chip ${filters.price === option.value ? 'active' : ''}`} onClick={() => updateFilter('price', option.value)}>
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Особенности */}
                            {filterOptions.features.length > 0 && (
                                <div className="filter-group">
                                    <label>✨ Особенности</label>
                                    <div className="filter-chips">
                                        <button className={`filter-chip ${filters.feature === '' ? 'active' : ''}`} onClick={() => updateFilter('feature', '')}>
                                            Все
                                        </button>
                                        {filterOptions.features.map(option => (
                                            <button key={option.value} className={`filter-chip ${filters.feature === option.value ? 'active' : ''}`} onClick={() => updateFilter('feature', option.value)}>
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>

                        {/* Результаты */}
                        <main className="catalog-main">
                            {paginatedRestaurants.length === 0 ? (
                                <div className="no-results">
                                    <div className="no-results-icon">😕</div>
                                    <h3>Ничего не найдено</h3>
                                    <p>Попробуйте изменить параметры поиска или сбросить фильтры</p>
                                    <button className="reset-btn" onClick={clearFilters}>Сбросить фильтры</button>
                                </div>
                            ) : (
                                <>
                                    <div className="restaurants-grid">
                                        {paginatedRestaurants.map(restaurant => (
                                            <div key={restaurant.id} className={`restaurant-card ${restaurant.is_gold ? 'gold-card' : ''}`}>
                                                {restaurant.is_gold && (
                                                    <div className="gold-badge-card">
                                                        <FaCrown />
                                                        <span>GOLD</span>
                                                    </div>
                                                )}
                                                <Link href={`/restaurants/${restaurant.slug}`} className="card-link-wrapper">
                                                    <div className="card-image-wrapper">
                                                        <img
                                                            src={restaurant.images?.[0]?.image ? `${API_URL}${restaurant.images[0].image}` : '/placeholder.jpg'}
                                                            alt={restaurant.name}
                                                            loading="lazy"
                                                            onError={(e) => e.target.src = '/placeholder.jpg'}
                                                        />
                                                        {restaurant.price_level && (
                                                            <span className="price-badge">{restaurant.price_level}</span>
                                                        )}
                                                    </div>
                                                    <div className="card-content">
                                                        <h3>{restaurant.name}</h3>
                                                        <p className="location-text">{restaurant.region_label}</p>
                                                        <div className="card-tags">
                                                            <span className="cuisine-tag">{restaurant.cuisine_type}</span>
                                                        </div>
                                                        <div className="card-footer">
                                                            <span className="rating">★ {restaurant.rating?.toFixed(1) || 'Новое'}</span>
                                                            <span className="view-link">Подробнее →</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Пагинация */}
                                    {totalPages > 1 && (
                                        <div className="pagination">
                                            <button
                                                className="pagination-btn prev"
                                                onClick={() => goToPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                <FaChevronLeft />
                                                <span>Назад</span>
                                            </button>
                                            <div className="pagination-pages">
                                                {[...Array(totalPages)].map((_, i) => {
                                                    const page = i + 1
                                                    if (totalPages <= 7 || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                                        return (
                                                            <button
                                                                key={page}
                                                                className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                                                                onClick={() => goToPage(page)}
                                                            >
                                                                {page}
                                                            </button>
                                                        )
                                                    }
                                                    if (page === currentPage - 2 || page === currentPage + 2) {
                                                        return <span key={page} className="pagination-dots">...</span>
                                                    }
                                                    return null
                                                })}
                                            </div>
                                            <button
                                                className="pagination-btn next"
                                                onClick={() => goToPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                <span>Вперед</span>
                                                <FaChevronRight />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            {/* Мобильная панель фильтров - полный экран */}
            {showMobileFilters && (
                <div className="mobile-filters-fullscreen">
                    <div className="mobile-filters-header-full">
                        <h3>Фильтры</h3>
                        <div className="mobile-filters-header-actions">
                            {hasActiveFilters && (
                                <button className="mobile-clear-all" onClick={clearFilters}>
                                    Сбросить все
                                </button>
                            )}
                            <button className="mobile-filters-close-full" onClick={() => setShowMobileFilters(false)}>
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                    <div className="mobile-filters-content-full">
                        {/* Поиск */}
                        <div className="filter-group-mobile">
                            <label>🔍 Поиск</label>
                            <input
                                type="text"
                                placeholder="Название или кухня..."
                                value={filters.search}
                                onChange={(e) => updateFilter('search', e.target.value)}
                                className="mobile-search-input"
                            />
                        </div>

                        {/* Тип */}
                        {filterOptions.types.length > 0 && (
                            <div className="filter-group-mobile">
                                <label>📌 Тип места</label>
                                <div className="mobile-filter-chips">
                                    <button className={`mobile-filter-chip ${filters.type === '' ? 'active' : ''}`} onClick={() => updateFilter('type', '')}>
                                        Все
                                    </button>
                                    {filterOptions.types.map(option => (
                                        <button key={option.value} className={`mobile-filter-chip ${filters.type === option.value ? 'active' : ''}`} onClick={() => updateFilter('type', option.value)}>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Кухня */}
                        {filterOptions.cuisines.length > 0 && (
                            <div className="filter-group-mobile">
                                <label>🍜 Кухня</label>
                                <div className="mobile-filter-chips">
                                    <button className={`mobile-filter-chip ${filters.cuisine === '' ? 'active' : ''}`} onClick={() => updateFilter('cuisine', '')}>
                                        Все
                                    </button>
                                    {filterOptions.cuisines.map(option => (
                                        <button key={option.value} className={`mobile-filter-chip ${filters.cuisine === option.value ? 'active' : ''}`} onClick={() => updateFilter('cuisine', option.value)}>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Цена */}
                        {filterOptions.prices.length > 0 && (
                            <div className="filter-group-mobile">
                                <label>💰 Цена</label>
                                <div className="mobile-filter-chips">
                                    <button className={`mobile-filter-chip ${filters.price === '' ? 'active' : ''}`} onClick={() => updateFilter('price', '')}>
                                        Все
                                    </button>
                                    {filterOptions.prices.map(option => (
                                        <button key={option.value} className={`mobile-filter-chip ${filters.price === option.value ? 'active' : ''}`} onClick={() => updateFilter('price', option.value)}>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Особенности */}
                        {filterOptions.features.length > 0 && (
                            <div className="filter-group-mobile">
                                <label>✨ Особенности</label>
                                <div className="mobile-filter-chips">
                                    <button className={`mobile-filter-chip ${filters.feature === '' ? 'active' : ''}`} onClick={() => updateFilter('feature', '')}>
                                        Все
                                    </button>
                                    {filterOptions.features.map(option => (
                                        <button key={option.value} className={`mobile-filter-chip ${filters.feature === option.value ? 'active' : ''}`} onClick={() => updateFilter('feature', option.value)}>
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="mobile-filters-footer-full">
                        <div className="mobile-filters-stats">
                            Найдено: {filteredRestaurants.length} мест
                        </div>
                        <button className="mobile-apply-filters" onClick={() => setShowMobileFilters(false)}>
                            Показать результаты
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </>
    )
}

function declension(num, one, two, five) {
    const n = Math.abs(num) % 100
    const n1 = n % 10
    if (n > 10 && n < 20) return five
    if (n1 > 1 && n1 < 5) return two
    if (n1 === 1) return one
    return five
}
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaSpinner, FaArrowLeft, FaArrowRight, FaSearch, FaUtensils, FaFilter, FaTimes } from 'react-icons/fa'
import TypeHero from '../typeHero/TypeHero'
import TypeFilters from '../typeFilters/TypeFilters'
import TypeRestaurantCard from '../typeRestaurantCard/TypeRestaurantCard'
import TypeTopRestaurants from '../typeTopRestaurants/TypeTopRestaurants'
import Navbar from '../../navbar/Navbar'
import Footer from '../../footer/Footer'
import './TypePageLayout.css'

export default function TypePageLayout({ typeData }) {
    const [restaurants, setRestaurants] = useState([])
    const [filteredRestaurants, setFilteredRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [filters, setFilters] = useState({
        cuisine: 'Все',
        price: 'Все',
        sort: 'rating'
    })

    const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

    useEffect(() => {
        setLoading(true)
        fetch(`${API_URL}/api/restaurants/?type=${typeData.type}`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok')
                return res.json()
            })
            .then(data => {
                setRestaurants(data)
                setFilteredRestaurants(data)
                setLoading(false)
            })
            .catch(err => {
                // console.error('Error:', err)
                setLoading(false)
            })
    }, [typeData.type, API_URL])

    useEffect(() => {
        let filtered = [...restaurants]

        if (filters.cuisine !== 'Все') {
            filtered = filtered.filter(r => r.cuisine_type === filters.cuisine)
        }

        if (filters.price !== 'Все') {
            filtered = filtered.filter(r => r.price_level === filters.price)
        }

        if (filters.sort === 'rating') {
            filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        } else if (filters.sort === 'popular') {
            filtered.sort((a, b) => (b.analytics?.views_count || 0) - (a.analytics?.views_count || 0))
        }

        setFilteredRestaurants(filtered)
        setPage(1)
    }, [restaurants, filters])

    const itemsPerPage = 12
    const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage)
    const paginatedRestaurants = filteredRestaurants.slice((page - 1) * itemsPerPage, page * itemsPerPage)

    const hasActiveFilters = filters.cuisine !== 'Все' || filters.price !== 'Все' || filters.sort !== 'rating'

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading-spinner">
                    <FaSpinner className="spinner-icon" />
                    <span>Загрузка мест...</span>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="type-page">
                <TypeHero typeData={typeData} count={filteredRestaurants.length} />

                <div className="container">
                    <div className="type-content">
                        {/* Десктопные фильтры */}
                        <div className="desktop-filters-wrapper">
                            <TypeFilters filters={filters} setFilters={setFilters} />
                        </div>

                        {/* Кнопка фильтров для мобильных */}
                        <div className="mobile-filter-toggle-type">
                            <button className="filter-toggle-btn-type" onClick={() => setShowMobileFilters(true)}>
                                <FaFilter />
                                <span>Фильтры</span>
                                {hasActiveFilters && <span className="active-dot-type" />}
                            </button>
                        </div>

                        <div className="type-results">
                            <TypeTopRestaurants type={typeData.type} />

                            <div className="results-header">
                                <h2>
                                    <FaUtensils className="header-icon" />
                                    {typeData.plural} в Узбекистане
                                </h2>
                                <p>
                                    <FaSearch className="search-icon" />
                                    Найдено {filteredRestaurants.length} мест
                                </p>
                            </div>

                            {filteredRestaurants.length === 0 ? (
                                <div className="no-results">
                                    <div className="no-results-icon">😕</div>
                                    <p>К сожалению, {typeData.name.toLowerCase()} не найдены</p>
                                    <p className="no-results-hint">Попробуйте изменить параметры фильтрации</p>
                                    <Link href="/" className="back-link">Вернуться на главную</Link>
                                </div>
                            ) : (
                                <>
                                    <div className="restaurants-grid">
                                        {paginatedRestaurants.map(restaurant => (
                                            <TypeRestaurantCard key={restaurant.id} restaurant={restaurant} />
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="pagination">
                                            <button
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                disabled={page === 1}
                                                className="pagination-btn"
                                            >
                                                <FaArrowLeft /> Назад
                                            </button>
                                            <div className="pagination-info">
                                                <span className="page-current">{page}</span>
                                                <span className="page-separator">/</span>
                                                <span className="page-total">{totalPages}</span>
                                            </div>
                                            <button
                                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                                disabled={page === totalPages}
                                                className="pagination-btn"
                                            >
                                                Вперед <FaArrowRight />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Мобильная панель фильтров - полный экран */}
                    {showMobileFilters && (
                        <div className="mobile-filters-fullscreen">
                            <div className="mobile-filters-header-full">
                                <h3>Фильтры</h3>
                                <button className="mobile-filters-close-full" onClick={() => setShowMobileFilters(false)}>
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="mobile-filters-content-full">
                                <TypeFilters filters={filters} setFilters={setFilters} isMobile={true} />
                            </div>
                            <div className="mobile-filters-footer-full">
                                <button className="clear-filters-full" onClick={() => {
                                    setFilters({ cuisine: 'Все', price: 'Все', sort: 'rating' })
                                }}>
                                    Сбросить все
                                </button>
                                <button className="apply-filters-full" onClick={() => setShowMobileFilters(false)}>
                                    Показать {filteredRestaurants.length} мест
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SEO контент */}
                    {typeData.longDescription && (
                        <div className="type-seo-content" dangerouslySetInnerHTML={{ __html: typeData.longDescription }} />
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
};
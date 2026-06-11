'use client'
import { useState, useEffect } from 'react'
import { FiFilter, FiX, FiChevronDown, FiDollarSign, FiStar, FiTrendingUp, FiRefreshCw } from 'react-icons/fi'
import { GiKnifeFork, GiTakeMyMoney } from 'react-icons/gi'
import './TypeFilters.css'

export default function TypeFilters({ filters, setFilters }) {
    const [cuisineOptions, setCuisineOptions] = useState(['Все'])
    const [priceOptions] = useState(['Все', '$', '$$', '$$$', '$$$$'])
    const [showMobileModal, setShowMobileModal] = useState(false)
    const [activeFiltersCount, setActiveFiltersCount] = useState(0)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    useEffect(() => {
        fetch(`${API_URL}/api/restaurants/filters/`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok')
                return res.json()
            })
            .then(data => {
                const cuisines = ['Все', ...data.cuisines.map(c => c.label)]
                setCuisineOptions(cuisines)
            })
            .catch(err => console.error('Error fetching cuisines:', err))
    }, [API_URL])

    // Подсчет активных фильтров
    useEffect(() => {
        let count = 0
        if (filters.cuisine !== 'Все') count++
        if (filters.price !== 'Все') count++
        if (filters.sort !== 'rating') count++
        setActiveFiltersCount(count)
    }, [filters])

    const resetFilters = () => {
        setFilters({ cuisine: 'Все', price: 'Все', sort: 'rating' })
        setShowMobileModal(false)
    }

    const getPriceLabel = (price) => {
        switch (price) {
            case '$': return 'Эконом'
            case '$$': return 'Средние'
            case '$$$': return 'Высокие'
            case '$$$$': return 'Премиум'
            default: return 'Все цены'
        }
    }

    const getPriceIcon = (price) => {
        switch (price) {
            case '$': return '💰'
            case '$$': return '💰💰'
            case '$$$': return '💰💰💰'
            case '$$$$': return '💰💰💰💰'
            default: return <FiDollarSign />
        }
    }

    const applyFilters = () => {
        setShowMobileModal(false)
    }

    return (
        <>
            {/* Мобильная кнопка открытия фильтров */}
            <button className="mobile-filters-toggle" onClick={() => setShowMobileModal(true)}>
                <FiFilter />
                <span>Фильтры</span>
                {activeFiltersCount > 0 && (
                    <span className="filters-count">{activeFiltersCount}</span>
                )}
            </button>

            {/* Десктопная боковая панель */}
            <aside className="type-filters-desktop">
                <div className="filters-header">
                    <h3>
                        <FiFilter className="header-icon" />
                        Фильтры
                        {activeFiltersCount > 0 && (
                            <span className="active-filters-badge">{activeFiltersCount}</span>
                        )}
                    </h3>
                </div>

                <div className="filter-group">
                    <label>
                        <GiKnifeFork className="label-icon" />
                        Кухня
                    </label>
                    <div className="custom-select">
                        <select
                            value={filters.cuisine}
                            onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
                        >
                            {cuisineOptions.map(c => (
                                <option key={c} value={c}>
                                    {c === 'Все' ? '🍽️ Все кухни' : `🍜 ${c}`}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown className="select-icon" />
                    </div>
                </div>

                <div className="filter-group">
                    <label>
                        <GiTakeMyMoney className="label-icon" />
                        Цена
                    </label>
                    <div className="custom-select">
                        <select
                            value={filters.price}
                            onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                        >
                            {priceOptions.map(p => (
                                <option key={p} value={p}>
                                    {p === 'Все' ? '💰 Все цены' : `${getPriceIcon(p)} ${getPriceLabel(p)}`}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown className="select-icon" />
                    </div>
                </div>

                <div className="filter-group">
                    <label>
                        {filters.sort === 'rating' ? <FiStar className="label-icon" /> : <FiTrendingUp className="label-icon" />}
                        Сортировка
                    </label>
                    <div className="sort-buttons">
                        <button
                            className={`sort-btn ${filters.sort === 'rating' ? 'active' : ''}`}
                            onClick={() => setFilters({ ...filters, sort: 'rating' })}
                        >
                            <FiStar />
                            <span>По рейтингу</span>
                        </button>
                        <button
                            className={`sort-btn ${filters.sort === 'popular' ? 'active' : ''}`}
                            onClick={() => setFilters({ ...filters, sort: 'popular' })}
                        >
                            <FiTrendingUp />
                            <span>По популярности</span>
                        </button>
                    </div>
                </div>

                <button className="reset-filters" onClick={resetFilters}>
                    <FiRefreshCw className="reset-icon" />
                    Сбросить фильтры
                    {activeFiltersCount > 0 && (
                        <span className="reset-count">({activeFiltersCount})</span>
                    )}
                </button>
            </aside>

            {/* Мобильная модалка на весь экран */}
            {showMobileModal && (
                <div className="mobile-filters-modal">
                    <div className="mobile-filters-header">
                        <h3>Фильтры</h3>
                        <button className="mobile-filters-close" onClick={() => setShowMobileModal(false)}>
                            <FiX />
                        </button>
                    </div>

                    <div className="mobile-filters-content">
                        {/* Кухня */}
                        <div className="mobile-filter-group">
                            <label>🍜 Кухня</label>
                            <div className="mobile-filter-chips">
                                {cuisineOptions.map(c => (
                                    <button
                                        key={c}
                                        className={`mobile-filter-chip ${filters.cuisine === c ? 'active' : ''}`}
                                        onClick={() => setFilters({ ...filters, cuisine: c })}
                                    >
                                        {c === 'Все' ? 'Все' : c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Цена */}
                        <div className="mobile-filter-group">
                            <label>💰 Цена</label>
                            <div className="mobile-filter-chips">
                                {priceOptions.map(p => (
                                    <button
                                        key={p}
                                        className={`mobile-filter-chip ${filters.price === p ? 'active' : ''}`}
                                        onClick={() => setFilters({ ...filters, price: p })}
                                    >
                                        {p === 'Все' ? 'Все цены' : getPriceLabel(p)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Сортировка */}
                        <div className="mobile-filter-group">
                            <label>📊 Сортировка</label>
                            <div className="mobile-sort-buttons">
                                <button
                                    className={`mobile-sort-btn ${filters.sort === 'rating' ? 'active' : ''}`}
                                    onClick={() => setFilters({ ...filters, sort: 'rating' })}
                                >
                                    <FiStar />
                                    <span>По рейтингу</span>
                                </button>
                                <button
                                    className={`mobile-sort-btn ${filters.sort === 'popular' ? 'active' : ''}`}
                                    onClick={() => setFilters({ ...filters, sort: 'popular' })}
                                >
                                    <FiTrendingUp />
                                    <span>По популярности</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mobile-filters-footer">
                        <button className="mobile-reset-btn" onClick={resetFilters}>
                            <FiRefreshCw />
                            <span>Сбросить</span>
                        </button>
                        <button className="mobile-apply-btn" onClick={applyFilters}>
                            Применить
                            {activeFiltersCount > 0 && (
                                <span className="apply-count">{activeFiltersCount}</span>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
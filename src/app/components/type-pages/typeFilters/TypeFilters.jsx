'use client'
import { useState, useEffect } from 'react'
import { FiFilter, FiStar, FiTrendingUp } from 'react-icons/fi'
import './TypeFilters.css'

export default function TypeFilters({ filters, setFilters }) {
    const [cuisineOptions, setCuisineOptions] = useState(['Все'])
    const [priceOptions] = useState(['Все', '$', '$$', '$$$', '$$$$'])
    const [showFilters, setShowFilters] = useState(false)
    const [activeFiltersCount, setActiveFiltersCount] = useState(0)

    const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

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
            // .catch(err => // console.error('Error fetching cuisines:', err))
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
        setShowFilters(false)
    }

    const getPriceLabel = (price) => {
        switch (price) {
            case '$': return 'Эконом'
            case '$$': return 'Средний'
            case '$$$': return 'Высокий'
            case '$$$$': return 'Премиум'
            default: return 'Все цены'
        }
    }

    return (
        <>
            {/* Кнопка фильтров как в CityClient */}
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
                <FiFilter />
                <span>Фильтры</span>
                {activeFiltersCount > 0 && (
                    <span className="filters-count">{activeFiltersCount}</span>
                )}
            </button>

            {/* Панель фильтров - как в CityClient */}
            <div className={`filters-panel ${showFilters ? 'open' : ''}`}>
                <div className="filter-group">
                    <label>Кухня</label>
                    <select 
                        value={filters.cuisine} 
                        onChange={(e) => setFilters({ ...filters, cuisine: e.target.value })}
                    >
                        {cuisineOptions.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Цена</label>
                    <select 
                        value={filters.price} 
                        onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                    >
                        {priceOptions.map(p => (
                            <option key={p} value={p}>
                                {p === 'Все' ? 'Все цены' : getPriceLabel(p)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Сортировка</label>
                    <div className="sort-buttons">
                        <button
                            className={`sort-btn ${filters.sort === 'rating' ? 'active' : ''}`}
                            onClick={() => setFilters({ ...filters, sort: 'rating' })}
                        >
                            <FiStar />
                            <span>Рейтинг</span>
                        </button>
                        <button
                            className={`sort-btn ${filters.sort === 'popular' ? 'active' : ''}`}
                            onClick={() => setFilters({ ...filters, sort: 'popular' })}
                        >
                            <FiTrendingUp />
                            <span>Популярные</span>
                        </button>
                    </div>
                </div>

                <button className="reset-filters" onClick={resetFilters}>
                    Сбросить
                </button>
            </div>
        </>
    )
}
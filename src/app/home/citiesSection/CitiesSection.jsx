'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaBuilding, FaArrowRight } from 'react-icons/fa'
import './CitiesSection.css'

export default function CitiesSection() {
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(true)

    const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'

    // Словарь для отображения названий городов на русском
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
        const fetchCities = async () => {
            try {
                const res = await fetch(`${API_URL}/api/restaurants/cities/`)
                if (res.ok) {
                    const data = await res.json()
                    // console.log('Города с ресторанами:', data)
                    setCities(data)
                }
            } catch (err) {
                //  console.error('Error fetching cities:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchCities()
    }, [API_URL])

    if (loading) {
        return (
            <section className="cities-section">
                <div className="container">
                    <div className="cities-loading">
                        <div className="loading-spinner"></div>
                    </div>
                </div>
            </section>
        )
    }

    if (cities.length === 0) return null

    return (
        <section className="cities-section">
            <div className="container">
                <div className="cities-header">
                    <h2>🏙️ Рестораны по городам</h2>
                    <p>Выберите город и найдите лучшие заведения рядом с вами</p>
                </div>
                <div className="cities-grid">
                    {cities.map(city => (
                        <Link
                            key={city.region}
                            href={`/city/${city.region}`}
                            className="city-card"
                        >
                            <div className="city-icon">
                                <FaBuilding />
                            </div>
                            <div className="city-info">
                                <h3>{cityNames[city.region] || city.region}</h3>
                                <p>{city.count} заведений</p>
                            </div>
                            <FaArrowRight className="city-arrow" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
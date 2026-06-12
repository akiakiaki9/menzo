'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import './NearbyRestaurants.css'

export default function NearbyRestaurants() {
  const [nearbyRestaurants, setNearbyRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setLocation(coords)
          fetchNearbyRestaurants(coords.lat, coords.lng)
        },
        (error) => {
          console.error("Ошибка геолокации:", error)
          setLocationError("Не удалось определить ваше местоположение")
          setLoading(false)
        }
      )
    } else {
      setLocationError("Ваш браузер не поддерживает геолокацию")
      setLoading(false)
    }
  }, [])

  const fetchNearbyRestaurants = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.menzo.uz/api/restaurants/nearby/?lat=${lat}&lng=${lng}&radius=5`
      )
      const data = await response.json()
      setNearbyRestaurants(data)
      setLoading(false)
    } catch (error) {
      console.error("Ошибка загрузки ресторанов:", error)
      setLoading(false)
    }
  }

  const getDistanceText = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} м`
    }
    return `${distance.toFixed(1)} км`
  }

  if (loading) {
    return (
      <section className="nearby-section">
        <div className="container">
          <h2 className="section-title">📍 Ближайшие рестораны</h2>
          <div className="nearby-loading">
            <div className="spinner"></div>
            <p>Определяем ваше местоположение...</p>
          </div>
        </div>
      </section>
    )
  }

  if (locationError) {
    return (
      <section className="nearby-section">
        <div className="container">
          <h2 className="section-title">📍 Ближайшие рестораны</h2>
          <div className="nearby-error">
            <p>⚠️ {locationError}</p>
            <Link href="/map" className="view-all-link">Смотреть все рестораны на карте →</Link>
          </div>
        </div>
      </section>
    )
  }

  if (nearbyRestaurants.length === 0) {
    return (
      <section className="nearby-section">
        <div className="container">
          <h2 className="section-title">📍 Ближайшие рестораны</h2>
          <div className="nearby-empty">
            <p>😕 Рядом с вами нет ресторанов</p>
            <Link href="/map" className="view-all-link">Смотреть все рестораны на карте →</Link>
          </div>
        </div>
      </section>
    )
  }

  const displayRestaurants = showAll ? nearbyRestaurants : nearbyRestaurants.slice(0, 4)

  return (
    <section className="nearby-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">📍 Ближайшие рестораны</h2>
          <Link href="/map" className="view-all-link">Все рестораны →</Link>
        </div>

        <div className="nearby-grid">
          {displayRestaurants.map(restaurant => (
            <Link key={restaurant.id} href={`/restaurants/${restaurant.slug}`} className="nearby-card">
              <div className="nearby-card-image">
                <img
                  src={restaurant.image ? `http://localhost:8000${restaurant.image}` : '/placeholder.jpg'}
                  alt={restaurant.name}
                />
                <span className="nearby-distance">{getDistanceText(restaurant.distance)}</span>
              </div>
              <div className="nearby-card-content">
                <h3>{restaurant.name}</h3>
                <p className="nearby-cuisine">{restaurant.cuisine}</p>
                <div className="nearby-meta">
                  <span className="price">{restaurant.price_level}</span>
                  <span className="rating">★ {restaurant.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {nearbyRestaurants.length > 4 && !showAll && (
          <div className="nearby-show-more">
            <button onClick={() => setShowAll(true)} className="show-more-btn">
              Показать все ({nearbyRestaurants.length})
            </button>
          </div>
        )}
      </div>
    </section>
  )
};
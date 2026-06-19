'use client'
import { useState, useEffect } from 'react'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import Hero from './home/hero/Hero'
import PopularRestaurants from './home/popularRestaurants/PopularRestaurants'
import TopAndNearby from './home/topAndNearby/TopAndNearby'
import RecommendedRestaurants from './home/recommended/RecommendedRestaurants'

export default function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Принудительно обновляем данные при каждом посещении
    const fetchData = async () => {
      try {
        // Добавляем timestamp для обхода кэша
        const timestamp = new Date().getTime()
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/restaurants/?_=${timestamp}`
        )
        const data = await response.json()
        const sorted = [...data].sort((a, b) => b.rating - a.rating).slice(0, 6)
        setRestaurants(sorted)
        setLoading(false)
      } catch (err) {
        console.error('Error:', err)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Добавляем мета-теги для предотвращения кэширования
  useEffect(() => {
    // Добавляем meta теги для контроля кэша
    const metaCacheControl = document.createElement('meta')
    metaCacheControl.httpEquiv = 'Cache-Control'
    metaCacheControl.content = 'no-cache, no-store, must-revalidate'
    document.head.appendChild(metaCacheControl)

    const metaPragma = document.createElement('meta')
    metaPragma.httpEquiv = 'Pragma'
    metaPragma.content = 'no-cache'
    document.head.appendChild(metaPragma)

    const metaExpires = document.createElement('meta')
    metaExpires.httpEquiv = 'Expires'
    metaExpires.content = '0'
    document.head.appendChild(metaExpires)

    return () => {
      // Очищаем мета-теги при размонтировании
      document.head.removeChild(metaCacheControl)
      document.head.removeChild(metaPragma)
      document.head.removeChild(metaExpires)
    }
  }, [])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-logo">MENZO</div>
            <div className="loading-spinner-wrapper">
              <div className="loading-spinner"></div>
              <div className="loading-spinner-ring"></div>
            </div>
            <div className="loading-text">
              <span>Открываем</span>
              <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
            <div className="loading-progress">
              <div className="loading-progress-bar"></div>
            </div>
            <p className="loading-subtitle">Лучшие места Узбекистана</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <Hero restaurants={restaurants} />
      <RecommendedRestaurants />
      <TopAndNearby />
      <PopularRestaurants restaurants={restaurants} />
      <Footer />
    </>
  )
}
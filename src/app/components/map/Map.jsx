'use client'
import { useEffect, useRef, useState } from 'react'
import { FaCrosshairs, FaPlus, FaMinus, FaTimes, FaInfoCircle, FaMapMarkerAlt, FaExpand, FaCompress, FaStar, FaLocationArrow } from 'react-icons/fa'
import { GiKnifeFork } from 'react-icons/gi'
import 'leaflet/dist/leaflet.css'
import './Map.css'

export default function Map({ restaurants = [], userLocation = null }) {
  const mapRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const userMarkerRef = useRef(null)
  const radiusCircleRef = useRef(null)
  const markersRef = useRef({})
  const [showHint, setShowHint] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [locationStatus, setLocationStatus] = useState('idle')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const priceColors = {
    '$': '#2ecc71',
    '$$': '#f39c12',
    '$$$': '#e67e22',
    '$$$$': '#e74c3c'
  }

  const priceLabels = {
    '$': 'Эконом',
    '$$': 'Средний',
    '$$$': 'Высокий',
    '$$$$': 'Премиум'
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
    return `${API_URL}/media/${imagePath}`
  }

  const toggleFullscreen = () => {
    const mapElement = document.querySelector('.map-wrapper')
    if (!mapElement) return
    if (!isFullscreen) {
      mapElement.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Инициализация карты - ИСПРАВЛЕННЫЙ СЛОЙ
  useEffect(() => {
    if (mapRef.current) return

    import('leaflet').then(L => {
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const center = userLocation?.lat && userLocation?.lng 
        ? [userLocation.lat, userLocation.lng] 
        : [41.311081, 69.279562]
      const zoom = userLocation ? 13 : 12

      const mapInstance = L.map('map').setView(center, zoom)

      // ИСПРАВЛЕНО: Используем стандартный OpenStreetMap с полной детализацией
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 3
      }).addTo(mapInstance)

      mapRef.current = mapInstance
      setMapLoaded(true)
    })
  }, [])

  // Маркер пользователя
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return
    if (!userLocation?.lat || !userLocation?.lng) return

    import('leaflet').then(L => {
      if (userMarkerRef.current) mapRef.current.removeLayer(userMarkerRef.current)
      if (radiusCircleRef.current) mapRef.current.removeLayer(radiusCircleRef.current)

      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div class="user-marker-dot"></div><div class="user-marker-pulse"></div><div class="user-marker-ring"></div>`,
        iconSize: [24, 24],
        popupAnchor: [0, -12]
      })

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup('<div class="user-popup"><strong>📍 Вы здесь</strong><p>Ваше текущее местоположение</p></div>')

      radiusCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
        radius: 5000,
        weight: 2,
        dashArray: '5, 10'
      }).addTo(mapRef.current)

      setLocationStatus('success')
    })
  }, [userLocation, mapLoaded])

  // Маркеры ресторанов
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return
    if (!restaurants?.length) return

    import('leaflet').then(L => {
      Object.values(markersRef.current).forEach(marker => {
        if (marker) mapRef.current.removeLayer(marker)
      })
      markersRef.current = {}

      const bounds = []

      restaurants.forEach(restaurant => {
        if (!restaurant?.latitude || !restaurant?.longitude) return

        const isGold = restaurant.is_gold || false
        const color = isGold ? '#fbbf24' : (priceColors[restaurant.price_level] || '#3498db')
        const logoUrl = getImageUrl(restaurant.logo || restaurant.images?.[0]?.image)

        const markerHtml = `
          <div class="restaurant-marker-wrapper">
            <div class="restaurant-marker ${isGold ? 'gold-marker' : ''}" style="border-color: ${color};">
              <div class="marker-logo-wrapper">
                ${logoUrl 
                  ? `<img src="${logoUrl}" alt="${restaurant.name}" class="marker-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">`
                  : ''
                }
                <div class="marker-fallback" style="display: ${logoUrl ? 'none' : 'flex'}; background: ${color}">
                  <span class="marker-price">${restaurant.price_level || '$$'}</span>
                </div>
              </div>
              ${isGold ? '<div class="marker-gold-glow"></div>' : ''}
            </div>
            <div class="marker-label" style="background: ${color}cc;">
              <span>${restaurant.name.length > 20 ? restaurant.name.substring(0, 18) + '...' : restaurant.name}</span>
            </div>
          </div>
        `

        const icon = L.divIcon({
          className: 'custom-marker',
          html: markerHtml,
          iconSize: [48, 64],
          popupAnchor: [0, -32]
        })

        const popupContent = `
          <div class="restaurant-popup ${isGold ? 'gold-popup' : ''}">
            <div class="popup-image">
              <img src="${getImageUrl(restaurant.images?.[0]?.image || restaurant.image) || '/placeholder.jpg'}" 
                   alt="${restaurant.name}" 
                   onerror="this.src='/placeholder.jpg'">
              ${isGold ? '<div class="popup-gold-label">✨ PREMIUM</div>' : ''}
            </div>
            <div class="popup-info">
              <h4>${restaurant.name}</h4>
              <p class="popup-cuisine">${restaurant.cuisine_type_label || restaurant.cuisine_type || 'Разная кухня'}</p>
              <div class="popup-meta">
                <span class="popup-price" style="color: ${color}">${restaurant.price_level || '$$'} ${priceLabels[restaurant.price_level] || ''}</span>
                <span class="popup-rating">⭐ ${restaurant.rating?.toFixed(1) || 'Новый'}</span>
              </div>
              <div class="popup-buttons">
                <button class="popup-details-btn" data-slug="${restaurant.slug}">Подробнее</button>
                <button class="popup-directions-btn" data-lat="${restaurant.latitude}" data-lng="${restaurant.longitude}">🗺️ Маршрут</button>
              </div>
            </div>
          </div>
        `

        const marker = L.marker([restaurant.latitude, restaurant.longitude], { icon })
          .addTo(mapRef.current)
          .bindPopup(popupContent, { maxWidth: 320, minWidth: 280 })

        marker.on('popupopen', () => {
          setTimeout(() => {
            const detailsBtn = document.querySelector(`.popup-details-btn[data-slug="${restaurant.slug}"]`)
            const directionsBtn = document.querySelector(`.popup-directions-btn[data-lat="${restaurant.latitude}"][data-lng="${restaurant.longitude}"]`)
            detailsBtn?.addEventListener('click', () => window.location.href = `/restaurants/${restaurant.slug}`)
            directionsBtn?.addEventListener('click', () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${restaurant.latitude},${restaurant.longitude}`, '_blank'))
          }, 50)
        })

        markersRef.current[restaurant.id] = marker
        bounds.push([restaurant.latitude, restaurant.longitude])
      })

      if (bounds.length && !userLocation?.lat) {
        mapRef.current.fitBounds(L.featureGroup(bounds.map(b => L.marker(b))).getBounds().pad(0.1))
      }
    })
  }, [restaurants, mapLoaded, userLocation])

  const zoomIn = () => mapRef.current?.zoomIn()
  const zoomOut = () => mapRef.current?.zoomOut()

  const locateUser = () => {
    if (!userLocation?.lat || !userLocation?.lng) {
      setLocationStatus('loading')
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = { lat: position.coords.latitude, lng: position.coords.longitude }
            if (mapRef.current) {
              mapRef.current.setView([coords.lat, coords.lng], 15)
            }
            setLocationStatus('success')
            setTimeout(() => setLocationStatus('idle'), 2000)
          },
          (error) => {
            console.error('Geolocation error:', error)
            setLocationStatus('error')
            setTimeout(() => setLocationStatus('idle'), 3000)
          }
        )
      } else {
        setLocationStatus('error')
        setTimeout(() => setLocationStatus('idle'), 3000)
      }
      return
    }
    
    mapRef.current?.setView([userLocation.lat, userLocation.lng], 15)
    const btn = document.querySelector('.locate-btn')
    if (btn) {
      btn.classList.add('locate-pulse')
      setTimeout(() => btn.classList.remove('locate-pulse'), 500)
    }
  }

  return (
    <div className={`map-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
      <div id="map" className="map"></div>

      {showHint && (
        <div className="map-hint">
          <div className="hint-content">
            <FaInfoCircle className="hint-icon" />
            <span>Цвет обводки — уровень цен</span>
            <span className="gold-hint">⭐ Золотая обводка — PREMIUM</span>
            <button className="hint-close" onClick={() => setShowHint(false)}><FaTimes /></button>
          </div>
        </div>
      )}

      <div className="map-controls">
        <div className="zoom-controls">
          <button onClick={zoomIn} className="control-btn" title="Приблизить"><FaPlus /></button>
          <button onClick={zoomOut} className="control-btn" title="Отдалить"><FaMinus /></button>
        </div>
        
        <button 
          onClick={locateUser} 
          className={`control-btn locate-btn ${locationStatus === 'loading' ? 'loading' : ''} ${locationStatus === 'success' ? 'success' : ''} ${locationStatus === 'error' ? 'error' : ''}`} 
          title="Моё местоположение"
        >
          <FaLocationArrow />
          <span>
            {locationStatus === 'loading' ? 'Определение...' : 
             locationStatus === 'success' ? 'Готово!' : 
             locationStatus === 'error' ? 'Ошибка' : 'Моя позиция'}
          </span>
        </button>
        
        <button onClick={toggleFullscreen} className="control-btn fullscreen-btn" title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Развернуть на весь экран'}>
          {isFullscreen ? <FaCompress /> : <FaExpand />}
          <span>{isFullscreen ? 'Свернуть' : 'На весь экран'}</span>
        </button>
      </div>

      <div className="map-legend">
        <div className="legend-title"><FaMapMarkerAlt /> Цены</div>
        {Object.entries(priceColors).map(([price, color]) => (
          <div key={price} className="legend-item">
            <span className="legend-dot" style={{ background: color }}></span>
            <span className="legend-price">{price}</span>
            <span className="legend-label">{priceLabels[price]}</span>
          </div>
        ))}
        <div className="legend-divider"></div>
        <div className="legend-item gold">
          <span className="legend-dot gold-dot"></span>
          <span className="legend-price">⭐</span>
          <span className="legend-label">Premium GOLD</span>
        </div>
        <div className="legend-divider"></div>
        <div className="legend-user">
          <div className="user-dot"></div>
          <span>Вы здесь</span>
        </div>
      </div>

      {restaurants.length > 0 && (
        <div className="map-stats">
          <GiKnifeFork />
          <span>{restaurants.length} заведений</span>
        </div>
      )}
    </div>
  )
}
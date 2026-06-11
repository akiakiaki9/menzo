'use client'
import { useState, useEffect } from 'react'
import { FaMapMarkedAlt, FaDirections, FaLocationArrow, FaExternalLinkAlt, FaCopy, FaCheck, FaTaxi } from 'react-icons/fa'
import './Map.css'

export default function Map({ latitude, longitude, address, name, isGold = false }) {
  const [copied, setCopied] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [taxiLoading, setTaxiLoading] = useState(false)

  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
  const directionsUrl = `https://maps.google.com/?q=${latitude},${longitude}`
  const yandexMapUrl = `https://yandex.uz/maps/?ll=${longitude},${latitude}&z=15&pt=${longitude},${latitude}&mode=routes`

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Ошибка копирования:', err)
    }
  }

  const openInApp = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)

    if (isIOS) {
      window.location.href = `http://maps.apple.com/?q=${latitude},${longitude}`
    } else if (isAndroid) {
      window.location.href = `https://maps.google.com/?q=${latitude},${longitude}`
    } else {
      window.open(directionsUrl, '_blank')
    }
  }

  const handleYandexTaxi = () => {
    setTaxiLoading(true)
    const fullAddress = address || name || 'Ресторан'
    const deeplink = `yandextaxi://route/?end-lat=${latitude}&end-lon=${longitude}&end-address=${encodeURIComponent(fullAddress)}`
    const fallbackUrl = `https://taxi.yandex.uz/?rto=${latitude},${longitude}&text=${encodeURIComponent(fullAddress)}`

    window.location.href = deeplink
    setTimeout(() => {
      window.location.href = fallbackUrl
      setTaxiLoading(false)
    }, 500)
  }

  useEffect(() => {
    const iframe = document.createElement('iframe')
    iframe.src = mapUrl
    iframe.onerror = () => setLoadError(true)
  }, [])

  if (!latitude || !longitude) return null

  return (
    <div className={`map-section ${isGold ? 'gold-map' : ''}`}>
      {isGold && (
        <div className="map-gold-badge">
          <span>📍 PREMIUM ЛОКАЦИЯ</span>
        </div>
      )}
      
      <div className="map-header">
        <div className="map-title">
          <div className="map-title-icon">
            <FaMapMarkedAlt />
          </div>
          <h3>Как добраться</h3>
        </div>
        {address && (
          <div className="map-address-copy">
            <button onClick={copyAddress} className="map-copy-btn">
              {copied ? (
                <>
                  <FaCheck />
                  <span>Скопировано</span>
                </>
              ) : (
                <>
                  <FaCopy />
                  <span>Скопировать адрес</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="map-container">
        {!loadError ? (
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Карта ${name || 'места'}`}
            onError={() => setLoadError(true)}
          />
        ) : (
          <div className="map-fallback">
            <FaMapMarkedAlt />
            <p>Не удалось загрузить карту</p>
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
              Открыть в Google Maps
            </a>
          </div>
        )}
      </div>

      {address && (
        <div className="map-address-info">
          <FaLocationArrow className="map-address-icon" />
          <span className="map-address-text">{address}</span>
        </div>
      )}

      <div className="map-actions">

        <button onClick={openInApp} className="map-btn map-navigate-btn">
          <FaLocationArrow />
          <span>Открыть в навигаторе</span>
        </button>

        <button 
          onClick={handleYandexTaxi} 
          className={`map-btn map-taxi-btn ${taxiLoading ? 'loading' : ''}`}
          disabled={taxiLoading}
        >
          <FaTaxi />
          <span>{taxiLoading ? 'Загрузка...' : 'Яндекс Такси'}</span>
        </button>

        <a
          href={yandexMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="map-btn map-yandex-btn"
        >
          <span className="yandex-icon">Я</span>
          <span>Яндекс Карты</span>
        </a>
      </div>

      <div className="map-note">
        <span>📱 Нажмите "Яндекс Такси" для вызова такси до этого места</span>
      </div>
    </div>
  )
}
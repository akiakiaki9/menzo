'use client'
import { useState, useEffect } from 'react'
import { FaTimes, FaChevronLeft, FaChevronRight, FaImages, FaExpand, FaCrown } from 'react-icons/fa'
import './Gallery.css'

export default function Gallery({ images, isGold = false }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  if (!images || images.length === 0) return null

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.jpg'
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
    return `${API_URL}/media/${imagePath}`
  }

  const openModal = (index) => {
    setSelectedImage(index)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = ''
  }

  const nextImage = () => {
    setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)
  }

  const prevImage = () => {
    setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const diff = touchStart - touchEnd
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage()
      else prevImage()
    }
    setTouchStart(0)
    setTouchEnd(0)
  }

  const displayedImages = images.slice(0, 6)
  const remainingCount = images.length - 6

  return (
    <div className={`gallery-section ${isGold ? 'gold-gallery' : ''}`}>
      {isGold && (
        <div className="gallery-gold-badge">
          <FaCrown />
          <span>PREMIUM</span>
        </div>
      )}

      <div className="gallery-header">
        <div className="gallery-title">
          <div className="gallery-title-icon">
            <FaImages />
          </div>
          <h3>Фотогалерея</h3>
        </div>
        <div className="gallery-stats">
          <span>{images.length} {declension(images.length, 'фото', 'фото', 'фото')}</span>
        </div>
      </div>

      <div className="gallery-grid">
        {displayedImages.map((img, idx) => (
          <div
            key={idx}
            className="gallery-grid-item"
            onClick={() => openModal(idx)}
          >
            <img
              src={getImageUrl(img.image)}
              alt={`Фото ${idx + 1}`}
              loading="lazy"
              onError={(e) => {
                e.target.src = '/placeholder.jpg'
              }}
            />
            <div className="gallery-grid-overlay">
              <FaExpand className="gallery-expand-icon" />
            </div>
          </div>
        ))}

        {remainingCount > 0 && (
          <div
            className="gallery-grid-item gallery-more-item"
            onClick={() => openModal(5)}
          >
            <img
              src={getImageUrl(images[5].image)}
              alt="Еще фото"
              loading="lazy"
            />
            <div className="gallery-more-overlay">
              <span>+{remainingCount}</span>
              <FaImages />
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className={`gallery-modal ${isGold ? 'gold-modal' : ''}`} onClick={closeModal}>
          <div className="gallery-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="gallery-modal-header">
              <button className="gallery-modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div
              className="gallery-modal-image-container"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={getImageUrl(images[selectedImage].image)}
                alt={`Фото ${selectedImage + 1}`}
                className="gallery-modal-image"
              />
            </div>

            <button className="gallery-modal-prev" onClick={prevImage}>
              <FaChevronLeft />
            </button>
            <button className="gallery-modal-next" onClick={nextImage}>
              <FaChevronRight />
            </button>

            <div className="gallery-modal-footer">
              <div className="gallery-modal-counter">
                {selectedImage + 1}/{images.length}
              </div>
              <div className="gallery-modal-thumbnails">
                {images.slice(0, 8).map((img, idx) => (
                  <div
                    key={idx}
                    className={`gallery-thumbnail ${selectedImage === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={getImageUrl(img.image)} alt={`Мин ${idx + 1}`} />
                  </div>
                ))}
                {images.length > 8 && (
                  <div className="gallery-thumbnail gallery-more-thumb">
                    <span>+{images.length - 8}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function declension(num, one, two, five) {
  const n = Math.abs(num) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) return five
  if (n1 > 1 && n1 < 5) return two
  if (n1 === 1) return one
  return five
};
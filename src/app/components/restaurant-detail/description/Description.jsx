import { useState } from 'react'
import { FaBookOpen, FaChevronDown, FaChevronUp, FaQuoteLeft, FaCrown } from 'react-icons/fa'
import './Description.css'

export default function Description({ description, isGold = false }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!description) return null

  // Определяем, нужно ли обрезать текст
  const shouldTruncate = description.length > 500
  const displayText = shouldTruncate && !isExpanded
    ? description.substring(0, 500) + '...'
    : description

  // Функция для форматирования текста (разбивка на абзацы)
  const formatDescription = (text) => {
    if (!text) return null

    // Разбиваем текст на абзацы по переносам строк
    const paragraphs = text.split(/\n+/)

    return paragraphs.map((paragraph, index) => {
      // Проверяем, является ли абзац списком
      if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('•')) {
        const items = paragraph.split(/\n/).filter(line => line.trim())
        return (
          <ul key={index} className="description-list">
            {items.map((item, i) => (
              <li key={i}>
                <span className="description-list-marker">•</span>
                {item.replace(/^[-•]\s*/, '')}
              </li>
            ))}
          </ul>
        )
      }

      return <p key={index} className="description-paragraph">{paragraph}</p>
    })
  }

  return (
    <div className={`description-section ${isGold ? 'gold-description' : ''}`}>
      {isGold && (
        <div className="description-gold-badge">
          <FaCrown />
          <span>PREMIUM</span>
        </div>
      )}
      
      <div className="description-header">
        <div className="description-header-icon">
          <FaBookOpen />
        </div>
        <h3 className={isGold ? 'gold-title' : ''}>О месте</h3>
      </div>

      <div className="description-content">
        <FaQuoteLeft className="description-quote-icon" />
        <div className="description-text-wrapper">
          {formatDescription(displayText)}
        </div>
      </div>

      {shouldTruncate && (
        <button
          className={`description-expand-btn ${isGold ? 'gold-expand-btn' : ''}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <FaChevronUp />
              <span>Свернуть</span>
            </>
          ) : (
            <>
              <FaChevronDown />
              <span>Читать полностью</span>
            </>
          )}
        </button>
      )}

      <div className="description-footer">
        <div className="description-footer-stats">
          <span className="description-stat">
            <FaBookOpen />
            {description.split(/\s+/).length} слов
          </span>
          <span className="description-stat">
            ~{Math.ceil(description.length / 15)} сек. чтения
          </span>
        </div>
      </div>
    </div>
  )
}
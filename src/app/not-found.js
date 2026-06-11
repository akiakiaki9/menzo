'use client'
import Link from 'next/link'
import { FaHome, FaSearch } from 'react-icons/fa'
import './styles/not-found.css'

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        {/* Анимированный фон */}
        <div className="not-found-bg">
          <div className="gradient-sphere sphere-1"></div>
          <div className="gradient-sphere sphere-2"></div>
          <div className="gradient-sphere sphere-3"></div>
        </div>

        <div className="not-found-content">
          <div className="not-found-code">
            <span className="code-digit">4</span>
            <span className="code-icon">🍽️</span>
            <span className="code-digit">4</span>
          </div>

          <h1 className="not-found-title">Страница не найдена</h1>

          <p className="not-found-description">
            К сожалению, страница, которую вы ищете, не существует или была перемещена.
          </p>

          <div className="not-found-buttons">
            <Link href="/" className="btn-primary">
              <FaHome />
              <span>На главную</span>
            </Link>
            <Link href="/#" className="btn-secondary">
              <FaSearch />
              <span>Каталог мест</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
};
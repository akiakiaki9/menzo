"use client"
import Link from 'next/link'
import Image from 'next/image'
import { FaInstagram, FaTelegramPlane, FaFacebook, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaArrowUp } from 'react-icons/fa'
import './footer.css'

export default function Footer() {

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <img
                src="/images/menzo-bg.PNG"
                alt="MENZO.UZ Logo"
                className="footer-logo-image"
              />
            </div>
            <p className="footer-description">
              Откройте для себя лучшие места Узбекистана —
              от уютных кофеен до изысканных ресторанов.
              Ваш персональный гид по гастрономической карте страны.
            </p>
            <div className="footer-social">
              <a href="https://www.instagram.com/menzo_app" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://t.me/menzo_uzof" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <FaTelegramPlane />
              </a>
              <a href="https://www.facebook.com/share/1CXwgYjPTp/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Навигация</h4>
            <ul className="footer-links">
              <li><Link href="/">Главная</Link></li>
              <li><Link href="/#hero">Поиск мест</Link></li>
              <li><Link href="/map">Интерактивная карта</Link></li>
              <li><Link href="/about">О нас</Link></li>
              <li><Link href="/contacts">Наши контакты</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Популярные города</h4>
            <ul className="footer-links">
              <li><Link href="/city/bukhara">Бухара</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Свяжитесь с нами</h4>
            <ul className="footer-contacts">
              <li>
                <FaPhone />
                <a href="tel:+998500953331">+998 50 095-33-31</a>
              </li>
              <li>
                <FaEnvelope />
                <a href="mailto:menzo.uzof@gmail.com">menzo.uzof@gmail.com</a>
              </li>
              <li>
                <FaMapMarkerAlt />
                <span>Бухара, Узбекистан</span>
              </li>
            </ul>
            <div className="footer-hours">
              <FaClock />
              <div className="hours-info">
                <span>Поддержка:</span>
                <strong>Ежедневно с 10:00</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {new Date().getFullYear()} MENZO.UZ —
              Вдохновляя на открытия
            </p>
            <div className="footer-legal">
              <Link href="/privacy">Конфиденциальность</Link>
              <span className="separator">•</span>
              <Link href="/terms">Условия использования</Link>
            </div>
          </div>
        </div>
      </div>

      <button onClick={scrollToTop} className="scroll-top" aria-label="Наверх">
        <FaArrowUp />
      </button>
    </footer>
  )
}
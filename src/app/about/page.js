import { FaBullseye, FaUtensils, FaStar, FaCalendarAlt, FaMapMarkedAlt, FaSearch, FaHandshake, FaHeadset, FaRocket, FaHeart, FaShieldAlt, FaGlobe, FaStore } from 'react-icons/fa'
import { GiKnifeFork } from 'react-icons/gi'
import './about.css'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import { IoMdRestaurant } from "react-icons/io";

export const metadata = {
  title: 'О нас | MENZO.UZ',
  description: 'MENZO.UZ — сервис поиска и бронирования ресторанов по всему Узбекистану. Мы помогаем найти идеальное место для любого случая.',
  keywords: 'о нас, сервис бронирования, рестораны Узбекистана, MENZO',
  alternates: {
    canonical: 'https://menzo.uz/about'
  }
}

export default function AboutPage() {
  const features = [
    { icon: <FaUtensils />, title: 'Актуальные меню', desc: 'Всегда свежие цены и предложения' },
    { icon: <FaStar />, title: 'Честные отзывы', desc: 'Реальные оценки посетителей' },
    { icon: <FaCalendarAlt />, title: 'Бронирование онлайн', desc: 'Бронируйте столики в пару кликов' },
    { icon: <FaMapMarkedAlt />, title: 'Карта заведений', desc: 'Удобный поиск на карте' },
    { icon: <FaSearch />, title: 'Умный поиск', desc: 'Точная фильтрация под ваш запрос' },
    { icon: <FaShieldAlt />, title: 'Проверенные места', desc: 'Только качественные заведения' }
  ]

  // Обновлённая статистика (реалистичная для нового проекта)
  const stats = [
    { number: '15+', label: 'Городов Узбекистана', icon: <FaGlobe />, color: '#e67e22' },
    { number: '100+', label: 'Ресторанов-партнёров', icon: <IoMdRestaurant />, color: '#f39c12' },
    { number: '24/7', label: 'Онлайн-бронирование', icon: <FaCalendarAlt />, color: '#2ecc71' },
    { number: '100%', label: 'Бесплатный сервис', icon: <FaHeart />, color: '#e74c3c' }
  ]

  const team = [
    { icon: <GiKnifeFork />, title: 'Команда разработки', desc: 'Создаём удобный сервис для вас', bgColor: '#e67e22' },
    { icon: <FaHandshake />, title: 'Отдел партнёрства', desc: 'Сотрудничаем с лучшими заведениями', bgColor: '#f39c12' },
    { icon: <FaHeadset />, title: 'Служба поддержки', desc: 'Всегда готовы помочь вам 24/7', bgColor: '#2ecc71' }
  ]

  return (
    <>
      <Navbar />

      <div className="about-page">
        <div className="container">
          {/* Hero секция */}
          <div className="about-hero">
            <div className="about-hero-badge">
              <FaRocket />
              <span>Добро пожаловать в MENZO.UZ</span>
            </div>
            <h1>
              <span className="hero-highlight">О нас</span>
            </h1>
            <p>
              MENZO.UZ — сервис поиска и бронирования ресторанов по всему Узбекистану.
              Мы помогаем находить идеальные места для любых случаев
            </p>
          </div>

          {/* Миссия */}
          <div className="about-mission">
            <div className="mission-content">
              <div className="mission-icon">
                <FaBullseye />
              </div>
              <h2>Наша миссия</h2>
              <p>
                Мы создали MENZO.UZ, чтобы помочь вам находить лучшие заведения для любых случаев —
                от быстрого перекуса до торжественных мероприятий. Наша платформа объединяет проверенные
                рестораны, кафе и другие заведения по всему Узбекистану.
              </p>
            </div>
          </div>

          {/* Что мы предлагаем */}
          <div className="about-features">
            <div className="section-header">
              <h2>Что мы предлагаем</h2>
              <p>Все необходимое для выбора идеального места</p>
            </div>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Статистика - ОБНОВЛЁННАЯ */}
          <div className="about-stats">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Почему выбирают нас */}
          <div className="about-why">
            <div className="section-header">
              <h2>Почему выбирают нас</h2>
              <p>Наши преимущества, которые ценят клиенты</p>
            </div>
            <div className="why-grid">
              <div className="why-item">
                <div className="why-icon">✅</div>
                <h3>Проверенные заведения</h3>
                <p>Мы сотрудничаем только с проверенными ресторанами и кафе, гарантируя качество обслуживания</p>
              </div>
              <div className="why-item">
                <div className="why-icon">🔄</div>
                <h3>Актуальная информация</h3>
                <p>Регулярно обновляем меню, цены и часы работы заведений-партнёров</p>
              </div>
              <div className="why-item">
                <div className="why-icon">💬</div>
                <h3>Честные отзывы</h3>
                <p>Собираем реальные отзывы от посетителей, без фейков и накруток</p>
              </div>
              <div className="why-item">
                <div className="why-icon">🎯</div>
                <h3>Простой выбор</h3>
                <p>Делаем выбор ресторана быстрым, удобным и приятным для каждого</p>
              </div>
            </div>
          </div>

          {/* Наша команда */}
          <div className="about-team">
            <div className="section-header">
              <h2>Наша команда</h2>
              <p>Профессионалы, которые заботятся о вашем комфорте</p>
            </div>
            <div className="team-grid">
              {team.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-icon" style={{ background: member.bgColor }}>
                    {member.icon}
                  </div>
                  <h3>{member.title}</h3>
                  <p>{member.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA секция */}
          <div className="about-cta">
            <div className="cta-content">
              <FaHeart className="cta-icon" />
              <h3>Готовы найти своё идеальное место?</h3>
              <p>Начните прямо сейчас — это бесплатно и просто</p>
              <div className="cta-buttons">
                <a href="/restaurants" className="cta-primary">Найти заведение</a>
                <a href="/contacts" className="cta-secondary">Связаться с нами</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
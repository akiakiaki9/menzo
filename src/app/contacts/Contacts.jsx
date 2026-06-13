'use client'
import { useState } from 'react'
import { FaPhone, FaEnvelope, FaTelegramPlane, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaClock, FaBuilding, FaHeadset } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import './contacts.css'

export default function ContactsClient() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        // console.log('Форма отправлена:', formData)
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 5000)
        setFormData({ name: '', email: '', message: '' })
        setLoading(false)
    }

    const contactMethods = [
        {
            icon: <FaPhone />,
            title: 'Телефон',
            details: ['+998 50 095-33-31'],
            note: 'Пн-Вс: с 10:00',
            color: '#2ecc71',
            action: 'tel:+998500953331'
        },
        {
            icon: <FaEnvelope />,
            title: 'Email',
            details: ['menzo.uzof@gmail.com'],
            note: 'Ответ в течение 24 часов',
            color: '#e74c3c',
            action: 'mailto:menzo.uzof@gmail.com'
        },
        {
            icon: <FaTelegramPlane />,
            title: 'Telegram',
            details: ['@akbarsoftowner', '@menzo_uzof'],
            note: 'Быстрая поддержка',
            color: '#0088cc',
            action: 'https://t.me/menzo_uzof'
        },
        {
            icon: <FaMapMarkerAlt />,
            title: 'Офис',
            details: ['г. Бухара'],
            note: 'Узбекистан',
            color: '#e67e22',
            action: 'https://maps.google.com/?q=39.7682591,64.456865'
        }
    ]

    return (
        <div className="contacts-page">
            <div className="container">
                <div className="contacts-hero">
                    <div className="hero-badge">
                        <FaHeadset />
                        <span>Свяжитесь с нами</span>
                    </div>
                    <h1>Мы всегда на связи</h1>
                    <p>Оставьте сообщение или свяжитесь удобным для вас способом</p>
                </div>

                <div className="contacts-grid">
                    <div className="contacts-info">
                        {contactMethods.map((method, index) => (
                            <a
                                key={index}
                                href={method.action}
                                className="info-card"
                                target={method.action.startsWith('http') ? '_blank' : '_self'}
                                rel={method.action.startsWith('http') ? 'noopener noreferrer' : ''}
                            >
                                <div className="info-icon" style={{ background: `${method.color}20`, color: method.color }}>
                                    {method.icon}
                                </div>
                                <h3>{method.title}</h3>
                                {method.details.map((detail, i) => (
                                    <p key={i} className="info-detail">{detail}</p>
                                ))}
                                <p className="info-note">{method.note}</p>
                                <div className="info-arrow">→</div>
                            </a>
                        ))}
                    </div>

                    <div className="contacts-form">
                        <div className="form-header">
                            <HiOutlineMail className="form-icon" />
                            <h2>Написать нам</h2>
                            <p>Заполните форму и мы ответим в ближайшее время</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Ваше имя *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Иван Иванов"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="ivan@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label>Сообщение *</label>
                                <textarea
                                    rows="4"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Опишите ваш вопрос или предложение..."
                                />
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    <>
                                        <FaPaperPlane />
                                        Отправить
                                    </>
                                )}
                            </button>

                            {submitted && (
                                <div className="success-message">
                                    <FaCheckCircle />
                                    <span>Спасибо! Мы свяжемся с вами.</span>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {/* <div className="contacts-map">
                    <div className="map-header">
                        <FaMapMarkerAlt className="map-icon" />
                        <h2>Наш офис на карте</h2>
                    </div>
                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24492.31688647007!2d64.40939527633285!3d39.768161541091565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3115060e65993cd5%3A0xc87beac80e48e767!2z0JHRg9GF0LDRgNCw!5e0!3m2!1sru!2s!4v1700000000000!5m2!1sru!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            title="Карта Бухары"
                        />
                    </div>
                    <div className="map-address">
                        <FaBuilding />
                        <span>г. Бухара</span>
                        <a href="https://maps.google.com/?q=39.7682591,64.456865" target="_blank" rel="noopener noreferrer">
                            Маршрут →
                        </a>
                    </div>
                </div> */}

                <div className="contacts-hours">
                    <div className="hours-card">
                        <FaClock className="hours-icon" />
                        <div>
                            <h3>Часы работы поддержки</h3>
                            <div className="hours-list">
                                <span>Пн-Вс:</span>
                                <strong>10:00 - 23:00</strong>
                            </div>
                            <div className="hours-list">
                                <span>Сб:</span>
                                <strong>10:00 - 18:00</strong>
                            </div>
                            <div className="hours-list">
                                <span>Вс:</span>
                                <strong>10:00 - 16:00</strong>
                            </div>
                        </div>
                    </div>

                    <div className="hours-card">
                        <FaTelegramPlane className="hours-icon" />
                        <div>
                            <h3>Телеграм поддержка</h3>
                            <p>Работаем каждый день</p>
                            <a href="https://t.me/akbarsoftowner" target="_blank" rel="noopener noreferrer" className="bot-link">
                                @akbarsoftowner
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
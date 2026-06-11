import Link from 'next/link'
import { FaShieldAlt, FaUserSecret, FaCookie, FaDatabase, FaEnvelope, FaUserLock } from 'react-icons/fa'
import '../styles/legal.css'

export const metadata = {
    title: 'Политика конфиденциальности | MENZO.UZ',
    description: 'Политика обработки персональных данных на сайте MENZO.UZ. Как мы собираем, используем и защищаем ваши данные.',
    keywords: 'политика конфиденциальности, персональные данные, защита данных, MENZO.UZ',
    robots: 'index, follow',
}

export default function PrivacyPage() {
    return (
        <div className="legal-page">
            <div className="container">
                {/* Hero секция */}
                <div className="legal-hero">
                    <div className="legal-hero-icon">
                        <FaShieldAlt />
                    </div>
                    <h1>Политика конфиденциальности</h1>
                    <p>Мы ценим ваше доверие и защищаем ваши персональные данные</p>
                    <div className="legal-updated">
                        <span>📅 Последнее обновление: 6 июня 2026 г.</span>
                    </div>
                </div>

                <div className="legal-content">
                    <div className="legal-grid">
                        {/* Содержание */}
                        <div className="legal-sidebar">
                            <div className="sidebar-title">Содержание</div>
                            <ul className="sidebar-nav">
                                <li><a href="#general">1. Общие положения</a></li>
                                <li><a href="#data-collection">2. Какие данные мы собираем</a></li>
                                <li><a href="#data-usage">3. Как мы используем ваши данные</a></li>
                                <li><a href="#data-protection">4. Защита данных</a></li>
                                <li><a href="#cookies">5. Файлы cookie</a></li>
                                <li><a href="#third-party">6. Передача данных третьим лицам</a></li>
                                <li><a href="#user-rights">7. Ваши права</a></li>
                                <li><a href="#contact">8. Контактная информация</a></li>
                            </ul>
                        </div>

                        {/* Основной контент */}
                        <div className="legal-main">
                            <section id="general" className="legal-section">
                                <h2>1. Общие положения</h2>
                                <p>Настоящая Политика конфиденциальности (далее — «Политика») регулирует порядок обработки и защиты персональных данных пользователей сайта MENZO.UZ (далее — «Сайт»).</p>
                                <p>Используя наш Сайт, вы даете согласие на сбор и обработку ваших персональных данных в соответствии с настоящей Политикой.</p>
                                <div className="info-box">
                                    <FaUserLock />
                                    <span>Мы гарантируем конфиденциальность ваших данных и не передаем их третьим лицам без вашего согласия.</span>
                                </div>
                            </section>

                            <section id="data-collection" className="legal-section">
                                <h2><FaDatabase /> 2. Какие данные мы собираем</h2>
                                <p>При использовании нашего Сайта мы можем собирать следующие данные:</p>
                                <ul>
                                    <li><strong>Контактная информация:</strong> имя, номер телефона, адрес электронной почты.</li>
                                    <li><strong>Данные бронирования:</strong> дата, время, количество гостей, комментарии к заказу.</li>
                                    <li><strong>Технические данные:</strong> IP-адрес, тип браузера, устройство, время посещения.</li>
                                    <li><strong>Cookie:</strong> файлы для улучшения работы сайта.</li>
                                </ul>
                            </section>

                            <section id="data-usage" className="legal-section">
                                <h2>3. Как мы используем ваши данные</h2>
                                <div className="usage-grid">
                                    <div className="usage-card">
                                        <FaEnvelope />
                                        <h4>Обработка бронирований</h4>
                                        <p>Для подтверждения и обработки ваших бронирований в ресторанах</p>
                                    </div>
                                    <div className="usage-card">
                                        <FaUserSecret />
                                        <h4>Улучшение сервиса</h4>
                                        <p>Для анализа и улучшения работы сайта</p>
                                    </div>
                                    <div className="usage-card">
                                        <FaCookie />
                                        <h4>Персонализация</h4>
                                        <p>Для предоставления релевантного контента</p>
                                    </div>
                                </div>
                            </section>

                            <section id="data-protection" className="legal-section">
                                <h2>4. Защита данных</h2>
                                <p>Мы принимаем все необходимые организационные и технические меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
                                <ul>
                                    <li>✅ Использование HTTPS-протокола для шифрования данных</li>
                                    <li>✅ Регулярное обновление систем безопасности</li>
                                    <li>✅ Ограничение доступа к данным сотрудников</li>
                                    <li>✅ Резервное копирование данных</li>
                                </ul>
                            </section>

                            <section id="cookies" className="legal-section">
                                <h2>5. Файлы cookie</h2>
                                <p>Наш Сайт использует файлы cookie для улучшения работы и анализа трафика. Вы можете отключить cookie в настройках вашего браузера, однако это может повлиять на функциональность сайта.</p>
                                <div className="cookie-types">
                                    <div className="cookie-type">
                                        <span className="cookie-badge necessary">Необходимые</span>
                                        <p>Для базовой работы сайта</p>
                                    </div>
                                    <div className="cookie-type">
                                        <span className="cookie-badge functional">Функциональные</span>
                                        <p>Для улучшения пользовательского опыта</p>
                                    </div>
                                    <div className="cookie-type">
                                        <span className="cookie-badge analytics">Аналитические</span>
                                        <p>Для сбора статистики посещений</p>
                                    </div>
                                </div>
                            </section>

                            <section id="third-party" className="legal-section">
                                <h2>6. Передача данных третьим лицам</h2>
                                <p>Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Республики Узбекистан, или когда это необходимо для выполнения вашего запроса (например, передача данных ресторану для подтверждения бронирования).</p>
                            </section>

                            <section id="user-rights" className="legal-section">
                                <h2>7. Ваши права</h2>
                                <p>Вы имеете право:</p>
                                <ul>
                                    <li>🔹 Получить информацию о том, какие данные о вас хранятся</li>
                                    <li>🔹 Требовать исправления неточных данных</li>
                                    <li>🔹 Требовать удаления ваших данных</li>
                                    <li>🔹 Отозвать согласие на обработку данных</li>
                                </ul>
                                <div className="info-box">
                                    <span>Для реализации ваших прав свяжитесь с нами по электронной почте: <strong>privacy@menzo.uz</strong></span>
                                </div>
                            </section>

                            <section id="contact" className="legal-section">
                                <h2>8. Контактная информация</h2>
                                <p>По всем вопросам, связанным с обработкой персональных данных, вы можете связаться с нами:</p>
                                <div className="contact-info-box">
                                    <p>📧 Email: <a href="mailto:privacy@menzo.uz">privacy@menzo.uz</a></p>
                                    <p>📞 Телефон: <a href="tel:+998711234567">+998 71 123-45-67</a></p>
                                    <p>📍 Адрес: г. Ташкент, Узбекистан</p>
                                </div>
                            </section>

                            <div className="legal-footer-note">
                                <p>© {new Date().getFullYear()} MENZO.UZ. Все права защищены.</p>
                                <div className="footer-links">
                                    <Link href="/privacy">Политика конфиденциальности</Link>
                                    <Link href="/terms">Условия использования</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
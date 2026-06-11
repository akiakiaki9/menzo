import Link from 'next/link'
import { FaGavel, FaFileContract, FaUserCheck, FaCreditCard, FaBan, FaBalanceScale } from 'react-icons/fa'
import '../styles/legal.css'

export const metadata = {
    title: 'Условия использования | MENZO.UZ',
    description: 'Условия использования сервиса MENZO.UZ. Правила бронирования, оплаты и ответственности.',
    keywords: 'условия использования, пользовательское соглашение, бронирование, MENZO.UZ',
    robots: 'index, follow',
}

export default function TermsPage() {
    return (
        <div className="legal-page">
            <div className="container">
                {/* Hero секция */}
                <div className="legal-hero">
                    <div className="legal-hero-icon">
                        <FaGavel />
                    </div>
                    <h1>Условия использования</h1>
                    <p>Пожалуйста, внимательно ознакомьтесь с условиями перед использованием сервиса</p>
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
                                <li><a href="#acceptance">1. Принятие условий</a></li>
                                <li><a href="#services">2. Описание услуг</a></li>
                                <li><a href="#booking">3. Правила бронирования</a></li>
                                <li><a href="#user-obligations">4. Обязанности пользователя</a></li>
                                <li><a href="#payment">5. Оплата и отмена</a></li>
                                <li><a href="#liability">6. Ответственность</a></li>
                                <li><a href="#intellectual">7. Интеллектуальная собственность</a></li>
                                <li><a href="#changes">8. Изменение условий</a></li>
                                <li><a href="#contact-terms">9. Контакты</a></li>
                            </ul>
                        </div>

                        {/* Основной контент */}
                        <div className="legal-main">
                            <section id="acceptance" className="legal-section">
                                <h2>1. Принятие условий</h2>
                                <p>Используя сайт MENZO.UZ (далее — «Сервис»), вы подтверждаете, что ознакомились с настоящими Условиями использования и соглашаетесь с ними. Если вы не согласны с условиями, пожалуйста, прекратите использование Сервиса.</p>
                                <div className="info-box">
                                    <FaFileContract />
                                    <span>Настоящие Условия являются юридически обязывающим соглашением между вами и MENZO.UZ.</span>
                                </div>
                            </section>

                            <section id="services" className="legal-section">
                                <h2>2. Описание услуг</h2>
                                <p>MENZO.UZ предоставляет следующие услуги:</p>
                                <ul>
                                    <li>🔹 Поиск и фильтрация ресторанов и кафе</li>
                                    <li>🔹 Просмотр меню и цен</li>
                                    <li>🔹 Онлайн-бронирование столиков</li>
                                    <li>🔹 Просмотр отзывов и рейтингов</li>
                                    <li>🔹 Оформление заказов на доставку (при наличии)</li>
                                </ul>
                            </section>

                            <section id="booking" className="legal-section">
                                <h2>3. Правила бронирования</h2>
                                <div className="booking-rules">
                                    <div className="rule-item">
                                        <span className="rule-number">3.1</span>
                                        <p>Бронирование считается подтвержденным после получения уведомления на указанный номер телефона.</p>
                                    </div>
                                    <div className="rule-item">
                                        <span className="rule-number">3.2</span>
                                        <p>Отмена бронирования возможна не позднее чем за 2 часа до времени бронирования.</p>
                                    </div>
                                    <div className="rule-item">
                                        <span className="rule-number">3.3</span>
                                        <p>При опоздании более чем на 20 минут ресторан имеет право отменить бронирование.</p>
                                    </div>
                                    <div className="rule-item">
                                        <span className="rule-number">3.4</span>
                                        <p>MENZO.UZ не несет ответственности за отмену бронирования со стороны ресторана.</p>
                                    </div>
                                </div>
                            </section>

                            <section id="user-obligations" className="legal-section">
                                <h2><FaUserCheck /> 4. Обязанности пользователя</h2>
                                <p>При использовании Сервиса вы обязуетесь:</p>
                                <ul>
                                    <li>✓ Предоставлять достоверную информацию при бронировании</li>
                                    <li>✓ Не нарушать законодательство Республики Узбекистан</li>
                                    <li>✓ Не использовать Сервис для спама и мошенничества</li>
                                    <li>✓ Уважать права других пользователей и ресторанов</li>
                                    <li>✓ Не пытаться взломать или нарушить работу Сервиса</li>
                                </ul>
                                <div className="warning-box">
                                    <FaBan />
                                    <span>Нарушение этих обязательств может привести к блокировке вашего доступа к Сервису.</span>
                                </div>
                            </section>

                            <section id="payment" className="legal-section">
                                <h2><FaCreditCard /> 5. Оплата и отмена</h2>
                                <p>Оплата услуг производится непосредственно ресторану, если иное не указано на Сайте. MENZO.UZ не взимает комиссию за бронирование.</p>
                                <p>В случае отмены бронирования позднее установленного срока, ресторан имеет право применить штрафные санкции в соответствии со своими правилами.</p>
                            </section>

                            <section id="liability" className="legal-section">
                                <h2><FaBalanceScale /> 6. Ответственность</h2>
                                <p>MENZO.UZ не несет ответственности за:</p>
                                <ul>
                                    <li>🔸 Качество блюд и обслуживания в ресторанах</li>
                                    <li>🔸 Изменение цен и меню ресторанами</li>
                                    <li>🔸 Технические сбои и перерывы в работе Сервиса</li>
                                    <li>🔸 Действия третьих лиц</li>
                                </ul>
                                <p>Информация о ресторанах предоставляется на основе данных, полученных от ресторанов-партнеров.</p>
                            </section>

                            <section id="intellectual" className="legal-section">
                                <h2>7. Интеллектуальная собственность</h2>
                                <p>Все материалы, размещенные на Сайте (дизайн, логотипы, тексты, графика), являются собственностью MENZO.UZ и защищены авторским правом. Запрещается копирование, распространение и использование материалов без письменного разрешения.</p>
                            </section>

                            <section id="changes" className="legal-section">
                                <h2>8. Изменение условий</h2>
                                <p>MENZO.UZ оставляет за собой право вносить изменения в настоящие Условия использования в любое время без предварительного уведомления. Изменения вступают в силу с момента публикации на Сайте.</p>
                                <p>Рекомендуем периодически проверять эту страницу для ознакомления с актуальной версией Условий.</p>
                            </section>

                            <section id="contact-terms" className="legal-section">
                                <h2>9. Контактная информация</h2>
                                <p>По всем вопросам, связанным с Условиями использования, вы можете связаться с нами:</p>
                                <div className="contact-info-box">
                                    <p>📧 Email: <a href="mailto:legal@menzo.uz">legal@menzo.uz</a></p>
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
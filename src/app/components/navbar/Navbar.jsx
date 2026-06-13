'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FiMenu, FiX, FiChevronDown, FiMapPin, FiHome, FiInfo, FiMail } from 'react-icons/fi'
import { FaCrown, FaUtensils, FaCoffee, FaHamburger, FaGlassCheers, FaMugHot, FaLeaf, FaBreadSlice, FaStore } from 'react-icons/fa'
import './navbar.css'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Блокировка скролла при открытом мобильном меню
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.width = '100%'
            document.body.style.top = `-${window.scrollY}px`
        } else {
            const scrollY = document.body.style.top
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.width = ''
            document.body.style.top = ''
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1)
            }
        }
        return () => {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.width = ''
            document.body.style.top = ''
        }
    }, [isMenuOpen])

    const closeMenu = () => {
        setIsMenuOpen(false)
        setIsDropdownOpen(false)
    }

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container">
                    <Link href="/" className="logo" onClick={closeMenu}>
                        <img 
                            src="/images/logo.PNG" 
                            alt="MENZO.UZ Logo"
                            className="logo-image"
                            priority
                        />
                    </Link>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Меню"
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>

                    {/* Десктопное меню */}
                    <div className="nav-links-desktop">
                        <Link href="/">Главная</Link>

                        <div className="nav-dropdown">
                            <button className="dropdown-btn">
                                Заведения
                                <FiChevronDown className="dropdown-icon" />
                            </button>
                            <div className="dropdown-content">
                                <Link href="/type/restaurants">Рестораны</Link>
                                <Link href="/type/cafes">Кафе</Link>
                                <Link href="/type/fast-food">Фастфуд</Link>
                                <Link href="/type/restobars">Рестобары</Link>
                                <Link href="/type/coffeehouses">Кофейни</Link>
                                <Link href="/type/teahouses">Чайханы</Link>
                                <Link href="/type/bakeries">Пекарни</Link>
                                <Link href="/type/canteens">Столовые</Link>
                            </div>
                        </div>

                        <Link href="/recommended" className="nav-link-gold">Рекомендуемые</Link>
                        <Link href="/map">Карта</Link>
                        <Link href="/about">О нас</Link>
                        <Link href="/contacts">Контакты</Link>
                    </div>
                </div>
            </nav>

            {/* Мобильное меню на весь экран */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`}>
                <div className="mobile-menu-container">
                    <div className="mobile-menu-header">
                        <Link href="/" className="mobile-logo" onClick={closeMenu}>
                            <img 
                                src="/images/logo.PNG" 
                                alt="MENZO.UZ Logo"
                                className="mobile-logo-image"
                            />
                        </Link>
                        <button className="mobile-menu-close" onClick={closeMenu}>
                            <FiX size={28} />
                        </button>
                    </div>

                    <div className="mobile-menu-links">
                        <Link href="/" onClick={closeMenu} className="mobile-link">
                            <FiHome className="mobile-link-icon" />
                            <span>Главная</span>
                        </Link>

                        <div className="mobile-dropdown">
                            <button
                                className={`mobile-dropdown-btn ${isDropdownOpen ? 'active' : ''}`}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <FaUtensils className="mobile-link-icon" />
                                <span>Заведения</span>
                                <FiChevronDown className={`mobile-dropdown-icon ${isDropdownOpen ? 'rotated' : ''}`} />
                            </button>
                            <div className={`mobile-dropdown-content ${isDropdownOpen ? 'active' : ''}`}>
                                <Link href="/type/restaurants" onClick={closeMenu}>
                                    <FaUtensils />
                                    <span>Рестораны</span>
                                </Link>
                                <Link href="/type/cafes" onClick={closeMenu}>
                                    <FaCoffee />
                                    <span>Кафе</span>
                                </Link>
                                <Link href="/type/fast-food" onClick={closeMenu}>
                                    <FaHamburger />
                                    <span>Фастфуд</span>
                                </Link>
                                <Link href="/type/restobars" onClick={closeMenu}>
                                    <FaGlassCheers />
                                    <span>Рестобары</span>
                                </Link>
                                <Link href="/type/coffeehouses" onClick={closeMenu}>
                                    <FaMugHot />
                                    <span>Кофейни</span>
                                </Link>
                                <Link href="/type/teahouses" onClick={closeMenu}>
                                    <FaLeaf />
                                    <span>Чайханы</span>
                                </Link>
                                <Link href="/type/bakeries" onClick={closeMenu}>
                                    <FaBreadSlice />
                                    <span>Пекарни</span>
                                </Link>
                                <Link href="/type/canteens" onClick={closeMenu}>
                                    <FaStore />
                                    <span>Столовые</span>
                                </Link>
                            </div>
                        </div>

                        <Link href="/recommended" className="mobile-link gold-link" onClick={closeMenu}>
                            <FaCrown className="mobile-link-icon" />
                            <span>Рекомендуемые</span>
                        </Link>

                        <Link href="/map" onClick={closeMenu} className="mobile-link">
                            <FiMapPin className="mobile-link-icon" />
                            <span>Карта</span>
                        </Link>

                        <Link href="/about" onClick={closeMenu} className="mobile-link">
                            <FiInfo className="mobile-link-icon" />
                            <span>О нас</span>
                        </Link>

                        <Link href="/contacts" onClick={closeMenu} className="mobile-link">
                            <FiMail className="mobile-link-icon" />
                            <span>Контакты</span>
                        </Link>
                    </div>

                    <div className="mobile-menu-footer">
                        <div className="mobile-social">
                            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
                            <a href="#" target="_blank" rel="noopener noreferrer">Telegram</a>
                            <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
                        </div>
                        <p className="mobile-copyright">© MENZO.UZ Все права защищены</p>
                    </div>
                </div>
            </div>
        </>
    )
}
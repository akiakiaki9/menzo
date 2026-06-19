'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FaArrowLeft, FaPhone, FaTelegramPlane, FaInstagram, FaEnvelope, FaFacebook, FaGlobe,
  FaMapMarkerAlt, FaStar, FaClock,
  FaShoppingCart, FaSearch, FaTimes,
  FaUtensils, FaCoffee, FaHamburger, FaPizzaSlice,
  FaIceCream, FaBeer, FaWineBottle, FaLeaf,
  FaBookOpen, FaPenFancy, FaArrowUp
} from 'react-icons/fa'
import { GiKnifeFork, GiMeal, GiChickenLeg, GiFishCorpse } from 'react-icons/gi'

import './menu.css'
import OrderModal from '@/app/components/restaurant-detail/orderModal/OrderModal'
import BookingModal from '@/app/components/booking-modal/BookingModal'
import RatingModal from '@/app/components/restaurant-detail/ratingModal/RatingModal'

export default function RestaurantMenuPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug
  const [restaurant, setRestaurant] = useState(null)
  const [restaurantId, setRestaurantId] = useState(null)
  const [menuCategories, setMenuCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [ratingStats, setRatingStats] = useState(null)
  const [userRated, setUserRated] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [stylesApplied, setStylesApplied] = useState(false)
  
  // Состояния для модалки фото
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const categoriesScrollRef = useRef(null)
  let touchStartX = 0

  const API_URL = 'https://api.menzo.uz'

  // Добавляем мета-теги для предотвращения кэширования
  useEffect(() => {
    const metaCacheControl = document.createElement('meta')
    metaCacheControl.httpEquiv = 'Cache-Control'
    metaCacheControl.content = 'no-cache, no-store, must-revalidate'
    document.head.appendChild(metaCacheControl)

    const metaPragma = document.createElement('meta')
    metaPragma.httpEquiv = 'Pragma'
    metaPragma.content = 'no-cache'
    document.head.appendChild(metaPragma)

    const metaExpires = document.createElement('meta')
    metaExpires.httpEquiv = 'Expires'
    metaExpires.content = '0'
    document.head.appendChild(metaExpires)

    return () => {
      document.head.removeChild(metaCacheControl)
      document.head.removeChild(metaPragma)
      document.head.removeChild(metaExpires)
    }
  }, [])

  // Показать модалку с фото
  const openPhotoModal = (item) => {
    setSelectedItem(item)
    setShowPhotoModal(true)
    document.body.style.overflow = 'hidden'
  }

  // Закрыть модалку с фото
  const closePhotoModal = () => {
    setShowPhotoModal(false)
    setSelectedItem(null)
    document.body.style.overflow = ''
  }

  // Кнопка "Наверх"
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Блокировка скролла при открытой корзине
  useEffect(() => {
    if (showCart) {
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
  }, [showCart])

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    if (!categoriesScrollRef.current) return
    const touchEndX = e.touches[0].clientX
    const diff = touchStartX - touchEndX
    categoriesScrollRef.current.scrollLeft += diff
    touchStartX = touchEndX
  }

  const handleCategoryChange = (categoryId) => {
    if (activeCategory === categoryId || isTransitioning) return
    setIsTransitioning(true)
    setActiveCategory(categoryId)
    setTimeout(() => {
      setIsTransitioning(false)
    }, 250)
  }

  const handleBookingClick = () => {
    if (!restaurant?.is_accepting_bookings) {
      alert('К сожалению, ресторан временно не принимает бронирования')
      return
    }
    setShowBookingModal(true)
  }

  const handleRatingClick = () => {
    setShowRatingModal(true)
  }

  const handleRatingSuccess = async () => {
    if (restaurant) {
      const timestamp = new Date().getTime()
      const res = await fetch(`${API_URL}/api/restaurants/${restaurant.id}/?_=${timestamp}`)
      if (res.ok) {
        const data = await res.json()
        setRatingStats(data.rating_stats)
        setUserRated(true)
      }
    }
    setShowRatingModal(false)
  }

  const loadCart = async (restId) => {
    try {
      const cartRes = await fetch(`${API_URL}/api/cart/my_cart/`)
      if (cartRes.ok) {
        const cartData = await cartRes.json()
        const restaurantCart = cartData.find(c => c.restaurant === restId)
        if (restaurantCart && restaurantCart.items) {
          const loadedCart = restaurantCart.items.map(item => ({
            id: item.menu_item,
            name: item.menu_item_name,
            price: item.menu_item_price,
            quantity: item.quantity,
            image: item.menu_item_image
          }))
          setCart(loadedCart)
        } else {
          setCart([])
        }
      }
    } catch (err) {}
  }

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      try {
        const timestamp = new Date().getTime()
        const restaurantRes = await fetch(`${API_URL}/api/restaurants/${slug}/?_=${timestamp}`)
        if (!restaurantRes.ok) {
          setLoading(false)
          return
        }

        const restaurantData = await restaurantRes.json()
        if (restaurantData.is_published === false) {
          setRestaurant(null)
          setLoading(false)
          return
        }

        setRestaurant(restaurantData)
        setRestaurantId(restaurantData.id)
        setRatingStats(restaurantData.rating_stats)

        const ratingRes = await fetch(`${API_URL}/api/ratings/${restaurantData.id}/user_rating/?_=${timestamp}`).catch(() => ({ ok: false }))
        if (ratingRes.ok) {
          const ratingData = await ratingRes.json()
          const hasRated = Object.values(ratingData).some(v => v !== null)
          setUserRated(hasRated)
        }

        const categoriesRes = await fetch(`${API_URL}/api/restaurants/${slug}/menu_categories/?_=${timestamp}`)
        const categoriesData = await categoriesRes.json()
        const activeCategories = categoriesData.filter(c => c.is_active)
        setMenuCategories(activeCategories)

        if (activeCategories.length > 0) {
          setActiveCategory(activeCategories[0].id)
        }

        const menuRes = await fetch(`${API_URL}/api/restaurants/${slug}/?_=${timestamp}`)
        const menuData = await menuRes.json()
        setMenuItems(menuData.menu_items || [])

        await loadCart(restaurantData.id)

      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, API_URL])

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Закуски': <GiKnifeFork />,
      'Салаты': <FaLeaf />,
      'Супы': <FaUtensils />,
      'Горячее': <GiMeal />,
      'Мясные блюда': <GiChickenLeg />,
      'Рыбные блюда': <GiFishCorpse />,
      'Пицца': <FaPizzaSlice />,
      'Бургеры': <FaHamburger />,
      'Десерты': <FaIceCream />,
      'Напитки': <FaBeer />,
      'Кофе': <FaCoffee />,
      'Винная карта': <FaWineBottle />
    }
    return icons[categoryName] || <FaUtensils />
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-menu.png'
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
    return `${API_URL}/media/${imagePath}`
  }

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory ? item.category === activeCategory : true
    const matchesSearch = searchQuery === '' ? true : 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const currentCategory = menuCategories.find(c => c.id === activeCategory)

  useEffect(() => {
    const forceApplyStyles = () => {
      const grid = document.querySelector('.menu-items-grid')
      if (grid) {
        grid.style.display = 'none'
        setTimeout(() => {
          grid.style.display = ''
          setStylesApplied(true)
        }, 10)
      }
      
      const cards = document.querySelectorAll('.menu-item-card')
      cards.forEach(card => {
        card.style.opacity = '0'
        setTimeout(() => {
          card.style.opacity = '1'
        }, 5)
      })
    }
    
    const timeout = setTimeout(forceApplyStyles, 100)
    return () => clearTimeout(timeout)
  }, [filteredItems])

  const addToCartWithAnimation = async (item, event) => {
    if (!restaurantId) return

    const button = event.currentTarget
    button.classList.add('cart-bump')
    setTimeout(() => button.classList.remove('cart-bump'), 300)

    const rect = button.getBoundingClientRect()
    const flyingItem = document.createElement('div')
    flyingItem.className = 'cart-flying-item'
    flyingItem.innerHTML = '🍽️'
    flyingItem.style.position = 'fixed'
    flyingItem.style.left = `${rect.left + rect.width / 2}px`
    flyingItem.style.top = `${rect.top + rect.height / 2}px`
    flyingItem.style.fontSize = '28px'
    flyingItem.style.zIndex = '9999'
    flyingItem.style.pointerEvents = 'none'
    
    const cartBtn = document.querySelector('.cart-floating-btn')
    if (cartBtn) {
      const cartRect = cartBtn.getBoundingClientRect()
      flyingItem.style.setProperty('--fly-end-x', `${cartRect.left - rect.left}px`)
      flyingItem.style.setProperty('--fly-end-y', `${cartRect.top - rect.top}px`)
    }
    
    document.body.appendChild(flyingItem)
    
    setTimeout(() => {
      flyingItem.remove()
    }, 500)

    try {
      const response = await fetch(`${API_URL}/api/cart/${restaurantId}/add_item/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu_item_id: item.id, quantity: 1 })
      })

      const result = await response.json()

      if (response.ok) {
        const existing = cart.find(c => c.id === item.id)
        if (existing) {
          setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c))
        } else {
          setCart([...cart, { ...item, quantity: 1 }])
        }
        
        const cartBtnElement = document.querySelector('.cart-floating-btn')
        if (cartBtnElement) {
          cartBtnElement.classList.add('cart-bump')
          setTimeout(() => cartBtnElement.classList.remove('cart-bump'), 300)
        }
      } else {
      }
    } catch (err) {
    }
  }

  const removeFromCart = async (itemId) => {
    if (!restaurantId) return

    try {
      const existing = cart.find(c => c.id === itemId)
      if (existing.quantity === 1) {
        const response = await fetch(`${API_URL}/api/cart/${restaurantId}/remove_item/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ menu_item_id: itemId })
        })

        if (response.ok) {
          setCart(cart.filter(c => c.id !== itemId))
        }
      } else {
        const response = await fetch(`${API_URL}/api/cart/${restaurantId}/update_quantity/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ menu_item_id: itemId, quantity: existing.quantity - 1 })
        })

        if (response.ok) {
          setCart(cart.map(c => c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c))
        }
      }
    } catch (err) {
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleOrderSuccess = async () => {
    if (!restaurantId) return

    await fetch(`${API_URL}/api/cart/${restaurantId}/clear/`, { method: 'DELETE' })
    setCart([])
    setShowCart(false)
    alert('✅ Заказ успешно отправлен! Ресторан свяжется с вами в ближайшее время.')
  }

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="loading-container">
          <div className="loading-content">
            <div className="loading-logo">MENZO</div>
            <div className="loading-spinner-wrapper">
              <div className="loading-spinner"></div>
              <div className="loading-spinner-ring"></div>
            </div>
            <div className="loading-text">
              <span>Загружаем меню</span>
              <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
            <div className="loading-progress">
              <div className="loading-progress-bar"></div>
            </div>
            <p className="loading-subtitle">Лучшие блюда Узбекистана</p>
          </div>
        </div>
      </div>
    )
  }

  if (!restaurant || restaurant.is_published === false) {
    return (
      <div className="menu-error">
        <div className="error-icon">🍽️</div>
        <h2>Ресторан не найден</h2>
        <p>К сожалению, запрашиваемый ресторан не существует или был скрыт</p>
        <Link href="/" className="back-link">Вернуться на главную</Link>
      </div>
    )
  }

  if (restaurant.is_menu_published === false) {
    return (
      <div className="menu-unavailable">
        <div className="unavailable-icon">📋</div>
        <h2>Меню временно недоступно</h2>
        <p>Ресторан обновляет меню. Загляните позже!</p>
        <Link href={`/restaurants/${slug}`} className="back-link">
          Вернуться в ресторан
        </Link>
      </div>
    )
  }

  const isGold = restaurant.is_gold || false

  return (
    <div className={`menu-page ${isGold ? 'gold-menu' : ''}`}>
      {/* Header */}
      <div className="menu-header" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${getImageUrl(restaurant.images?.[0]?.image)})`
      }}>
        <div className="menu-header-overlay">
          <div className="menu-header-content">
            <Link href={`/restaurants/${slug}`} className="back-button">
              <FaArrowLeft />
            </Link>

            <div className="restaurant-info">
              {restaurant.logo ? (
                <img src={getImageUrl(restaurant.logo)} alt={restaurant.name} className="restaurant-logo" />
              ) : (
                <div className="restaurant-logo-placeholder">
                  <GiKnifeFork />
                </div>
              )}

              <h1 className={isGold ? 'gold-title' : ''}>
                {restaurant.name}
              </h1>

              <div className="restaurant-meta">
                <div className="meta-item">
                  <FaStar />
                  <span>{restaurant.rating?.toFixed(1) || 'Новый'}</span>
                </div>
                <div className="meta-item">
                  <FaClock />
                  <span>{restaurant.working_hours || '11:00 - 23:00'}</span>
                </div>
                <div className="meta-item">
                  <FaMapMarkerAlt />
                  <span>{restaurant.address?.split(',')[0] || restaurant.region_label}</span>
                </div>
              </div>

              <div className="restaurant-contacts">
                {restaurant.phone && (
                  <a href={`tel:${restaurant.phone}`} className="contact-link phone-link">
                    <FaPhone />
                    <span>{restaurant.phone}</span>
                  </a>
                )}
                {restaurant.telegram && (
                  <a href={restaurant.telegram.startsWith('http') ? restaurant.telegram : `https://t.me/${restaurant.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="contact-link-icon telegram-icon">
                    <FaTelegramPlane />
                  </a>
                )}
                {restaurant.instagram && (
                  <a href={restaurant.instagram.startsWith('http') ? restaurant.instagram : `https://instagram.com/${restaurant.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="contact-link-icon instagram-icon">
                    <FaInstagram />
                  </a>
                )}
                {restaurant.email && (
                  <a href={`mailto:${restaurant.email}`} className="contact-link-icon email-icon">
                    <FaEnvelope />
                  </a>
                )}
                {restaurant.facebook && (
                  <a href={restaurant.facebook.startsWith('http') ? restaurant.facebook : `https://facebook.com/${restaurant.facebook.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="contact-link-icon facebook-icon">
                    <FaFacebook />
                  </a>
                )}
                {restaurant.website && (
                  <a href={restaurant.website.startsWith('http') ? restaurant.website : `https://${restaurant.website}`} target="_blank" rel="noopener noreferrer" className="contact-link-icon website-icon">
                    <FaGlobe />
                  </a>
                )}
              </div>

              <div className="restaurant-action-buttons">
                <button className="action-btn rating-action-btn" onClick={handleRatingClick}>
                  <FaPenFancy />
                  <span>{userRated ? "Изменить" : "Оценить"}</span>
                </button>
                <button className="action-btn booking-action-btn" onClick={handleBookingClick}>
                  <FaBookOpen />
                  <span>Забронировать</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Поиск */}
      <div className="menu-search-section">
        <div className="container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Поиск по меню..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Категории */}
      <div className="menu-categories-section">
        <div className="container">
          <div
            className="categories-scroll"
            ref={categoriesScrollRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {menuCategories.map(category => {
              const categoryItems = menuItems.filter(item => item.category === category.id)
              if (categoryItems.length === 0) return null
              
              return (
                <button
                  key={category.id}
                  className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.image ? (
                    <div className="category-tab-image">
                      <img src={getImageUrl(category.image)} alt={category.name} />
                    </div>
                  ) : (
                    <span className="category-icon">{category.icon || getCategoryIcon(category.name)}</span>
                  )}
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{categoryItems.length}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Баннер категории */}
      {currentCategory && currentCategory.image && (
        <div className="category-banner">
          <img src={getImageUrl(currentCategory.image)} alt={currentCategory.name} />
          <div className="category-banner-overlay">
            <div className="category-banner-content">
              <h2>{currentCategory.name}</h2>
              <p>{filteredItems.length} блюд</p>
            </div>
          </div>
        </div>
      )}

      {/* Меню */}
      <div className="menu-items-section">
        <div className="container">
          {filteredItems.length === 0 ? (
            <div className="no-items">
              <FaUtensils />
              <h3>Блюда не найдены</h3>
              <p>Попробуйте изменить поиск или выберите другую категорию</p>
            </div>
          ) : (
            <>
              {!currentCategory?.image && (
                <div className="category-header-without-banner">
                  <h2>{currentCategory?.name || 'Меню'}</h2>
                  <p>{filteredItems.length} блюд</p>
                </div>
              )}
              <div className={`menu-items-grid ${isTransitioning ? 'fade-out' : 'fade-in'} ${stylesApplied ? 'styles-ready' : ''}`}>
                {filteredItems.map((item, index) => (
                  <div key={item.id} className="menu-item-card" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div 
                      className="item-image" 
                      onClick={() => openPhotoModal(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img 
                        src={item.image ? getImageUrl(item.image) : '/images/placeholder-menu.png'} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder-menu.png'
                        }}
                      />
                      {item.is_recommended && <span className="recommended-badge">⭐ Хит</span>}
                    </div>
                    <div className="item-info">
                      <div className="item-header">
                        <h3>{item.name}</h3>
                        <span className="item-price">{Number(item.price).toLocaleString()} сум</span>
                      </div>
                      {item.description && (
                        <p className="item-description">{item.description}</p>
                      )}
                      <div className="item-actions">
                        <button 
                          className="add-to-cart-btn" 
                          onClick={(e) => addToCartWithAnimation(item, e)}
                        >
                          <FaShoppingCart />
                          <span>В корзину</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Корзина */}
      <div className={`cart-sidebar ${showCart ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>
            <FaShoppingCart />
            Корзина
          </h3>
          <button className="close-cart" onClick={() => setShowCart(false)}>
            <FaTimes />
          </button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <FaShoppingCart />
              <p>Корзина пуста</p>
              <button className="continue-shopping" onClick={() => setShowCart(false)}>
                Продолжить покупки
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={getImageUrl(item.image)} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">{Number(item.price).toLocaleString()} сум</span>
                </div>
                <div className="cart-item-actions">
                  <button onClick={() => removeFromCart(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={(e) => addToCartWithAnimation(item, e)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Итого:</span>
              <strong>{cartTotal.toLocaleString()} сум</strong>
            </div>
            <button className="checkout-btn" onClick={() => setShowOrderModal(true)}>
              Оформить заказ
            </button>
          </div>
        )}
      </div>

      {/* Плавающая кнопка корзины */}
      <button className="cart-floating-btn" onClick={() => setShowCart(true)}>
        <FaShoppingCart />
        {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
      </button>

      {/* Кнопка "Наверх" - появляется при скролле */}
      <button className="scroll-to-top-btn" onClick={scrollToTop} aria-label="Наверх">
        <FaArrowUp />
      </button>

      {/* Модалка с фото блюда */}
      {showPhotoModal && selectedItem && (
        <div className="photo-modal-overlay" onClick={closePhotoModal}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="photo-modal-close" onClick={closePhotoModal}>
              <FaTimes />
            </button>
            <div className="photo-modal-image">
              <img 
                src={getImageUrl(selectedItem.image)} 
                alt={selectedItem.name}
              />
            </div>
            <div className="photo-modal-info">
              <h3>{selectedItem.name}</h3>
              <p className="photo-modal-price">{Number(selectedItem.price).toLocaleString()} сум</p>
              {selectedItem.description && (
                <p className="photo-modal-description">{selectedItem.description}</p>
              )}
              <button 
                className="photo-modal-add-btn"
                onClick={(e) => {
                  addToCartWithAnimation(selectedItem, e)
                  closePhotoModal()
                }}
              >
                <FaShoppingCart />
                В корзину
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалки */}
      {showOrderModal && (
        <OrderModal
          restaurant={restaurant}
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setShowOrderModal(false)}
          onSuccess={handleOrderSuccess}
        />
      )}

      {showBookingModal && (
        <BookingModal
          restaurant={{ id: restaurant.id, name: restaurant.name, is_accepting_bookings: restaurant.is_accepting_bookings }}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false)
            const toast = document.createElement('div')
            toast.className = 'booking-toast'
            toast.innerHTML = '✅ Бронирование успешно создано!'
            document.body.appendChild(toast)
            setTimeout(() => toast.remove(), 3000)
          }}
        />
      )}

      {showRatingModal && (
        <RatingModal
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
          onClose={() => setShowRatingModal(false)}
          onSuccess={handleRatingSuccess}
          isGold={restaurant.is_gold}
        />
      )}

      {/* Мини-футер */}
      <div className="menu-mini-footer">
        <div className="container">
          <div className="mini-footer-content">
            <div className="mini-footer-info">
              <h4>{restaurant.name}</h4>
              <p>Лучшие блюда для вас</p>
            </div>
            <div className="mini-footer-phone">
              {restaurant.phone && (
                <>
                  <FaPhone />
                  <a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a>
                </>
              )}
            </div>
          </div>
          <div className="mini-footer-copyright">
            <span>© {new Date().getFullYear()} MENZO.UZ</span>
          </div>
        </div>
      </div>
    </div>
  )
}
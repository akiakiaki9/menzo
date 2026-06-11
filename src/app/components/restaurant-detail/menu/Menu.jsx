'use client'
import { useState } from 'react'
import { FaUtensils, FaChevronDown, FaChevronUp, FaStar, FaFire, FaLeaf } from 'react-icons/fa'
import { GiKnifeFork, GiMeal, GiFire } from 'react-icons/gi'
import './Menu.css'

export default function Menu({ menuItems, categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState({})

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  if (!menuItems || menuItems.length === 0) return null

  // Функция получения URL изображения
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/media')) return `${API_URL}${imagePath}`
    return `${API_URL}/media/${imagePath}`
  }

  // Группировка блюд по категориям (если есть категории)
  const getItemsByCategory = () => {
    if (categories.length > 0) {
      const grouped = {}
      categories.forEach(cat => {
        grouped[cat.id] = {
          ...cat,
          items: menuItems.filter(item => item.category === cat.id)
        }
      })
      // Добавляем блюда без категории
      const uncategorized = menuItems.filter(item => !item.category)
      if (uncategorized.length > 0) {
        grouped['uncategorized'] = {
          id: 'uncategorized',
          name: 'Без категории',
          icon: '🍽️',
          image: null,
          items: uncategorized
        }
      }
      return grouped
    }
    return null
  }

  const groupedItems = getItemsByCategory()
  const hasCategories = categories.length > 0

  // Если есть категории с API, используем их
  if (hasCategories) {
    const categoriesList = Object.values(groupedItems)
    const hasAnyItems = categoriesList.some(cat => cat.items.length > 0)

    if (!hasAnyItems) {
      return (
        <div className="menu-section">
          <div className="menu-header-section">
            <div className="menu-title">
              <div className="menu-icon-wrapper">
                <FaUtensils />
              </div>
              <h3>Меню ресторана</h3>
            </div>
            <div className="menu-empty-state">
              <GiMeal />
              <p>Меню пока не добавлено</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="menu-section">
        <div className="menu-header-section">
          <div className="menu-title">
            <div className="menu-icon-wrapper">
              <FaUtensils />
            </div>
            <h3>Меню ресторана</h3>
          </div>
          <p className="menu-subtitle">
            {menuItems.length} блюд в меню • Цены указаны в сум
          </p>
        </div>

        {categoriesList.map((category) => (
          category.items.length > 0 && (
            <div key={category.id} className="menu-category-group">
              <div className="menu-category-header">
                {category.image && (
                  <div className="category-image-wrapper">
                    <img 
                      src={getImageUrl(category.image)} 
                      alt={category.name}
                      className="category-image"
                    />
                  </div>
                )}
                <div className="category-info">
                  <div className="category-icon">{category.icon || '🍽️'}</div>
                  <h4>{category.name}</h4>
                  <span className="category-items-count">{category.items.length} блюд</span>
                </div>
              </div>
              
              <div className="category-items-grid">
                {category.items.map((item, idx) => {
                  const imageUrl = getImageUrl(item.image)
                  const hasDescription = item.description && item.description.length > 0
                  const isExpanded = expandedItems[`${category.id}_${idx}`]
                  const shouldTruncate = hasDescription && item.description.length > 100
                  const displayDescription = shouldTruncate && !isExpanded
                    ? item.description.substring(0, 100) + '...'
                    : item.description

                  return (
                    <div key={item.id} className="menu-card">
                      <div className="menu-image-wrapper">
                        <img
                          src={imageUrl || '/placeholder.jpg'}
                          alt={item.name}
                          className="menu-image"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg'
                          }}
                        />
                        {item.is_recommended && (
                          <div className="image-badge">
                            <FaStar />
                            <span>Хит</span>
                          </div>
                        )}
                      </div>

                      <div className="menu-info">
                        <div className="menu-header">
                          <div className="menu-name-wrapper">
                            <span className="menu-name">{item.name}</span>
                            {item.is_spicy && <GiFire className="spicy-icon" title="Острое" />}
                            {item.is_vegetarian && <FaLeaf className="vegetarian-icon" title="Вегетарианское" />}
                          </div>
                          <div className="menu-price-wrapper">
                            <span className="menu-price">{Number(item.price).toLocaleString()} сум</span>
                          </div>
                        </div>

                        {hasDescription && (
                          <div className="menu-description-wrapper">
                            <p className="menu-description">{displayDescription}</p>
                            {shouldTruncate && (
                              <button
                                className="expand-desc-btn"
                                onClick={() => setExpandedItems(prev => ({ 
                                  ...prev, 
                                  [`${category.id}_${idx}`]: !prev[`${category.id}_${idx}`]
                                }))}
                              >
                                {isExpanded ? (
                                  <>
                                    <FaChevronUp />
                                    <span>Свернуть</span>
                                  </>
                                ) : (
                                  <>
                                    <FaChevronDown />
                                    <span>Подробнее</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        <div className="menu-footer">
                          {item.is_recommended && !imageUrl && (
                            <span className="recommended-badge">
                              <FaStar />
                              Рекомендуем
                            </span>
                          )}
                          {item.weight && (
                            <span className="weight-badge">
                              ⚖️ {item.weight} г
                            </span>
                          )}
                          {item.calories && (
                            <span className="calories-badge">
                              🔥 {item.calories} ккал
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        ))}
      </div>
    )
  }

  // Старая логика (без категорий) - fallback
  // ... (оставьте старый код как fallback)
  
  return (
    <div className="menu-section">
      <div className="menu-header-section">
        <div className="menu-title">
          <div className="menu-icon-wrapper">
            <FaUtensils />
          </div>
          <h3>Меню ресторана</h3>
        </div>
        <p className="menu-subtitle">
          {menuItems.length} блюд в меню • Цены указаны в сум
        </p>
      </div>

      <div className="menu-grid">
        {menuItems.map((item, idx) => {
          const imageUrl = getImageUrl(item.image)
          const hasDescription = item.description && item.description.length > 0
          const isExpanded = expandedItems[idx]
          const shouldTruncate = hasDescription && item.description.length > 100
          const displayDescription = shouldTruncate && !isExpanded
            ? item.description.substring(0, 100) + '...'
            : item.description

          return (
            <div key={item.id || idx} className="menu-card">
              <div className="menu-image-wrapper">
                <img
                  src={imageUrl || '/placeholder.jpg'}
                  alt={item.name}
                  className="menu-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg'
                  }}
                />
                {item.is_recommended && (
                  <div className="image-badge">
                    <FaStar />
                    <span>Хит</span>
                  </div>
                )}
              </div>

              <div className="menu-info">
                <div className="menu-header">
                  <div className="menu-name-wrapper">
                    <span className="menu-name">{item.name}</span>
                    {item.is_spicy && <GiFire className="spicy-icon" title="Острое" />}
                    {item.is_vegetarian && <FaLeaf className="vegetarian-icon" title="Вегетарианское" />}
                  </div>
                  <div className="menu-price-wrapper">
                    <span className="menu-price">{Number(item.price).toLocaleString()} сум</span>
                  </div>
                </div>

                {hasDescription && (
                  <div className="menu-description-wrapper">
                    <p className="menu-description">{displayDescription}</p>
                    {shouldTruncate && (
                      <button
                        className="expand-desc-btn"
                        onClick={() => toggleDescription(idx)}
                      >
                        {isExpanded ? (
                          <>
                            <FaChevronUp />
                            <span>Свернуть</span>
                          </>
                        ) : (
                          <>
                            <FaChevronDown />
                            <span>Подробнее</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                <div className="menu-footer">
                  {item.is_recommended && !imageUrl && (
                    <span className="recommended-badge">
                      <FaStar />
                      Рекомендуем
                    </span>
                  )}
                  {item.weight && (
                    <span className="weight-badge">
                      ⚖️ {item.weight} г
                    </span>
                  )}
                  {item.calories && (
                    <span className="calories-badge">
                      🔥 {item.calories} ккал
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {menuItems.length === 0 && (
        <div className="menu-empty">
          <GiMeal />
          <p>В меню пока нет блюд</p>
        </div>
      )}
    </div>
  )
}
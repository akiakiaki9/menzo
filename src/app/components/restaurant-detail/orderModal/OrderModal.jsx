'use client'
import { useState, useEffect } from 'react'
import { FaTimes, FaPhone, FaUser, FaComment } from 'react-icons/fa'
import './OrderModal.css'

export default function OrderModal({ restaurant, cart, cartTotal, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        comment: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [cooldownSeconds, setCooldownSeconds] = useState(0)
    const [isCooldown, setIsCooldown] = useState(false)

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    // Таймер обратного отсчета
    useEffect(() => {
        let timer
        if (isCooldown && cooldownSeconds > 0) {
            timer = setTimeout(() => {
                setCooldownSeconds(prev => prev - 1)
            }, 1000)
        } else if (cooldownSeconds === 0 && isCooldown) {
            setIsCooldown(false)
        }
        return () => clearTimeout(timer)
    }, [cooldownSeconds, isCooldown])

    if (restaurant && restaurant.is_accepting_orders === false) {
        return (
            <div className="order-modal-overlay" onClick={onClose}>
                <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="order-modal-header">
                        <h2>Заказы недоступны</h2>
                        <button className="order-modal-close" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>
                    <div className="order-unavailable">
                        <div className="unavailable-icon">🔒</div>
                        <p>Ресторан временно не принимает заказы</p>
                        {restaurant.phone && (
                            <a href={`tel:${restaurant.phone}`} className="order-phone-link">
                                📞 {restaurant.phone}
                            </a>
                        )}
                        <button className="order-btn-cancel" onClick={onClose} style={{ marginTop: '16px' }}>
                            Закрыть
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (isCooldown) {
            setError(`Пожалуйста, подождите ${cooldownSeconds} секунд перед повторной отправкой`)
            return
        }
        
        setLoading(true)
        setError('')

        if (!formData.customer_name.trim()) {
            setError('Введите ваше имя')
            setLoading(false)
            return
        }

        if (!formData.customer_phone.trim()) {
            setError('Введите номер телефона')
            setLoading(false)
            return
        }

        try {
            const orderData = {
                restaurant_id: restaurant.id,
                restaurant_name: restaurant.name,
                customer_name: formData.customer_name.trim(),
                customer_phone: formData.customer_phone.trim(),
                comment: formData.comment || '',
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity
                })),
                total: cartTotal
            }

            const response = await fetch(`${API_URL}/api/orders/create/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })

            const data = await response.json()

            // Обработка ошибки 429
            if (response.status === 429) {
                let waitSeconds = 60
                
                const retryAfter = response.headers.get('Retry-After')
                if (retryAfter) {
                    waitSeconds = parseInt(retryAfter)
                } else if (data.detail && typeof data.detail === 'string') {
                    const match = data.detail.match(/\d+/)
                    if (match) {
                        waitSeconds = parseInt(match[0])
                    }
                }
                
                setCooldownSeconds(waitSeconds)
                setIsCooldown(true)
                setError(`Превышен лимит запросов. Попробуйте через ${waitSeconds} секунд.`)
                setLoading(false)
                return
            }

            if (response.ok) {
                onSuccess(data)
                onClose()
            } else {
                setError(data.error || 'Ошибка оформления')
            }
        } catch (err) {
            console.error('Error:', err)
            setError('Ошибка соединения')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="order-modal-overlay" onClick={onClose}>
            <div className="order-modal" onClick={(e) => e.stopPropagation()}>
                <div className="order-modal-header">
                    <h2>Оформление заказа</h2>
                    <button className="order-modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="order-restaurant-info">
                    <p>Ресторан: <strong>{restaurant.name}</strong></p>
                    <div className="order-summary">
                        <span>Товаров: {cart.reduce((sum, i) => sum + i.quantity, 0)}</span>
                        <span><strong>{cartTotal.toLocaleString()} сум</strong></span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="order-form">
                    <div className="order-form-group">
                        <label><FaUser /> Имя <span className="required">*</span></label>
                        <input
                            type="text"
                            placeholder="Иван Иванов"
                            value={formData.customer_name}
                            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        />
                    </div>

                    <div className="order-form-group">
                        <label><FaPhone /> Телефон <span className="required">*</span></label>
                        <input
                            type="tel"
                            placeholder="+998 90 123-45-67"
                            value={formData.customer_phone}
                            onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        />
                    </div>

                    <div className="order-form-group">
                        <label><FaComment /> Комментарий</label>
                        <textarea
                            rows="2"
                            placeholder="Пожелания, аллергии..."
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        />
                    </div>

                    {error && <div className="order-error-message">{error}</div>}

                    <div className="order-cart-preview">
                        <h4>Ваш заказ:</h4>
                        {cart.map(item => (
                            <div key={item.id} className="order-cart-item">
                                <span>{item.name} x{item.quantity}</span>
                                <span>{(item.price * item.quantity).toLocaleString()} сум</span>
                            </div>
                        ))}
                        <div className="order-cart-total">
                            <span>Итого:</span>
                            <strong>{cartTotal.toLocaleString()} сум</strong>
                        </div>
                    </div>

                    <div className="order-modal-buttons">
                        <button type="button" className="order-btn-cancel" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="order-btn-submit" disabled={loading || isCooldown}>
                            {loading ? 'Отправка...' : isCooldown ? `Подождите ${cooldownSeconds}с` : 'Подтвердить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
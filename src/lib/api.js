import axios from 'axios'

const API_BASE_URL = 'https://api.menzo.uz/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const restaurantsApi = {
    getAll: () => api.get('/restaurants/'),
    getBySlug: (slug) => api.get(`/restaurants/${slug}/`),
}

export const bookingsApi = {
    create: (data) => api.post('/bookings/', data),
}

export default api
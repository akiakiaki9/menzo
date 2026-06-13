import { notFound } from 'next/navigation'
import RestaurantDetailClient from './RestaurantDetailClient'

// Динамические метаданные для SEO
export async function generateMetadata({ params }) {
    // В Next.js 15+ params — это промис, его нужно ждать
    const { slug } = await params
    
    const API_URL = 'https://api.menzo.uz' || 'http://localhost:8000'
    
    try {
        const res = await fetch(`${API_URL}/api/restaurants/${slug}/`, {
            next: { revalidate: 3600 } // Кеширование на 1 час
        })
        
        if (!res.ok) {
            return {
                title: 'Ресторан не найден | MENZO.UZ',
                description: 'К сожалению, запрашиваемый ресторан не существует.'
            }
        }
        
        const restaurant = await res.json()
        
        const title = `${restaurant.name} | Ресторан в ${restaurant.region_label || 'Узбекистане'} | MENZO.UZ`
        const description = restaurant.description?.substring(0, 160) || `Ресторан ${restaurant.name} в ${restaurant.region_label || 'Узбекистане'}. ${restaurant.cuisine_type_label || 'Разнообразная'} кухня, уютная атмосфера. Забронируйте столик онлайн на MENZO.UZ.`
        
        return {
            title,
            description,
            keywords: `${restaurant.name}, ресторан, ${restaurant.cuisine_type || 'ресторан'}, ${restaurant.region_label || 'Узбекистан'}, бронирование столиков, меню, отзывы`,
            openGraph: {
                title,
                description,
                type: 'website',
                locale: 'ru_RU',
                siteName: 'MENZO.UZ',
                url: `https://menzo.uz/restaurants/${slug}`,
                images: restaurant.images?.[0]?.image ? [
                    {
                        url: restaurant.images[0].image.startsWith('http') 
                            ? restaurant.images[0].image 
                            : `${API_URL}${restaurant.images[0].image}`,
                        width: 1200,
                        height: 630,
                        alt: restaurant.name,
                    }
                ] : [],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: restaurant.images?.[0]?.image ? [
                    restaurant.images[0].image.startsWith('http') 
                        ? restaurant.images[0].image 
                        : `${API_URL}${restaurant.images[0].image}`
                ] : [],
            },
            alternates: {
                canonical: `https://menzo.uz/restaurants/${slug}`
            }
        }
    } catch (error) {
        // console.error('Error generating metadata:', error)
        return {
            title: 'Ресторан | MENZO.UZ',
            description: 'Лучшие рестораны и кафе Узбекистана. Бронирование столиков онлайн.'
        }
    }
}

export default async function RestaurantPage({ params }) {
    // Обязательный await для params в Next.js 15+
    const { slug } = await params
    
    if (!slug) {
        notFound()
    }
    
    return <RestaurantDetailClient slug={slug} />
}
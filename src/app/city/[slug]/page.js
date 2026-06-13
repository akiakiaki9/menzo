import CityClient from './CityClient'

// Метаданные для SEO (серверная часть)
export async function generateMetadata({ params }) {
    // В Next.js 15 params - это Promise, нужно развернуть через await
    const resolvedParams = await params
    const slug = resolvedParams?.slug
    
    const cityNames = {
        'tashkent': 'Ташкент',
        'tashkent_region': 'Ташкентская область',
        'samarkand': 'Самарканд',
        'bukhara': 'Бухара',
        'khiva': 'Хива',
        'fergana': 'Фергана',
        'andijan': 'Андижан',
        'namangan': 'Наманган',
        'kokand': 'Коканд',
        'nukus': 'Нукус',
        'termiz': 'Термез',
        'qarshi': 'Карши',
        'navoi': 'Навои',
        'jizzakh': 'Джизак',
        'gulistan': 'Гулистан',
        'urgench': 'Ургенч'
    }

    const cityName = cityNames[slug] || slug || 'Узбекистане'
    const decodedCityName = decodeURIComponent(cityName)

    return {
        title: `${decodedCityName} | Рестораны и кафе | TAVSIA.UZ`,
        description: `Лучшие рестораны, кафе и заведения в ${decodedCityName}. Бронирование столиков онлайн, отзывы, меню и цены.`,
        openGraph: {
            title: `${decodedCityName} | Рестораны и кафе | TAVSIA.UZ`,
            description: `Лучшие рестораны, кафе и заведения в ${decodedCityName}.`,
        },
    }
}

export default async function CityPage({ params }) {
    // В Next.js 15 params - это Promise, нужно развернуть через await
    const resolvedParams = await params
    const slug = resolvedParams?.slug
    // console.log('🔍 page.js - slug:', slug)
    return <CityClient initialSlug={slug} />
}
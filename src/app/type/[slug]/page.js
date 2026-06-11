import { notFound } from 'next/navigation'
import { getTypeData, getAllTypeSlugs } from '@/lib/typeData'
import TypePageLayout from '@/app/components/type-pages/typePageLayout/TypePageLayout'

export async function generateStaticParams() {
    const types = getAllTypeSlugs()
    return types.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
    // В Next.js 15+ params — это промис, его нужно ждать
    const { slug } = await params
    const typeData = getTypeData(slug)

    if (!typeData) {
        return { title: 'Страница не найдена' }
    }

    return {
        title: typeData.seo.title,
        description: typeData.seo.description,
        keywords: typeData.seo.keywords,
        openGraph: {
            title: typeData.seo.title,
            description: typeData.seo.description,
            type: 'website',
            url: `https://menzo.uz/type/${slug}`,
            siteName: 'MENZO.UZ'
        }
    }
}

export default async function TypePage({ params }) {
    // Обязательный await для params в 15-й версии
    const { slug } = await params
    const typeData = getTypeData(slug)

    if (!typeData) {
        notFound()
    }

    return <TypePageLayout typeData={typeData} />
}
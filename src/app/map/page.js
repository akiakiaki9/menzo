import MapPageClient from './MapPageClient'

// SEO метаданные
export const metadata = {
  title: 'Карта ресторанов и кафе Узбекистана',
  description: 'Интерактивная карта ресторанов, кафе и заведений Узбекистана. Найдите ближайшие места для питания, посмотрите расположение на карте, постройте маршрут.',
  keywords: 'карта ресторанов, карта кафе, где поесть на карте, рестораны на карте Ташкента, заведения рядом со мной',
  alternates: {
    canonical: 'https://menzo.uz/map'
  },
  openGraph: {
    title: 'Карта заведений Узбекистана | MENZO.UZ',
    description: 'Найдите лучшие рестораны и кафе на интерактивной карте Узбекистана. Удобный поиск, фильтры, маршруты.',
    type: 'website',
    locale: 'ru_RU',
    url: 'https://menzo.uz/map',
    siteName: 'MENZO.UZ'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Карта ресторанов и кафе Узбекистана | MENZO.UZ',
    description: 'Найдите лучшие заведения на карте Узбекистана'
  }
}

export default function MapPage() {
  return <MapPageClient />
}
import './styles/globals.css'
import './styles/gold-card.css'

export const metadata = {
  metadataBase: new URL('https://menzo.uz'),
  title: {
    default: 'Рестораны и кафе Узбекистана | MENZO.UZ',
    template: '%s | MENZO.UZ'
  },
  description: 'Бронирование столиков в лучших ресторанах, кафе и заведениях по всему Узбекистану. Онлайн-бронирование, отзывы, меню и цены. Telegram бот для быстрого заказа.',
  keywords: 'рестораны Узбекистана, кафе Узбекистан, бронирование столиков, рестораны Ташкента, рестораны Самарканда, рестораны Бухары, лучшие рестораны, телеграм бот, меню ресторанов, отзывы о ресторанах',
  authors: [{ name: 'MENZO.UZ' }],
  creator: 'MENZO.UZ',
  publisher: 'MENZO.UZ',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Рестораны и кафе Узбекистана | MENZO.UZ',
    description: 'Бронирование столиков в лучших ресторанах, кафе и заведениях по всему Узбекистану. Онлайн-бронирование, отзывы, меню и цены.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'MENZO.UZ',
    url: 'https://menzo.uz',
    images: [
      {
        url: '/images/menzo.PNG',
        width: 512,
        height: 512,
        alt: 'MENZO.UZ - Рестораны Узбекистана',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Рестораны и кафе Узбекистана | MENZO.UZ',
    description: 'Бронирование столиков в лучших ресторанах, кафе и заведениях по всему Узбекистану',
    images: ['/images/menzo.PNG'],
  },
  icons: {
    icon: '/images/menzo.PNG',
    shortcut: '/images/menzo.PNG',
    apple: '/images/menzo.PNG',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'ваш-google-verification-код',
    yandex: 'ваш-yandex-verification-код',
  },
  alternates: {
    canonical: 'https://menzo.uz',
    languages: {
      'ru': 'https://menzo.uz',
      'uz': 'https://menzo.uz/uz',
    },
  },
  category: 'food',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Schema.org разметка для ресторана */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "MENZO.UZ",
              "url": "https://menzo.uz",
              "logo": "https://menzo.uz/images/menzo.PNG",
              "description": "Бронирование столиков в лучших ресторанах и кафе Узбекистана",
              "sameAs": [
                "https://t.me/menzo_uz",
                "https://instagram.com/menzo.uz"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "UZ",
                "addressLocality": "Ташкент"
              }
            })
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
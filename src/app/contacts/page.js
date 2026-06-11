import Footer from '../components/footer/Footer'
import Navbar from '../components/navbar/Navbar'
import ContactsClient from './Contacts'

export const metadata = {
    title: 'Контакты | TAVSIA.UZ',
    description: 'Свяжитесь с нами: телефон, email, Telegram. Мы всегда рады помочь и ответить на ваши вопросы.',
    keywords: 'контакты, поддержка, связаться с нами',
    alternates: {
        canonical: 'https://tavsia.uz/contacts'
    }
}

export default function ContactsPage() {
    return (
        <>
            <Navbar />
            <ContactsClient />
            <Footer />
        </>
    )
};
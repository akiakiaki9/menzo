import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    
    console.log('1. Получены данные от клиента:', body)
    
    // Проверяем что Django запущен
    const response = await fetch('https://api.menzo.uz/api/bookings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        restaurant: body.restaurant,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_email: body.customer_email || '',
        date: body.date,
        time: body.time,
        guests: parseInt(body.guests),
        comment: body.comment || ''
      })
    })
    
    console.log('2. Статус ответа от Django:', response.status)
    
    const data = await response.json()
    console.log('3. Данные от Django:', data)
    
    // Возвращаем успешный ответ
    return NextResponse.json(data, { 
      status: response.status 
    })
    
  } catch (error) {
    console.error('Прокси ошибка:', error)
    return NextResponse.json(
      { 
        error: 'Ошибка соединения с сервером',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
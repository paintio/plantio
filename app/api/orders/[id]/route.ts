import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Проверяем, хочет ли браузер HTML страницу
    const accept = request.headers.get('accept') || ''
    const wantsHtml = accept.includes('text/html')
    
    const orders = db.getAllOrders()
    const order = orders.find((o: any) => o.id === id)
    
    if (!order) {
      if (wantsHtml) {
        // Редирект на страницу 404
        return NextResponse.redirect(new URL('/order/not-found', request.url))
      }
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    // Получаем все листинги для обогащения данных
    const listings = db.getListings()
    
    // Обогащаем каждый товар в заказе данными из листинга
    const enrichedOrder = {
      ...order,
      items: order.items.map((item: any) => {
        const listing = listings.find((l: any) => l.id === item.listingId)
        return {
          ...item,
          listing: listing ? {
            id: listing.id,
            title: listing.title,
            price: listing.price,
            city: listing.city,
            image: listing.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
            description: listing.description,
            sellerId: listing.sellerId,
            sellerType: listing.sellerType
          } : {
            id: item.listingId,
            title: 'Товар удален',
            price: item.price,
            city: 'Неизвестно',
            image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
            description: 'Товар больше не доступен'
          }
        }
      })
    }
    
    // Если браузер хочет HTML - редиректим на страницу заказа
    if (wantsHtml) {
      return NextResponse.redirect(new URL(`/order/${id}`, request.url))
    }
    
    // Иначе возвращаем JSON для API запросов
    return NextResponse.json(enrichedOrder)
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error)
    const accept = request.headers.get('accept') || ''
    const wantsHtml = accept.includes('text/html')
    
    if (wantsHtml) {
      return NextResponse.redirect(new URL('/order/error', request.url))
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

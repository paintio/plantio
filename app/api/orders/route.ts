import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    
    const orders = db.getOrders(userId)
    const listings = db.getListings()
    
    const ordersWithDetails = orders.map((order: any) => ({
      ...order,
      items: order.items.map((item: any) => ({
        ...item,
        listing: listings.find((l: any) => l.id === item.listingId)
      }))
    }))
    
    return NextResponse.json(ordersWithDetails)
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, items, promocode } = body
    
    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const listings = db.getListings()
    
    // Рассчитываем итоговую сумму
    let total = 0
    for (const item of items) {
      const listing = listings.find((l: any) => l.id === item.listingId)
      if (!listing) {
        return NextResponse.json({ error: `Listing not found: ${item.listingId}` }, { status: 400 })
      }
      total += listing.price * item.quantity
    }
    
    // Применяем промокод
    let discount = 0
    if (promocode) {
      const promo = db.validatePromocode(promocode)
      if (promo.valid && promo.discount) {
        discount = promo.discount
        total = total * (1 - discount / 100)
      }
    }
    
    // Проверяем баланс пользователя
    const user = db.getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    if (user.balance < total) {
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })
    }
    
    // Списываем средства
    db.updateUserBalance(userId, -total)
    
    // Создаем заказ
    const order = {
      id: Date.now().toString(),
      userId,
      items: items.map((item: any) => ({
        listingId: item.listingId,
        quantity: item.quantity,
        price: listings.find((l: any) => l.id === item.listingId)?.price || 0
      })),
      total,
      status: 'paid' as const,
      promocode: promocode || null,
      discount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    db.createOrder(order)
    db.clearCart(userId)
    
    // Добавляем уведомление
    db.addNotification({
      id: Date.now().toString(),
      userId,
      title: 'Заказ оформлен',
      message: `Ваш заказ на сумму ${total.toFixed(2)} € успешно оформлен`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    })
    
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { listingId, sellerId, days } = await request.json()
    
    const prices: Record<number, number> = { 7: 10, 14: 15, 30: 25 }
    const cost = prices[days]
    
    const user = db.getUserById(sellerId)
    if (!user || user.balance < cost) {
      return NextResponse.json({ error: 'Недостаточно средств' }, { status: 400 })
    }
    
    // Списываем средства
    db.updateUserBalance(sellerId, -cost)
    
    // Продвигаем объявление
    const listing = db.updateListing(listingId, {
      isPromoted: true,
      promotedUntil: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
    })
    
    // Добавляем уведомление
    db.addNotification({
      id: Date.now().toString(),
      userId: sellerId,
      title: 'Объявление продвинуто',
      message: `Ваше объявление "${listing?.title}" продвинуто на ${days} дней`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    })
    
    return NextResponse.json({ success: true, listing })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка продвижения' }, { status: 500 })
  }
}

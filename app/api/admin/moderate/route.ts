import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data.json')

const getData = () => JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
const saveData = (data: any) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { listingId, status, reason } = body
    
    if (!listingId) {
      return NextResponse.json({ error: 'listingId required' }, { status: 400 })
    }
    
    const data = getData()
    const listings = data.listings || []
    const index = listings.findIndex((l: any) => l.id === listingId)
    
    if (index === -1) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }
    
    // Обновляем объявление
    listings[index] = {
      ...listings[index],
      isModerated: true,
      moderationStatus: status,
      moderationReason: reason || '',
      moderatedAt: new Date().toISOString()
    }
    
    data.listings = listings
    saveData(data)
    
    // Добавляем уведомление продавцу
    if (!data.notifications) data.notifications = []
    data.notifications.unshift({
      id: Date.now().toString(),
      userId: listings[index].sellerId,
      title: status === 'approved' ? '✅ Объявление одобрено' : '❌ Объявление отклонено',
      message: status === 'approved' 
        ? `Ваше объявление "${listings[index].title}" прошло модерацию и опубликовано` 
        : `Ваше объявление "${listings[index].title}" отклонено. Причина: ${reason || 'Не указана'}`,
      type: status === 'approved' ? 'success' : 'error',
      isRead: false,
      createdAt: new Date().toISOString()
    })
    saveData(data)
    
    return NextResponse.json({ success: true, listing: listings[index] })
  } catch (error) {
    console.error('Moderate API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

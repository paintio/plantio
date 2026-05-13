import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const otherUserId = searchParams.get('otherUserId')
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }
  
  const messages = db.getMessages(userId, otherUserId || undefined)
  return NextResponse.json(messages)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const message = {
      id: Date.now().toString(),
      fromUserId: body.fromUserId,
      toUserId: body.toUserId,
      listingId: body.listingId,
      text: body.text,
      isRead: false,
      createdAt: new Date().toISOString()
    }
    
    db.sendMessage(message)
    
    // Создаем уведомление для получателя
    db.addNotification({
      id: Date.now().toString(),
      userId: body.toUserId,
      title: 'Новое сообщение',
      message: `Новое сообщение от пользователя`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    })
    
    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

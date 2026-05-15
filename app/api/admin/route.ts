import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const users = [
  { id: 1, name: 'Администратор', email: 'admin@plantio.com', userType: 'private', balance: 10000, isAdmin: true },
  { id: 2, name: 'Иван Продавец', email: 'seller@plantio.com', userType: 'private', balance: 500, isAdmin: false }
]

const listings = [
  { id: 1, title: 'Монстера', price: 45, city: 'Москва', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6', views: 156 },
  { id: 2, title: 'Кактус', price: 30, city: 'СПб', image: 'https://images.unsplash.com/photo-1484047103223-1ead3e9ddd4f', views: 89 }
]

const categories = [
  { id: 1, name: 'Комнатные', slug: 'komnatnye', icon: '🏠' },
  { id: 2, name: 'Суккуленты', slug: 'sukkulenty', icon: '🌵' }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  if (action === 'users') return NextResponse.json(users)
  if (action === 'listings') return NextResponse.json(listings)
  if (action === 'stats') return NextResponse.json({ totalUsers: users.length, totalListings: listings.length })
  if (action === 'categories') return NextResponse.json(categories)
  
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const id = searchParams.get('id')
  
  // Временно просто возвращаем успех
  return NextResponse.json({ success: true })
}

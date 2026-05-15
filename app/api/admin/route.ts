import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Тестовые данные
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

const banners = [
  { id: 1, title: 'Весенняя распродажа', subtitle: 'Скидка до 50%', image: '', active: true, link: '/catalog' }
]

const promocodes = [
  { code: 'WELCOME10', discount: 10, expires: new Date(Date.now() + 30*24*60*60*1000).toISOString() }
]

const orders = [
  { id: 1, total: 45, status: 'paid', userId: 2, createdAt: new Date().toISOString() }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  if (action === 'users') return NextResponse.json(users)
  if (action === 'listings') return NextResponse.json(listings)
  if (action === 'categories') return NextResponse.json(categories)
  if (action === 'banners') return NextResponse.json(banners)
  if (action === 'promocodes') return NextResponse.json(promocodes)
  if (action === 'orders') return NextResponse.json(orders)
  if (action === 'stats') {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
    return NextResponse.json({ 
      totalUsers: users.length, 
      totalListings: listings.length,
      totalOrders: orders.length,
      totalRevenue,
      usersByType: { private: 1, business: 1 }
    })
  }
  
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const id = searchParams.get('id')
  return NextResponse.json({ success: true })
}

export async function PUT(request: NextRequest) {
  const body = await request.json()
  const { action, id, status } = body
  return NextResponse.json({ success: true })
}

import { NextRequest, NextResponse } from 'next/server'

// Временные тестовые данные
const testData = {
  users: [
    { id: 1, name: 'Администратор', email: 'admin@plantio.com', userType: 'private', balance: 10000, isAdmin: true },
    { id: 2, name: 'Иван Продавец', email: 'seller@plantio.com', userType: 'private', balance: 500, isAdmin: false }
  ],
  listings: [
    { id: 1, title: 'Монстера', price: 45, city: 'Москва', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6', views: 156 },
    { id: 2, title: 'Кактус', price: 30, city: 'СПб', image: 'https://images.unsplash.com/photo-1484047103223-1ead3e9ddd4f', views: 89 }
  ],
  orders: []
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  if (action === 'stats') {
    return NextResponse.json({
      totalUsers: testData.users.length,
      totalListings: testData.listings.length,
      totalOrders: testData.orders.length,
      totalRevenue: 0
    })
  }
  if (action === 'users') return NextResponse.json(testData.users)
  if (action === 'listings') return NextResponse.json(testData.listings)
  if (action === 'orders') return NextResponse.json(testData.orders)
  
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true })
}

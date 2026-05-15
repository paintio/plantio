import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const listings = [
  { id: 1, title: 'Монстера Делициоза', price: 45, city: 'Москва', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6', category: 'Комнатные', views: 156 },
  { id: 2, title: 'Кактус Сан-Педро', price: 30, city: 'Санкт-Петербург', image: 'https://images.unsplash.com/photo-1484047103223-1ead3e9ddd4f', category: 'Суккуленты', views: 89 },
  { id: 3, title: 'Фикус Бенджамина', price: 25, city: 'Казань', image: 'https://images.unsplash.com/photo-1509423350716-481729ef494a', category: 'Комнатные', views: 234 },
  { id: 4, title: 'Спатифиллум', price: 35, city: 'Новосибирск', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', category: 'Комнатные', views: 112 }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || ''
  
  let filtered = [...listings]
  
  if (search) {
    filtered = filtered.filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
  }
  if (category && category !== 'all') {
    filtered = filtered.filter(item => item.category === category)
  }
  
  return NextResponse.json({ listings: filtered, total: filtered.length })
}

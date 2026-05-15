import { NextRequest, NextResponse } from 'next/server'

// Временные тестовые данные
const testListings = [
  { id: 1, title: 'Монстера Делициоза', price: 45, city: 'Москва', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6', category: 'Комнатные растения', sellerType: 'private', views: 156 },
  { id: 2, title: 'Кактус Сан-Педро', price: 30, city: 'Санкт-Петербург', image: 'https://images.unsplash.com/photo-1484047103223-1ead3e9ddd4f', category: 'Суккуленты', sellerType: 'business', views: 89 },
  { id: 3, title: 'Фикус Бенджамина', price: 25, city: 'Казань', image: 'https://images.unsplash.com/photo-1509423350716-481729ef494a', category: 'Комнатные растения', sellerType: 'private', views: 234 },
  { id: 4, title: 'Спатифиллум', price: 35, city: 'Новосибирск', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba', category: 'Комнатные растения', sellerType: 'private', views: 112 }
]

export async function GET() {
  return NextResponse.json({ listings: testListings, total: testListings.length })
}

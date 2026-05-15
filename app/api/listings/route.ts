import { NextRequest, NextResponse } from 'next/server'

const listings = [
  { id: 1, title: 'Монстера', price: 45, city: 'Москва', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6', category: 'Комнатные', sellerType: 'private', views: 156 },
  { id: 2, title: 'Кактус', price: 30, city: 'СПб', image: 'https://images.unsplash.com/photo-1484047103223-1ead3e9ddd4f', category: 'Суккуленты', sellerType: 'business', views: 89 },
  { id: 3, title: 'Фикус', price: 25, city: 'Казань', image: 'https://images.unsplash.com/photo-1509423350716-481729ef494a', category: 'Комнатные', sellerType: 'private', views: 234 },
]

export async function GET() {
  return NextResponse.json({ listings, total: listings.length })
}

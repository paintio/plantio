import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sellerId = searchParams.get('sellerId')
  
  if (!sellerId) {
    return NextResponse.json({ error: 'sellerId required' }, { status: 400 })
  }
  
  const listings = db.getListings().filter(l => l.sellerId === sellerId)
  const orders = db.getOrders(sellerId)
  
  const stats = {
    totalListings: listings.length,
    totalViews: listings.reduce((sum, l) => sum + l.views, 0),
    totalSales: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    averagePrice: listings.length > 0 ? listings.reduce((sum, l) => sum + l.price, 0) / listings.length : 0,
    promotedListings: listings.filter(l => l.isPromoted).length
  }
  
  return NextResponse.json(stats)
}

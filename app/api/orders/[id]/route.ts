import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orders = db.getAllOrders()
    const order = orders.find((o: any) => o.id === id)
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    const listings = db.getListings()
    const orderWithDetails = {
      ...order,
      items: order.items.map((item: any) => ({
        ...item,
        listing: listings.find((l: any) => l.id === item.listingId)
      }))
    }
    
    return NextResponse.json(orderWithDetails)
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

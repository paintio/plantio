import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    
    // Для гостей возвращаем пустую корзину, они хранят в localStorage
    if (userId === 'guest') {
      return NextResponse.json([])
    }
    
    const cart = db.getCart(userId)
    const listings = db.getListings()
    
    const cartWithDetails = cart.map((item: any) => ({
      ...item,
      listing: listings.find((l: any) => l.id === item.listingId)
    }))
    
    return NextResponse.json(cartWithDetails)
  } catch (error) {
    console.error('GET /api/cart error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, listingId, quantity } = await request.json()
    
    if (!listingId) {
      return NextResponse.json({ error: 'listingId required' }, { status: 400 })
    }
    
    // Для гостей - просто возвращаем успех, они хранят в localStorage
    if (userId === 'guest') {
      return NextResponse.json({ success: true, guest: true })
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    
    const cart = db.addToCart(userId, listingId, quantity || 1)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('POST /api/cart error:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const cartItemId = searchParams.get('cartItemId')
    
    // Для гостей - возвращаем успех
    if (userId === 'guest') {
      return NextResponse.json({ success: true })
    }
    
    if (!userId || !cartItemId) {
      return NextResponse.json({ error: 'userId and cartItemId required' }, { status: 400 })
    }
    
    const cart = db.removeFromCart(userId, cartItemId)
    return NextResponse.json(cart)
  } catch (error) {
    console.error('DELETE /api/cart error:', error)
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 })
  }
}

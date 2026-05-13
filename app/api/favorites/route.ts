import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const favorites = db.getFavorites()
    const listings = db.getListings()
    const favoriteListings = listings.filter(l => favorites.includes(l.id))
    return NextResponse.json(favoriteListings)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { id } = await request.json()
    const favorites = db.toggleFavorite(id)
    return NextResponse.json({ favorites })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle' }, { status: 500 })
  }
}

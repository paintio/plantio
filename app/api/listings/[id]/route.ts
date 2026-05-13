import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const listing = db.getListing(id)
    
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }
    
    // Увеличиваем счетчик просмотров
    const updated = db.updateListing(id, { views: (listing.views || 0) + 1 })
    
    return NextResponse.json(updated || listing)
  } catch (error) {
    console.error('GET /api/listings/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

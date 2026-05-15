import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const listing = await db.getListing(parseInt(id))
    
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }
    
    return NextResponse.json(listing)
  } catch (error) {
    console.error('GET /api/listings/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

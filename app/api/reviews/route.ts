import { NextRequest, NextResponse } from 'next/server'
import { db, Review } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')
    
    if (!listingId) {
      return NextResponse.json({ error: 'listingId required' }, { status: 400 })
    }
    
    const reviews = db.getReviews(listingId)
    const averageRating = db.getAverageRating(listingId)
    
    return NextResponse.json({ reviews, averageRating })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const newReview: Review = {
      id: Date.now().toString(),
      listingId: body.listingId,
      author: body.author || 'Аноним',
      rating: body.rating,
      text: body.text,
      createdAt: new Date().toISOString()
    }
    
    db.addReview(newReview)
    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 })
  }
}

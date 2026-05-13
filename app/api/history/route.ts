import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 })
  }
  
  const history = db.getViewHistory(userId)
  return NextResponse.json(history)
}

export async function POST(request: Request) {
  try {
    const { userId, listingId } = await request.json()
    db.addViewHistory(userId, listingId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add history' }, { status: 500 })
  }
}

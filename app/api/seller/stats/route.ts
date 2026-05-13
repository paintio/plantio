import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  
  const stats = db.getSellerStats(userId)
  const financials = db.getSellerFinancials(userId)
  
  return NextResponse.json({ ...stats, monthlyData: financials })
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json({ error: 'code required' }, { status: 400 })
    }
    
    const result = db.validatePromocode(code)
    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/promocode error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

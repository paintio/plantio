import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, amount } = body
    
    if (!userId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }
    
    const updatedUser = db.updateUserBalance(userId, amount)
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const { password, ...userWithoutPassword } = updatedUser
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error('Balance API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  const expenses = db.getExpenses(userId)
  return NextResponse.json(expenses)
}

export async function POST(request: Request) {
  const body = await request.json()
  const expense = { id: Date.now().toString(), ...body, date: new Date().toISOString() }
  db.addExpense(expense)
  return NextResponse.json(expense)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (id) db.deleteExpense(id)
  return NextResponse.json({ success: true })
}

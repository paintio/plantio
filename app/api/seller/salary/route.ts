import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
  const salaries = db.getSalaryPayments(userId)
  return NextResponse.json(salaries)
}

export async function POST(request: Request) {
  const body = await request.json()
  const payment = { id: Date.now().toString(), status: 'pending', createdAt: new Date().toISOString(), ...body }
  db.addSalaryPayment(payment)
  return NextResponse.json(payment)
}

export async function PUT(request: Request) {
  const { id, status } = await request.json()
  const updated = db.updateSalaryStatus(id, status)
  return NextResponse.json(updated)
}

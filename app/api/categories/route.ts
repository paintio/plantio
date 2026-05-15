import { NextRequest, NextResponse } from 'next/server'

let categories = [
  { id: 1, name: 'Комнатные растения', slug: 'komnatnye', icon: '🏠' },
  { id: 2, name: 'Суккуленты', slug: 'sukkulenty', icon: '🌵' },
  { id: 3, name: 'Садовые растения', slug: 'sadovye', icon: '🌻' }
]

export async function GET() {
  return NextResponse.json(categories)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newCategory = { id: Date.now(), ...body }
  categories.push(newCategory)
  return NextResponse.json(newCategory)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  categories = categories.filter(c => c.id !== parseInt(id!))
  return NextResponse.json({ success: true })
}

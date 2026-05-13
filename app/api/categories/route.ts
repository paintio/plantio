import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const categories = db.getCategories()
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newCategory = { id: Date.now().toString(), subcategories: [], ...body }
  db.createCategory(newCategory)
  return NextResponse.json(newCategory)
}

export async function PUT(request: Request) {
  const { id, ...updates } = await request.json()
  const updated = db.updateCategory(id, updates)
  return NextResponse.json(updated)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (id) db.deleteCategory(id)
  return NextResponse.json({ success: true })
}

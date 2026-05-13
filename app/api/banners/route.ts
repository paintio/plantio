import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const banners = db.getBanners()
  return NextResponse.json(banners)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newBanner = {
    id: Date.now().toString(),
    ...body,
    active: true,
    createdAt: new Date().toISOString()
  }
  db.createBanner(newBanner)
  return NextResponse.json(newBanner)
}

export async function PUT(request: NextRequest) {
  const { id, ...updates } = await request.json()
  const updated = db.updateBanner(id, updates)
  return NextResponse.json(updated)
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (id) db.deleteBanner(id)
  return NextResponse.json({ success: true })
}

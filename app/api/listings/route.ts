import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let listings = db.getListings()
    
    if (search) {
      listings = listings.filter((item: any) => 
        item.title.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (category && category !== 'all') {
      listings = listings.filter((item: any) => item.category === category)
    }
    
    listings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json({ listings: listings.slice(0, limit), total: listings.length })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Получены данные для создания:', body)
    
    const { title, description, price, city, image, category, phone, sellerId, sellerType, stock, stockType } = body
    
    if (!title || !price || !city) {
      console.log('❌ Ошибка: не заполнены обязательные поля')
      return NextResponse.json({ error: 'Заполните обязательные поля (название, цена, город)' }, { status: 400 })
    }
    
    if (!sellerId) {
      console.log('❌ Ошибка: нет sellerId')
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }
    
    const newListing = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description || '',
      price: Number(price),
      city: city.trim(),
      image: image || '',
      category: category || 'Комнатные растения',
      phone: phone || '',
      sellerId: sellerId,
      sellerType: sellerType || 'private',
      stock: stock || 1,
      stockType: stockType || 'available',
      isPromoted: false,
      isModerated: false,
      moderationStatus: 'pending',
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log('✅ Создаем товар:', newListing.title)
    db.createListing(newListing)
    
    return NextResponse.json({ success: true, listing: newListing }, { status: 201 })
  } catch (error) {
    console.error('❌ POST error:', error)
    return NextResponse.json({ error: 'Ошибка сервера при создании товара' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    
    const updated = db.updateListing(id, updates)
    if (!updated) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, listing: updated })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }
    
    db.deleteListing(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

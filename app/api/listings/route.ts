import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let query = supabase
      .from('listings')
      .select('*, seller:users(id, name)')
      .order('created_at', { ascending: false })
    
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query.limit(limit)
    
    if (error) throw error
    
    return NextResponse.json({ listings: data || [], total: data?.length || 0 })
  } catch (error) {
    console.error('GET /api/listings error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('listings')
      .insert({
        title: body.title,
        description: body.description,
        price: body.price,
        city: body.city,
        image: body.image,
        category: body.category,
        seller_id: body.sellerId,
        seller_type: body.sellerType
      })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('POST /api/listings error:', error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

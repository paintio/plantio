import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('cart')
      .select('*, listing:listings(*)')
      .eq('user_id', parseInt(userId))
    
    if (error) throw error
    
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('GET /api/cart error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, listingId, quantity } = await request.json()
    
    if (!userId || !listingId) {
      return NextResponse.json({ error: 'userId and listingId required' }, { status: 400 })
    }
    
    // Проверяем, есть ли уже товар в корзине
    const { data: existing } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', parseInt(userId))
      .eq('listing_id', parseInt(listingId))
      .single()
    
    if (existing) {
      // Обновляем количество
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + (quantity || 1) })
        .eq('id', existing.id)
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json(data)
    } else {
      // Добавляем новый товар
      const { data, error } = await supabase
        .from('cart')
        .insert({ user_id: parseInt(userId), listing_id: parseInt(listingId), quantity: quantity || 1 })
        .select()
        .single()
      
      if (error) throw error
      return NextResponse.json(data)
    }
  } catch (error) {
    console.error('POST /api/cart error:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const cartItemId = searchParams.get('cartItemId')
    
    if (!userId || !cartItemId) {
      return NextResponse.json({ error: 'userId and cartItemId required' }, { status: 400 })
    }
    
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', parseInt(cartItemId))
      .eq('user_id', parseInt(userId))
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/cart error:', error)
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { userId, cartItemId, quantity } = await request.json()
    
    if (!userId || !cartItemId) {
      return NextResponse.json({ error: 'userId and cartItemId required' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', parseInt(cartItemId))
      .eq('user_id', parseInt(userId))
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('PUT /api/cart error:', error)
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 })
  }
}

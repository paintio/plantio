import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    
    if (userId) {
      query = query.eq('user_id', parseInt(userId))
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    // Добавляем информацию о товарах в каждый заказ
    const ordersWithItems = await Promise.all((data || []).map(async (order) => {
      const itemsWithDetails = await Promise.all(order.items.map(async (item: any) => {
        const { data: listing } = await supabase
          .from('listings')
          .select('*')
          .eq('id', item.listingId)
          .single()
        return { ...item, listing }
      }))
      return { ...order, items: itemsWithDetails }
    }))
    
    return NextResponse.json(ordersWithItems)
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, items, total, promocode, discount } = body
    
    // Создаём заказ
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: parseInt(userId),
        items: items,
        total: total,
        status: 'paid',
        promocode: promocode || null,
        discount: discount || 0
      })
      .select()
      .single()
    
    if (orderError) throw orderError
    
    // Очищаем корзину пользователя
    const { error: cartError } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', parseInt(userId))
    
    if (cartError) console.error('Cart cleanup error:', cartError)
    
    // Обновляем баланс пользователя
    const { data: user } = await supabase
      .from('users')
      .select('balance')
      .eq('id', parseInt(userId))
      .single()
    
    await supabase
      .from('users')
      .update({ balance: (user?.balance || 0) - total })
      .eq('id', parseInt(userId))
    
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

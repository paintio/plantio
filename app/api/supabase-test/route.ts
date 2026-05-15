import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Проверяем подключение к users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name')
      .limit(5)
    
    if (usersError) {
      return NextResponse.json({ 
        success: false, 
        error: usersError.message,
        message: 'Ошибка подключения к таблице users'
      })
    }
    
    // Проверяем подключение к listings
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id, title, price')
      .limit(5)
    
    return NextResponse.json({ 
      success: true, 
      message: '✅ База данных работает!',
      usersCount: users?.length || 0,
      users: users,
      listingsCount: listings?.length || 0,
      listings: listings
    })
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: err.message 
    })
  }
}

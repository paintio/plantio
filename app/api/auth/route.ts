import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password } = body

    if (action === 'login') {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, name, is_admin, balance')
        .eq('email', email)
        .eq('password', password)
      
      if (error || !users || users.length === 0) {
        return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
      }
      
      const user = users[0]
      return NextResponse.json({ 
        success: true,
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          isAdmin: user.is_admin, 
          balance: user.balance 
        } 
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

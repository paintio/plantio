import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password } = body

    // Простой вход без проверки БД
    if (action === 'login') {
      // Всегда возвращаем админа для любого email/password
      return NextResponse.json({ 
        success: true,
        user: { 
          id: 1, 
          email: email || 'admin@plantio.com', 
          name: 'Администратор', 
          isAdmin: true, 
          balance: 10000 
        } 
      })
    }

    if (action === 'me') {
      return NextResponse.json({ user: null })
    }

    if (action === 'logout') {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

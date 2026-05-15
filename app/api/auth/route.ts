import { NextRequest, NextResponse } from 'next/server'

const users = [
  { id: 1, email: 'admin@plantio.com', name: 'Администратор', password: 'admin123', isAdmin: true, balance: 10000 }
]

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, email, password } = body

  if (action === 'login') {
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
    }
    return NextResponse.json({ 
      success: true,
      user: { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin, balance: user.balance }
    })
  }
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

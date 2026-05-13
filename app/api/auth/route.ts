import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Хранилище сессий (в реальном проекте лучше использовать Redis или БД)
const sessions = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, name, phone, city, userType } = body

    // Логин
    if (action === 'login') {
      const users = db.getUsers()
      const user = users.find((u: any) => u.email === email)
      
      if (!user || user.password !== password) {
        return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
      }
      
      // Создаем токен сессии
      const token = Date.now().toString() + Math.random().toString(36)
      sessions.set(token, { userId: user.id, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 })
      
      const { password: _, ...userWithoutPassword } = user
      const response = NextResponse.json({ user: userWithoutPassword })
      
      // Устанавливаем cookie с токеном
      response.cookies.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      })
      
      return response
    }

    // Регистрация
    if (action === 'register') {
      const users = db.getUsers()
      const existing = users.find((u: any) => u.email === email)
      
      if (existing) {
        return NextResponse.json({ error: 'Пользователь уже существует' }, { status: 400 })
      }
      
      const newUser = {
        id: Date.now().toString(),
        email,
        name: name || email.split('@')[0],
        password,
        phone: phone || '',
        city: city || '',
        userType: userType || 'private',
        balance: 100,
        avatar: '',
        createdAt: new Date().toISOString(),
        isAdmin: false,
        sellerRating: 0,
        totalSales: 0
      }
      
      const data = db.getData()
      data.users.push(newUser)
      db.saveData(data)
      
      // Создаем токен сессии
      const token = Date.now().toString() + Math.random().toString(36)
      sessions.set(token, { userId: newUser.id, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 })
      
      const { password: _, ...userWithoutPassword } = newUser
      const response = NextResponse.json({ user: userWithoutPassword })
      
      response.cookies.set('session_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      })
      
      return response
    }

    // Получение текущего пользователя
    if (action === 'me') {
      const token = request.cookies.get('session_token')?.value
      
      if (!token) {
        return NextResponse.json({ user: null })
      }
      
      const session = sessions.get(token)
      if (!session || session.expires < Date.now()) {
        sessions.delete(token)
        return NextResponse.json({ user: null })
      }
      
      const user = db.getUserById(session.userId)
      if (!user) {
        return NextResponse.json({ user: null })
      }
      
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json({ user: userWithoutPassword })
    }

    // Выход
    if (action === 'logout') {
      const token = request.cookies.get('session_token')?.value
      if (token) {
        sessions.delete(token)
      }
      
      const response = NextResponse.json({ success: true })
      response.cookies.delete('session_token')
      return response
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

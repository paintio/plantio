'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Modal from './Modal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('admin@plantio.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
        onClose()
        window.location.reload()
      } else {
        setError(data.error || 'Ошибка входа')
      }
    } catch (err) {
      setError('Ошибка соединения')
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.location.reload()
  }

  // Если пользователь уже вошел — показываем меню
  if (user) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={`Добро пожаловать, ${user.name}!`}>
        <div className="space-y-3">
          <Link href="/admin" className="block w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            ⚙️ Админ-панель
          </Link>
          <Link href="/seller" className="block w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            🏪 Кабинет продавца
          </Link>
          <Link href="/balance" className="block w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            💰 Баланс: {user.balance} €
          </Link>
          <Link href="/cart" className="block w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            🛒 Корзина
          </Link>
          <Link href="/profile" className="block w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
            👤 Профиль
          </Link>
          <div className="border-t border-gray-100 pt-3 mt-2">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              🚪 Выйти
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  // Форма входа
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Вход">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Пароль"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? 'Загрузка...' : 'Войти'}
        </button>
        
        <p className="text-center text-xs text-gray-400">
          Тестовый аккаунт: admin@plantio.com / admin123
        </p>
      </form>
    </Modal>
  )
}

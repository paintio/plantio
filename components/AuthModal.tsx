'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Modal from './Modal'
import { 
  LayoutDashboard, 
  Store, 
  Wallet, 
  ShoppingBag, 
  User, 
  LogOut,
  Settings,
  Package,
  Heart
} from 'lucide-react'

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
  }, [isOpen])

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
        <div className="space-y-2">
          <p className="text-sm text-gray-500 mb-4">Что хотите сделать?</p>
          
          {user.isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              <LayoutDashboard className="w-5 h-5 text-purple-500" />
              <span>Панель управления</span>
            </Link>
          )}
          
          <Link
            href="/seller"
            onClick={onClose}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <Store className="w-5 h-5 text-blue-500" />
            <span>Кабинет продавца</span>
          </Link>
          
          <Link
            href="/balance"
            onClick={onClose}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <Wallet className="w-5 h-5 text-green-500" />
            <span>Баланс: {user.balance} €</span>
          </Link>
          
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <span>Корзина</span>
          </Link>
          
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <User className="w-5 h-5 text-gray-500" />
            <span>Профиль</span>
          </Link>
          
          <Link
            href="/favorites"
            onClick={onClose}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <Heart className="w-5 h-5 text-red-500" />
            <span>Избранное</span>
          </Link>
          
          <div className="border-t border-gray-100 my-2"></div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </Modal>
    )
  }

  // Форма входа
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Вход в аккаунт">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="admin@plantio.com"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input
            type="password"
            placeholder="••••••"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
        
        <div className="text-center text-xs text-gray-400 pt-2">
          Тестовый аккаунт: admin@plantio.com / admin123
        </div>
      </form>
    </Modal>
  )
}

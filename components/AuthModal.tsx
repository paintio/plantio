'use client'

import { useState } from 'react'
import Modal from './Modal'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@plantio.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await login(email, password)
      onClose()
      // Обновляем страницу для обновления состояния
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message || 'Ошибка входа')
    }
    setLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Вход">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Пароль"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 transition"
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

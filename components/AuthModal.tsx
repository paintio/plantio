'use client'

import { useState } from 'react'
import Modal from './Modal'
import Link from 'next/link'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: any) => void
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [agreed, setAgreed] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    city: '',
    userType: 'private'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLogin && !agreed) {
      setError('Необходимо согласие на обработку персональных данных')
      return
    }
    
    setLoading(true)
    setError('')
    
    const action = isLogin ? 'login' : 'register'
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...form })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        onLogin(data.user)
        onClose()
        setForm({ email: '', password: '', name: '', phone: '', city: '', userType: 'private' })
        window.location.reload()
      } else {
        setError(data.error || 'Ошибка')
      }
    } catch (err) {
      setError('Ошибка соединения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isLogin ? 'Вход' : 'Регистрация'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Имя *"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
            />
            <input
              type="tel"
              placeholder="Телефон"
              className="w-full px-4 py-2 border rounded-lg"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
            />
            <input
              type="text"
              placeholder="Город"
              className="w-full px-4 py-2 border rounded-lg"
              value={form.city}
              onChange={e => setForm({...form, city: e.target.value})}
            />
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={form.userType}
              onChange={e => setForm({...form, userType: e.target.value})}
            >
              <option value="private">🏠 Частное лицо</option>
              <option value="business">🏢 Бизнес</option>
            </select>
          </>
        )}
        
        <input
          type="email"
          placeholder="Email *"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          required
        />
        
        <input
          type="password"
          placeholder="Пароль *"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          required
        />
        
        {!isLogin && (
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="agreement"
              className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              required
            />
            <label htmlFor="agreement" className="text-sm text-gray-600">
              Я принимаю условия{' '}
              <Link href="/terms" target="_blank" className="text-green-600 hover:underline">
                Пользовательского соглашения
              </Link>
              {' '}и даю согласие на{' '}
              <Link href="/consent" target="_blank" className="text-green-600 hover:underline">
                обработку персональных данных
              </Link>
            </label>
          </div>
        )}
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
        </button>
        
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin)
            setAgreed(false)
            setError('')
          }}
          className="w-full text-center text-green-600 hover:underline text-sm"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </form>
    </Modal>
  )
}

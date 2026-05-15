'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Wallet } from 'lucide-react'

export default function BalancePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-center">
        <p className="text-gray-600 mb-4">Войдите чтобы увидеть баланс</p>
        <Link href="/" className="text-green-600 hover:underline">На главную</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">🌱 Plantio</Link>
        </div>
      </header>
      <div className="max-w-md mx-auto px-6 py-12">
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Баланс</h1>
          </div>
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 mb-2">Доступно средств</p>
            <p className="text-5xl font-bold text-green-600">{user.balance} €</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div className="bg-green-600 rounded-full h-2" style={{ width: `${Math.min(100, user.balance / 100)}%` }} />
          </div>
          <button className="btn-primary w-full" onClick={() => alert('Пополнение в разработке')}>
            Пополнить баланс
          </button>
          <Link href="/" className="block text-center text-gray-500 text-sm mt-4 hover:text-gray-700">
            ← На главную
          </Link>
        </div>
      </div>
    </div>
  )
}

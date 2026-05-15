'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function BalancePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center">
        <p>Войдите, чтобы увидеть баланс</p>
        <Link href="/" className="text-green-600">На главную</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Баланс</h1>
        <p className="text-3xl text-green-600">{user.balance} €</p>
        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="bg-green-600 h-full" style={{ width: `${Math.min(100, user.balance / 100)}%` }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">доступно для покупок</p>
        <button
          onClick={() => alert('Пополнение в разработке')}
          className="mt-6 w-full bg-emerald-600 text-white py-2 rounded-lg"
        >
          Пополнить
        </button>
        <Link href="/" className="block mt-4 text-center text-gray-500">← На главную</Link>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SellerPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Просто показываем страницу
    setUser({ name: 'Продавец', balance: 500 })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Кабинет продавца</h1>
        <p>Добро пожаловать, {user?.name || 'Продавец'}!</p>
        <p>Баланс: {user?.balance || 0} €</p>
      </div>
    </div>
  )
}

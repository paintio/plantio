'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function CartPage() {
  const { user } = useAuth()
  const [cart, setCart] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetch(`/api/cart?userId=${user.id}`)
        .then(res => res.json())
        .then(setCart)
        .catch(() => setCart([]))
    }
  }, [user])

  const total = cart.reduce((sum, item) => sum + (item.listing?.price || 0) * item.quantity, 0)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-center">
        <p className="text-gray-600 mb-4">Войдите чтобы увидеть корзину</p>
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingBag className="w-6 h-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Корзина</h1>
        </div>
        {cart.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">Корзина пуста</p>
            <Link href="/catalog" className="text-green-600 hover:underline mt-4 inline-block">Перейти в каталог</Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="card flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.listing?.title}</h3>
                    <p className="text-sm text-gray-500">{item.listing?.city}</p>
                    <p className="text-green-600 font-bold mt-1">{item.listing?.price} € × {item.quantity}</p>
                  </div>
                  <button className="text-red-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="card flex justify-between items-center">
              <span className="font-semibold text-gray-900">Итого:</span>
              <span className="text-2xl font-bold text-green-600">{total} €</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function CartPage() {
  const { user } = useAuth()
  const [cart, setCart] = useState([])

  useEffect(() => {
    // Показываем тестовую корзину
    setCart([{ id: 1, title: 'Монстера', price: 45, quantity: 1 }])
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-center">
        <p className="text-gray-600 mb-4">Войдите чтобы увидеть корзину</p>
        <Link href="/" className="text-emerald-600">На главную</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-2xl font-light text-gray-900 mb-8">Корзина</h1>
        {cart.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center text-gray-500">Корзина пуста</div>
        ) : (
          <div className="bg-white rounded-xl border divide-y">
            {cart.map((item: any) => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div><h3 className="font-medium">{item.title}</h3><p className="text-sm text-gray-500">{item.price} € × {item.quantity}</p></div>
                <button className="text-red-500">Удалить</button>
              </div>
            ))}
            <div className="p-4 text-right font-bold border-t">Итого: 45 €</div>
          </div>
        )}
      </div>
    </div>
  )
}

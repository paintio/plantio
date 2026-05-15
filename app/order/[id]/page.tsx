'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface OrderItem {
  listingId: string
  quantity: number
  price: number
  listing?: {
    id: string
    title: string
    image: string
    city: string
    description: string
    price: number
  }
}

interface Order {
  id: string
  total: number
  status: string
  items: OrderItem[]
  promocode: string | null
  discount: number
  userId: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  city: string
}

export default function OrderPage() {
  const params = useParams()
  const id = params?.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`)
      if (!res.ok) throw new Error('Заказ не найден')
      const data = await res.json()
      setOrder(data)
      
      // Загружаем пользователя
      const usersRes = await fetch('/api/admin?action=users')
      const users = await usersRes.json()
      const orderUser = users.find((u: any) => u.id === data.userId)
      setUser(orderUser)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      pending: '⏳ Ожидает оплаты',
      paid: '✅ Оплачен',
      shipped: '🚚 Отправлен',
      delivered: '📦 Доставлен',
      cancelled: '❌ Отменен'
    }
    return statuses[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      shipped: 'bg-blue-100 text-blue-700',
      delivered: 'bg-purple-100 text-purple-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Заказ не найден</h1>
          <Link href="/" className="text-gray-500 hover:text-gray-700">← На главную</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-gray-900">🌿 Plantio</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">Заказ #{order.id.slice(-8)}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Информация */}
            <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
              <div><div className="text-sm text-gray-400">Дата заказа</div><div className="font-medium">{formatDate(order.createdAt)}</div></div>
              <div><div className="text-sm text-gray-400">Сумма</div><div className="text-2xl font-semibold text-gray-900">{order.total} €</div></div>
            </div>

            {/* Товары */}
            <h2 className="text-sm font-medium text-gray-900 mb-3">Товары</h2>
            <div className="space-y-3 mb-6">
              {order.items.map((item, idx) => {
                const listing = item.listing || {}
                return (
                  <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={(listing as any).image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'} 
                      alt={(listing as any).title || 'Товар'}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{(listing as any).title || 'Товар'}</div>
                      <div className="text-sm text-gray-500">{(listing as any).city || ''}</div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-semibold text-gray-900">{item.price} €</span>
                        <span className="text-sm text-gray-400">× {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Итого */}
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Итого</span>
                <span className="text-green-600">{order.total} €</span>
              </div>
            </div>

            {/* Кнопки */}
            <div className="mt-6 flex gap-3">
              <Link href="/" className="flex-1 text-center border border-gray-200 py-2 rounded-lg text-sm hover:bg-gray-50">Продолжить покупки</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

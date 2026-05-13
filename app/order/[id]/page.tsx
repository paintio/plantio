'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { printInvoice } from '@/components/PrintInvoice'

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
    sellerType?: string
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
  const router = useRouter()
  const id = params?.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (id) {
      checkAuth()
      fetchOrder()
    }
  }, [id])

  const checkAuth = async () => {
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
    const data = await res.json()
    setCurrentUser(data.user)
  }

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/orders/${id}`)
      
      if (!res.ok) {
        throw new Error('Заказ не найден')
      }
      
      const data = await res.json()
      setOrder(data)
      
      // Загружаем информацию о пользователе
      const userRes = await fetch(`/api/admin?action=users`)
      const users = await userRes.json()
      const orderUser = users.find((u: any) => u.id === data.userId)
      setUser(orderUser)
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (newStatus: string) => {
    setUpdating(true)
    try {
      await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'order', id: order?.id, status: newStatus })
      })
      await fetchOrder()
      alert(`Статус заказа изменен на "${getStatusText(newStatus)}"`)
    } catch (error) {
      alert('Ошибка при изменении статуса')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      pending: 'Ожидает оплаты',
      paid: 'Оплачен',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменен'
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

  const handlePrintInvoice = () => {
    if (order && user) {
      printInvoice(order, user)
    }
  }

  const isAdmin = currentUser?.isAdmin === true

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Загрузка заказа...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-7xl mb-6">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Заказ не найден</h1>
          <p className="text-gray-500 mb-8">{error || 'Проверьте номер заказа'}</p>
          <Link href="/admin" className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition">
            Вернуться в админку
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              🌱 Plantio
            </Link>
            <div className="flex gap-4">
              <Link href="/admin" className="text-gray-600 hover:text-green-600 transition">
                ← Вернуться в админку
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Кнопки действий для админа */}
        <div className="mb-6 flex gap-3 flex-wrap justify-end">
          <button
            onClick={handlePrintInvoice}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            🖨️ Распечатать чек
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
          >
            📄 Распечатать накладную
          </button>
        </div>

        {/* Основная карточка заказа */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Шапка */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="text-green-100 text-sm mb-1">Номер заказа</p>
                <h1 className="text-2xl font-bold text-white font-mono tracking-wider">
                  #{order.id.slice(-12)}
                </h1>
              </div>
              <div className="flex gap-3 items-center">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                  disabled={updating}
                  className={`px-4 py-2 rounded-full font-semibold text-sm border-none focus:ring-2 focus:ring-white ${getStatusColor(order.status)}`}
                >
                  <option value="pending">⏳ Ожидает оплаты</option>
                  <option value="paid">✅ Оплачен</option>
                  <option value="shipped">🚚 Отправлен</option>
                  <option value="delivered">📦 Доставлен</option>
                  <option value="cancelled">❌ Отменен</option>
                </select>
                {updating && <span className="text-white text-sm">Обновление...</span>}
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Информация о заказе */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-6 border-b">
              <div>
                <p className="text-gray-400 text-sm mb-1">Дата заказа</p>
                <p className="font-semibold text-gray-800">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Сумма заказа</p>
                <p className="font-bold text-2xl text-green-600">{order.total.toFixed(2)} €</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Способ оплаты</p>
                <p className="font-semibold text-gray-800">Баланс счета</p>
              </div>
              {order.promocode && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Промокод</p>
                  <p className="font-mono font-semibold text-green-600">{order.promocode}</p>
                </div>
              )}
              {order.discount > 0 && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Скидка</p>
                  <p className="font-semibold text-red-500">{order.discount}%</p>
                </div>
              )}
            </div>

            {/* Информация о клиенте */}
            {user && (
              <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>👤</span> Информация о клиенте
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-500">Имя:</span> <span className="font-semibold">{user.name}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="font-semibold">{user.email}</span></div>
                  <div><span className="text-gray-500">Телефон:</span> <span className="font-semibold">{user.phone || 'Не указан'}</span></div>
                  <div><span className="text-gray-500">Город:</span> <span className="font-semibold">{user.city || 'Не указан'}</span></div>
                </div>
              </div>
            )}

            {/* Товары */}
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🛍️</span> Товары в заказе ({order.items.length})
            </h2>
            <div className="space-y-4 mb-8">
              {order.items.map((item, idx) => {
                const listing = item.listing || {}
                return (
                  <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                    <img 
                      src={listing.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'} 
                      alt={listing.title}
                      className="w-20 h-20 object-cover rounded-xl"
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6' }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{listing.title || 'Товар'}</h3>
                      {listing.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">{listing.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">📍 {listing.city || 'Город не указан'}</p>
                      <p className="text-xs text-gray-400">Продавец: {listing.sellerType === 'business' ? 'Бизнес' : 'Частное лицо'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">{item.price} €</p>
                      <p className="text-sm text-gray-500">× {item.quantity}</p>
                      <p className="text-xs text-gray-400 mt-1">= {item.price * item.quantity} €</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Итоговая сумма */}
            <div className="border-t pt-6">
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Товары ({order.items.length} шт)</span>
                  <span className="font-semibold">{order.total.toFixed(2)} €</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-sm text-red-500 mt-2">
                    <span>Скидка {order.discount}%</span>
                    <span>-{((order.total / (1 - order.discount / 100)) * order.discount / 100).toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-2xl font-bold mt-4 pt-4 border-t">
                  <span>Итого к оплате</span>
                  <span className="text-green-600">{order.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Дополнительная информация для админа */}
            <div className="mt-6 p-4 bg-gray-50 rounded-2xl text-sm">
              <h3 className="font-semibold mb-2">ℹ️ Дополнительная информация</h3>
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div>ID заказа: <span className="font-mono">{order.id}</span></div>
                <div>ID покупателя: <span className="font-mono">{order.userId}</span></div>
                <div>Дата создания: {formatDate(order.createdAt)}</div>
                <div>Последнее обновление: {formatDate(order.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

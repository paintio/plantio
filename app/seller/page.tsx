'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, TrendingUp, DollarSign, ShoppingBag, Eye, Plus, Edit, Trash2, BarChart3, LogOut, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function SellerPage() {
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings')
      const data = await res.json()
      setListings(data.listings || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteListing = async (id: number) => {
    if (confirm('Удалить товар?')) {
      await fetch(`/api/listings?id=${id}`, { method: 'DELETE' })
      fetchListings()
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Войдите чтобы увидеть кабинет</p>
          <Link href="/" className="text-green-600 hover:underline">На главную</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">🌱 Plantio</Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('user')
                  window.location.href = '/'
                }}
                className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Кабинет продавца</h1>
          <p className="text-gray-500 mt-1">Управляйте своими товарами и отслеживайте продажи</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border p-4">
            <DollarSign className="w-5 h-5 text-green-600 mb-2" />
            <div className="text-xl font-bold">0 €</div>
            <div className="text-xs text-gray-400">Выручка</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <ShoppingBag className="w-5 h-5 text-blue-600 mb-2" />
            <div className="text-xl font-bold">0</div>
            <div className="text-xs text-gray-400">Заказы</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <Eye className="w-5 h-5 text-yellow-600 mb-2" />
            <div className="text-xl font-bold">{listings.reduce((sum, l) => sum + (l.views || 0), 0)}</div>
            <div className="text-xs text-gray-400">Просмотры</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <Package className="w-5 h-5 text-purple-600 mb-2" />
            <div className="text-xl font-bold">{listings.length}</div>
            <div className="text-xs text-gray-400">Товары</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <Link href="/seller/analytics">
              <BarChart3 className="w-5 h-5 text-orange-600 mb-2" />
              <div className="text-xl font-bold">Аналитика</div>
              <div className="text-xs text-gray-400">Подробный отчёт →</div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Мои товары</h2>
            <Link href="/create" className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Добавить товар
            </Link>
          </div>
          
          {listings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">У вас пока нет товаров</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-6 py-3">Название</th>
                    <th className="px-6 py-3">Цена</th>
                    <th className="px-6 py-3">Город</th>
                    <th className="px-6 py-3">Просмотры</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {listings.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{item.title}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">{item.price} €</td>
                      <td className="px-6 py-4 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.city}</td>
                      <td className="px-6 py-4">{item.views || 0}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => deleteListing(item.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

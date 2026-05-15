'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, TrendingUp, DollarSign, ShoppingBag, Eye, Plus, Edit, Trash2, LogOut, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function SellerPage() {
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) setUser(JSON.parse(savedUser))
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/listings')
      const data = await res.json()
      setListings(data.listings || [])
    } catch (error) {
      console.error('Error fetching listings:', error)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Кабинет продавца</h1>
          <p className="text-gray-500 mt-1">Управляйте своими товарами и отслеживайте продажи</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-xs text-gray-400">Выручка</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">0 €</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-gray-400">Заказы</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-yellow-600" />
              <span className="text-xs text-gray-400">Просмотры</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{listings.reduce((sum, l) => sum + (l.views || 0), 0)}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-purple-600" />
              <span className="text-xs text-gray-400">Товары</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{listings.length}</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Мои товары</h2>
            <Link href="/create" className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> Добавить товар
            </Link>
          </div>
          
          {listings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              У вас пока нет товаров. Нажмите "Добавить товар"
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-6 py-3">Название</th>
                    <th className="px-6 py-3">Цена</th>
                    <th className="px-6 py-3">Город</th>
                    <th className="px-6 py-3">Просмотры</th>
                    <th className="px-6 py-3">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listings.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">{item.price} €</td>
                      <td className="px-6 py-4 text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.city}</td>
                      <td className="px-6 py-4 text-gray-500">{item.views || 0}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteListing(item.id)}
                          className="text-red-500 hover:text-red-600 transition"
                        >
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

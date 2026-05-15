'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, Package, ShoppingBag, Tag, Image, Ticket, Settings, Trash2, Eye, CheckCircle, XCircle, Clock, Edit, Plus } from 'lucide-react'

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [banners, setBanners] = useState([])
  const [promocodes, setPromocodes] = useState([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, listingsRes, ordersRes, categoriesRes, bannersRes, promocodesRes] = await Promise.all([
        fetch('/api/admin?action=stats'),
        fetch('/api/admin?action=users'),
        fetch('/api/admin?action=listings'),
        fetch('/api/admin?action=orders'),
        fetch('/api/admin?action=categories'),
        fetch('/api/admin?action=banners'),
        fetch('/api/admin?action=promocodes')
      ])
      setStats(await statsRes.json())
      setUsers(await usersRes.json())
      setListings(await listingsRes.json())
      setOrders(await ordersRes.json())
      setCategories(await categoriesRes.json())
      setBanners(await bannersRes.json())
      setPromocodes(await promocodesRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (type: string, id: string | number) => {
    if (confirm('Удалить?')) {
      await fetch(`/api/admin?action=${type}&id=${id}`, { method: 'DELETE' })
      fetchAllData()
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'listings', label: 'Товары', icon: Package },
    { id: 'orders', label: 'Заказы', icon: ShoppingBag },
    { id: 'categories', label: 'Категории', icon: Tag },
    { id: 'banners', label: 'Баннеры', icon: Image },
    { id: 'promocodes', label: 'Промокоды', icon: Ticket },
    { id: 'settings', label: 'Настройки', icon: Settings }
  ]

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      shipped: 'bg-blue-100 text-blue-700',
      delivered: 'bg-purple-100 text-purple-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Панель управления</h1>
        
        <div className="flex gap-2 border-b mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === tab.id ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold">{stats.totalUsers}</div><div className="text-gray-500">Пользователей</div></div>
            <div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold">{stats.totalListings}</div><div className="text-gray-500">Товаров</div></div>
            <div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold">{stats.totalOrders}</div><div className="text-gray-500">Заказов</div></div>
            <div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold text-green-600">{stats.totalRevenue?.toFixed(0) || 0} €</div><div className="text-gray-500">Выручка</div></div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-3">Имя</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Тип</th><th className="px-6 py-3">Баланс</th><th className="px-6 py-3">Действия</th></tr></thead>
              <tbody className="divide-y">
                {users.map((user: any) => (
                  <tr key={user.id}><td className="px-6 py-4">{user.name}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4">{user.userType === 'business' ? 'Бизнес' : 'Частное'}</td><td className="px-6 py-4">{user.balance} €</td><td className="px-6 py-4"><button onClick={() => deleteItem('user', user.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Listings */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-3">Название</th><th className="px-6 py-3">Цена</th><th className="px-6 py-3">Город</th><th className="px-6 py-3">Действия</th></tr></thead>
              <tbody className="divide-y">
                {listings.map((listing: any) => (
                  <tr key={listing.id}><td className="px-6 py-4">{listing.title}</td><td className="px-6 py-4">{listing.price} €</td><td className="px-6 py-4">{listing.city}</td><td className="px-6 py-4"><button onClick={() => deleteItem('listing', listing.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-3">№</th><th className="px-6 py-3">Сумма</th><th className="px-6 py-3">Статус</th><th className="px-6 py-3">Действия</th></tr></thead>
              <tbody className="divide-y">
                {orders.map((order: any) => (
                  <tr key={order.id}><td className="px-6 py-4">{order.id}</td><td className="px-6 py-4">{order.total} €</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(order.status)}`}>{order.status}</span></td><td className="px-6 py-4">—</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Categories */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-xl border p-6">
            <div className="space-y-2">
              {categories.map((cat: any) => (
                <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span>{cat.icon} {cat.name}</span><button onClick={() => deleteItem('category', cat.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div>
              ))}
            </div>
          </div>
        )}

        {/* Banners */}
        {activeTab === 'banners' && (
          <div className="bg-white rounded-xl border p-6">
            <div className="space-y-2">
              {banners.map((banner: any) => (
                <div key={banner.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><div className="font-medium">{banner.title}</div><div className="text-sm text-gray-500">{banner.subtitle}</div></div><button onClick={() => deleteItem('banner', banner.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div>
              ))}
            </div>
          </div>
        )}

        {/* Promocodes */}
        {activeTab === 'promocodes' && (
          <div className="bg-white rounded-xl border p-6">
            <div className="space-y-2">
              {promocodes.map((promo: any) => (
                <div key={promo.code} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><div className="font-medium">{promo.code}</div><div className="text-sm text-gray-500">Скидка {promo.discount}%</div></div><button onClick={() => deleteItem('promocode', promo.code)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border p-6">
            <p className="text-gray-500">Настройки в разработке</p>
          </div>
        )}
      </div>
    </div>
  )
}

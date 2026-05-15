'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, Users, Package, ShoppingBag, Trash2 } from 'lucide-react'

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin?action=users').then(r => r.json()),
      fetch('/api/admin?action=listings').then(r => r.json()),
      fetch('/api/admin?action=stats').then(r => r.json())
    ]).then(([usersData, listingsData, statsData]) => {
      setUsers(usersData)
      setListings(listingsData)
      setStats(statsData)
      setLoading(false)
    })
  }, [])

  const deleteItem = async (type: string, id: number) => {
    if (confirm('Удалить?')) {
      await fetch(`/api/admin?action=${type}&id=${id}`, { method: 'DELETE' })
      window.location.reload()
    }
  }

  if (loading) return <div className="text-center py-12">Загрузка...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Панель управления</h1>
        
        <div className="flex gap-2 border-b mb-8">
          {[
            { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
            { id: 'users', label: 'Пользователи', icon: Users },
            { id: 'listings', label: 'Товары', icon: Package }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium ${
                activeTab === tab.id ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold">{stats.totalUsers}</div><div className="text-gray-500">Пользователей</div></div>
            <div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold">{stats.totalListings}</div><div className="text-gray-500">Товаров</div></div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left">Имя</th><th className="px-6 py-3 text-left">Email</th><th className="px-6 py-3 text-left">Баланс</th><th className="px-6 py-3"></th></tr></thead>
              <tbody>{users.map((user: any) => (
                <tr key={user.id} className="border-t"><td className="px-6 py-4">{user.name}</td><td className="px-6 py-4">{user.email}<td><td className="px-6 py-4">{user.balance} €</td><td className="px-6 py-4"><button onClick={() => deleteItem('user', user.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left">Название</th><th className="px-6 py-3 text-left">Цена</th><th className="px-6 py-3 text-left">Город</th><th className="px-6 py-3"></th></tr></thead>
              <tbody>{listings.map((listing: any) => (
                <tr key={listing.id} className="border-t"><td className="px-6 py-4">{listing.title}</td><td className="px-6 py-4">{listing.price} €</td><td className="px-6 py-4">{listing.city}</td><td className="px-6 py-4"><button onClick={() => deleteItem('listing', listing.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

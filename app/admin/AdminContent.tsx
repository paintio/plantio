'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, Package, Trash2 } from 'lucide-react'

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
        <div className="flex gap-4 border-b mb-8">
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
            <div className="card"><div className="text-2xl font-bold">{stats.totalUsers}</div><div className="text-gray-500">Пользователей</div></div>
            <div className="card"><div className="text-2xl font-bold">{stats.totalListings}</div><div className="text-gray-500">Товаров</div></div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b"><th className="text-left py-2">Имя</th><th className="text-left py-2">Email</th><th className="text-left py-2">Тип</th><th className="text-left py-2">Баланс</th><th className="text-left py-2"></th></tr></thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b"><td className="py-2">{user.name}</td><td>{user.email}</td><td>{user.userType === 'business' ? 'Бизнес' : 'Частное'}</td><td>{user.balance} €</td><td><button onClick={() => deleteItem('user', user.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b"><th className="text-left py-2">Название</th><th className="text-left py-2">Цена</th><th className="text-left py-2">Город</th><th className="text-left py-2"></th></tr></thead>
              <tbody>
                {listings.map((listing: any) => (
                  <tr key={listing.id} className="border-b"><td className="py-2">{listing.title}</td><td>{listing.price} €</td><td>{listing.city}</td><td><button onClick={() => deleteItem('listing', listing.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

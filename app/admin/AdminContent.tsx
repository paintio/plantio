'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  LayoutDashboard, Users, Package, ShoppingBag, Tag, Settings,
  Shield, Trash2, Eye, CheckCircle, XCircle, Clock, Edit, Plus
} from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  userType: string
  balance: number
  isAdmin: boolean
}

interface Listing {
  id: number
  title: string
  price: number
  city: string
  views: number
  category: string
  moderationStatus: string
  sellerId: number
  sellerName?: string
}

export default function AdminContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [usersRes, listingsRes] = await Promise.all([
        fetch('/api/admin?action=users'),
        fetch('/api/admin?action=listings')
      ])
      
      const usersData = await usersRes.json()
      const listingsData = await listingsRes.json()
      
      setUsers(usersData)
      setListings(listingsData)
      setStats({ totalUsers: usersData.length, totalListings: listingsData.length })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (type: string, id: number) => {
    if (confirm('Удалить?')) {
      await fetch(`/api/admin?action=${type}&id=${id}`, { method: 'DELETE' })
      fetchAllData()
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'listings', label: 'Товары', icon: Package }
  ]

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-1 border-b mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition font-medium ${
                activeTab === tab.id ? 'bg-white text-gray-900 border-t border-l border-r border-gray-100' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && stats && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-semibold">{stats.totalUsers}</div><div className="text-sm text-gray-500">Пользователей</div></div>
            <div className="bg-white rounded-xl border p-5"><div className="text-2xl font-semibold">{stats.totalListings}</div><div className="text-sm text-gray-500">Товаров</div></div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3">Имя</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Тип</th><th className="px-6 py-3">Баланс</th><th className="px-6 py-3">Действия</th></tr></thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t"><td className="px-6 py-4">{user.name}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4">{user.userType === 'business' ? 'Бизнес' : 'Частное'}</td><td className="px-6 py-4">{user.balance} €</td><td className="px-6 py-4"><button onClick={() => deleteItem('user', user.id)} className="text-red-500">Удалить</button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3">Название</th><th className="px-6 py-3">Цена</th><th className="px-6 py-3">Город</th><th className="px-6 py-3">Действия</th></tr></thead>
              <tbody>
                {listings.map(listing => (
                  <tr key={listing.id} className="border-t"><td className="px-6 py-4">{listing.title}</td><td className="px-6 py-4">{listing.price} €</td><td className="px-6 py-4">{listing.city}</td><td className="px-6 py-4"><button onClick={() => deleteItem('listing', listing.id)} className="text-red-500">Удалить</button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

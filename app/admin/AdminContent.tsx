'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, Package, Trash2 } from 'lucide-react'

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [usersRes, listingsRes] = await Promise.all([
      fetch('/api/admin?action=users'),
      fetch('/api/listings')
    ])
    setUsers(await usersRes.json())
    const listingsData = await listingsRes.json()
    setListings(listingsData.listings || [])
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-center">Загрузка...</div>

  return (
    <div className="p-6">
      <div className="flex gap-4 border-b mb-6">
        <button onClick={() => setActiveTab('dashboard')} className={`pb-2 px-2 ${activeTab === 'dashboard' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500'}`}>Дашборд</button>
        <button onClick={() => setActiveTab('users')} className={`pb-2 px-2 ${activeTab === 'users' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500'}`}>Пользователи</button>
        <button onClick={() => setActiveTab('listings')} className={`pb-2 px-2 ${activeTab === 'listings' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500'}`}>Товары</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border"><div className="text-2xl font-bold">{users.length}</div><div>Пользователей</div></div>
          <div className="bg-white p-4 rounded-lg border"><div className="text-2xl font-bold">{listings.length}</div><div>Товаров</div></div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Имя</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Действия</th></tr></thead>
          <tbody>{users.map((u: any) => <tr key={u.id} className="border-t"><td className="p-3">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3"><button className="text-red-500">Удалить</button></td></tr>)}</tbody></table>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Название</th><th className="p-3 text-left">Цена</th><th className="p-3 text-left">Город</th><th className="p-3 text-left">Действия</th></tr></thead>
          <tbody>{listings.map((l: any) => <tr key={l.id} className="border-t"><td className="p-3">{l.title}</td><td className="p-3">{l.price} €</td><td className="p-3">{l.city}</td><td className="p-3"><button className="text-red-500">Удалить</button></td></tr>)}</tbody></table>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, listingsRes, ordersRes, categoriesRes] = await Promise.all([
          fetch('/api/admin?action=users'),
          fetch('/api/admin?action=listings'),
          fetch('/api/admin?action=orders'),
          fetch('/api/categories')
        ])
        setUsers(await usersRes.json())
        setListings(await listingsRes.json())
        setOrders(await ordersRes.json())
        setCategories(await categoriesRes.json())
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const deleteItem = async (type: string, id: number) => {
    if (confirm('Удалить?')) {
      await fetch(`/api/admin?action=${type}&id=${id}`, { method: 'DELETE' })
      window.location.reload()
    }
  }

  if (loading) {
    return <div className="text-center py-12">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Панель управления</h1>
        
        <div className="flex gap-4 border-b mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
          >
            Дашборд
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
          >
            Пользователи
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 font-medium ${activeTab === 'listings' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
          >
            Товары
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
          >
            Заказы
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 font-medium ${activeTab === 'categories' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
          >
            Категории
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border p-6">
              <div className="text-2xl font-bold">{users.length}</div>
              <div className="text-gray-500">Пользователей</div>
            </div>
            <div className="bg-white rounded-xl border p-6">
              <div className="text-2xl font-bold">{listings.length}</div>
              <div className="text-gray-500">Товаров</div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">Имя</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Баланс</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.balance} €</td>
                    <td className="px-6 py-4">
                      <button onClick={() => deleteItem('user', user.id)} className="text-red-500 hover:text-red-600">
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">Название</th>
                  <th className="px-6 py-3 text-left">Цена</th>
                  <th className="px-6 py-3 text-left">Город</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing: any) => (
                  <tr key={listing.id} className="border-t">
                    <td className="px-6 py-4">{listing.title}</td>
                    <td className="px-6 py-4">{listing.price} €</td>
                    <td className="px-6 py-4">{listing.city}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => deleteItem('listing', listing.id)} className="text-red-500 hover:text-red-600">
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Сумма</th>
                  <th className="px-6 py-3 text-left">Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-6 py-4">{order.id}</td>
                    <td className="px-6 py-4">{order.total} €</td>
                    <td className="px-6 py-4">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-3 gap-4">
            {categories.map((cat: any) => (
              <div key={cat.id} className="bg-white rounded-xl border p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                </div>
                <button onClick={() => deleteItem('category', cat.id)} className="text-red-500">
                  Удалить
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

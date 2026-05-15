'use client'

import { useState, useEffect } from 'react'
import { LayoutDashboard, Users, Package, ShoppingBag, Tag, Image, Ticket, Settings, Trash2, Edit, Plus } from 'lucide-react'

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', icon: '' })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
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
      setStats({
        totalUsers: (await usersRes.json()).length,
        totalListings: (await listingsRes.json()).length,
        totalOrders: (await ordersRes.json()).length
      })
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

  const addCategory = async () => {
    await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory)
    })
    setShowModal(false)
    setNewCategory({ name: '', slug: '', icon: '' })
    fetchAllData()
  }

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'listings', label: 'Товары', icon: Package },
    { id: 'orders', label: 'Заказы', icon: ShoppingBag },
    { id: 'categories', label: 'Категории', icon: Tag }
  ]

  if (loading) return <div className="text-center py-12">Загрузка...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Панель управления</h1>
        
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6"><div className="text-3xl font-bold text-green-600">{stats.totalUsers}</div><div className="text-gray-500 mt-1">Пользователей</div></div>
            <div className="bg-white rounded-xl shadow-sm border p-6"><div className="text-3xl font-bold text-blue-600">{stats.totalListings}</div><div className="text-gray-500 mt-1">Товаров</div></div>
            <div className="bg-white rounded-xl shadow-sm border p-6"><div className="text-3xl font-bold text-purple-600">{stats.totalOrders}</div><div className="text-gray-500 mt-1">Заказов</div></div>
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-3">Имя</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Тип</th><th className="px-6 py-3">Баланс</th><th className="px-6 py-3"></th></tr></thead>
                <tbody className="divide-y">
                  {users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-medium">{user.name}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4">{user.userType === 'business' ? 'Бизнес' : 'Частное'}</td><td className="px-6 py-4 font-semibold">{user.balance} €</td><td className="px-6 py-4"><button onClick={() => deleteItem('user', user.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listings */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-3">Название</th><th className="px-6 py-3">Цена</th><th className="px-6 py-3">Город</th><th className="px-6 py-3">Просмотры</th><th className="px-6 py-3"></th></tr></thead>
                <tbody className="divide-y">
                  {listings.map((listing: any) => (
                    <tr key={listing.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-medium">{listing.title}<td><td className="px-6 py-4 text-green-600 font-semibold">{listing.price} €</td><td className="px-6 py-4">{listing.city}<td><td className="px-6 py-4">{listing.views || 0}</td><td className="px-6 py-4"><button onClick={() => deleteItem('listing', listing.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-3">№</th><th className="px-6 py-3">Сумма</th><th className="px-6 py-3">Статус</th><th className="px-6 py-3">Дата</th></tr></thead>
                <tbody className="divide-y">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-mono">{order.id}</td><td className="px-6 py-4 font-semibold">{order.total} €</td><td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">{order.status}</span></td><td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td></tr>
                  ))}
                </tbody>
             </table>
            </div>
          </div>
        )}

        {/* Categories */}
        {activeTab === 'categories' && (
          <div>
            <button onClick={() => setShowModal(true)} className="mb-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> Добавить категорию
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((cat: any) => (
                <div key={cat.id} className="bg-white rounded-xl shadow-sm border p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3"><span className="text-3xl">{cat.icon}</span><div><div className="font-semibold">{cat.name}</div><div className="text-sm text-gray-500">{cat.slug}</div></div></div>
                  <button onClick={() => deleteItem('category', cat.id)} className="text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Add Category */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Новая категория</h2>
            <input type="text" placeholder="Название" className="w-full px-3 py-2 border rounded-lg mb-3" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} />
            <input type="text" placeholder="Slug" className="w-full px-3 py-2 border rounded-lg mb-3" value={newCategory.slug} onChange={e => setNewCategory({...newCategory, slug: e.target.value})} />
            <input type="text" placeholder="Иконка (эмодзи)" className="w-full px-3 py-2 border rounded-lg mb-4" value={newCategory.icon} onChange={e => setNewCategory({...newCategory, icon: e.target.value})} />
            <div className="flex gap-3"><button onClick={addCategory} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Создать</button><button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 py-2 rounded-lg">Отмена</button></div>
          </div>
        </div>
      )}
    </div>
  )
}

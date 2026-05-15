'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/AdminHeader'
import AdminSidebar from '@/components/AdminSidebar'
import { Pencil, Trash2, Plus, Eye, CheckCircle, XCircle } from 'lucide-react'

// Модальное окно
function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

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
  
  // Modal states
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [formData, setFormData] = useState({})

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [usersRes, listingsRes, ordersRes, categoriesRes, bannersRes, promocodesRes, statsRes] = await Promise.all([
        fetch('/api/admin?action=users').then(r => r.json()),
        fetch('/api/admin?action=listings').then(r => r.json()),
        fetch('/api/admin?action=orders').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/admin?action=banners').then(r => r.json()),
        fetch('/api/admin?action=promocodes').then(r => r.json()),
        fetch('/api/admin?action=stats').then(r => r.json())
      ])
      setUsers(usersRes)
      setListings(listingsRes)
      setOrders(ordersRes)
      setCategories(categoriesRes)
      setBanners(bannersRes)
      setPromocodes(promocodesRes)
      setStats(statsRes)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type: string, id: number | string) => {
    if (confirm('Удалить?')) {
      await fetch(`/api/admin?action=${type}&id=${id}`, { method: 'DELETE' })
      fetchAllData()
    }
  }

  const handleSave = async () => {
    const url = modalType === 'category' ? '/api/categories' : `/api/admin?action=${modalType}`
    const method = editingItem ? 'PUT' : 'POST'
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem || formData)
    })
    if (res.ok) {
      setShowModal(false)
      setEditingItem(null)
      fetchAllData()
    }
  }

  const openAddModal = (type: string) => {
    setModalType(type)
    setEditingItem(null)
    setFormData({})
    setShowModal(true)
  }

  const openEditModal = (type: string, item: any) => {
    setModalType(type)
    setEditingItem(item)
    setShowModal(true)
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title={activeTab === 'dashboard' ? 'Панель управления' : activeTab} />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
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
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Пользователи</h2>
                <button onClick={() => openAddModal('user')} className="btn-primary !py-1.5 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-3">Имя</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Тип</th><th className="px-6 py-3">Баланс</th><th className="px-6 py-3"></th></tr></thead>
                  <tbody className="divide-y">
                    {users.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-medium">{user.name}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4">{user.userType === 'business' ? 'Бизнес' : 'Частное'}</td><td className="px-6 py-4">{user.balance} €</td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => openEditModal('user', user)} className="text-blue-500"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete('user', user.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Listings */}
          {activeTab === 'listings' && (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Товары</h2>
                <button onClick={() => openAddModal('listing')} className="btn-primary !py-1.5 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-3">Название</th><th className="px-6 py-3">Цена</th><th className="px-6 py-3">Город</th><th className="px-6 py-3">Просмотры</th><th className="px-6 py-3"></th></tr></thead>
                  <tbody className="divide-y">
                    {listings.map((listing: any) => (
                      <tr key={listing.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-medium">{listing.title}</td><td className="px-6 py-4 text-green-600 font-semibold">{listing.price} €</td><td className="px-6 py-4">{listing.city}</td><td className="px-6 py-4">{listing.views || 0}</td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => openEditModal('listing', listing)} className="text-blue-500"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete('listing', listing.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 border-b"><h2 className="text-lg font-semibold">Заказы</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-3">ID</th><th className="px-6 py-3">Сумма</th><th className="px-6 py-3">Статус</th><th className="px-6 py-3">Дата</th><th className="px-6 py-3"></th></tr></thead>
                  <tbody className="divide-y">
                    {orders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-mono">{order.id}</td><td className="px-6 py-4 font-semibold">{order.total} €</td><td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">{order.status}</span></td><td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td><td className="px-6 py-4"><button className="text-blue-500"><Eye className="w-4 h-4" /></button></td></tr>
                    ))}
                  </tbody>
                <table>
              </div>
            </div>
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Категории</h2>
                <button onClick={() => openAddModal('category')} className="btn-primary !py-1.5 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3"><span className="text-2xl">{cat.icon}</span><div><div className="font-medium">{cat.name}</div><div className="text-sm text-gray-500">{cat.slug}</div></div></div>
                    <div className="flex gap-2"><button onClick={() => openEditModal('category', cat)} className="text-blue-500"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete('category', cat.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Banners */}
          {activeTab === 'banners' && (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Баннеры</h2>
                <button onClick={() => openAddModal('banner')} className="btn-primary !py-1.5 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {banners.map((banner: any) => (
                  <div key={banner.id} className="border rounded-lg overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-500 relative">
                      <img src={banner.image} className="w-full h-full object-cover opacity-30" />
                      <div className="absolute inset-0 p-4 text-white"><h3 className="font-bold">{banner.title}</h3><p className="text-sm opacity-90">{banner.subtitle}</p></div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{banner.active ? 'Активен' : 'Неактивен'}</span>
                      <div className="flex gap-2"><button onClick={() => openEditModal('banner', banner)} className="text-blue-500"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete('banner', banner.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promocodes */}
          {activeTab === 'promocodes' && (
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Промокоды</h2>
                <button onClick={() => openAddModal('promocode')} className="btn-primary !py-1.5 text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-3">Код</th><th className="px-6 py-3">Скидка</th><th className="px-6 py-3">Действует до</th><th className="px-6 py-3"></th></tr></thead>
                  <tbody className="divide-y">
                    {promocodes.map((promo: any) => (
                      <tr key={promo.code} className="hover:bg-gray-50"><td className="px-6 py-4 font-mono font-bold">{promo.code}</td><td className="px-6 py-4">{promo.discount}%</td><td className="px-6 py-4 text-gray-500">{new Date(promo.expires).toLocaleDateString()}</td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => openEditModal('promocode', promo)} className="text-blue-500"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete('promocode', promo.code)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal for Add/Edit */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={`${editingItem ? 'Редактировать' : 'Добавить'} ${modalType}`}>
        <div className="space-y-4">
          {modalType === 'user' && (
            <>
              <input className="input" placeholder="Имя" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
              <input className="input" placeholder="Email" value={editingItem?.email || ''} onChange={e => setEditingItem({...editingItem, email: e.target.value})} />
              <input className="input" placeholder="Баланс" type="number" value={editingItem?.balance || 0} onChange={e => setEditingItem({...editingItem, balance: parseFloat(e.target.value)})} />
              <select className="input" value={editingItem?.userType || 'private'} onChange={e => setEditingItem({...editingItem, userType: e.target.value})}>
                <option value="private">Частное лицо</option><option value="business">Бизнес</option>
              </select>
            </>
          )}
          {modalType === 'category' && (
            <>
              <input className="input" placeholder="Название" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
              <input className="input" placeholder="Slug" value={editingItem?.slug || ''} onChange={e => setEditingItem({...editingItem, slug: e.target.value})} />
              <input className="input" placeholder="Иконка (эмодзи)" value={editingItem?.icon || '🌿'} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} />
            </>
          )}
          {modalType === 'promocode' && (
            <>
              <input className="input" placeholder="Код" value={editingItem?.code || ''} onChange={e => setEditingItem({...editingItem, code: e.target.value.toUpperCase()})} />
              <input className="input" placeholder="Скидка %" type="number" value={editingItem?.discount || 10} onChange={e => setEditingItem({...editingItem, discount: parseInt(e.target.value)})} />
              <input className="input" type="date" value={editingItem?.expires?.split('T')[0] || ''} onChange={e => setEditingItem({...editingItem, expires: e.target.value})} />
            </>
          )}
          <div className="flex gap-3 pt-4">
            <button onClick={handleSave} className="btn-primary flex-1">Сохранить</button>
            <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Отмена</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

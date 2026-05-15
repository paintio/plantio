'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])
  const [banners, setBanners] = useState([])
  const [promocodes, setPromocodes] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [usersRes, listingsRes, categoriesRes, bannersRes, promocodesRes, ordersRes, statsRes] = await Promise.all([
        fetch('/api/admin?action=users').then(r => r.json()),
        fetch('/api/admin?action=listings').then(r => r.json()),
        fetch('/api/admin?action=categories').then(r => r.json()),
        fetch('/api/admin?action=banners').then(r => r.json()),
        fetch('/api/admin?action=promocodes').then(r => r.json()),
        fetch('/api/admin?action=orders').then(r => r.json()),
        fetch('/api/admin?action=stats').then(r => r.json())
      ])
      setUsers(usersRes)
      setListings(listingsRes)
      setCategories(categoriesRes)
      setBanners(bannersRes)
      setPromocodes(promocodesRes)
      setOrders(ordersRes)
      setStats(statsRes)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type: string, id: any) => {
    if (confirm('Удалить?')) {
      await fetch(`/api/admin?action=${type}&id=${id}`, { method: 'DELETE' })
      fetchAllData()
    }
  }

  const handleSave = async () => {
    const url = `/api/admin?action=${modalType}`
    const method = editingItem?.id ? 'PUT' : 'POST'
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    })
    if (res.ok) {
      setShowModal(false)
      setEditingItem(null)
      fetchAllData()
    }
  }

  const openModal = (type: string, item: any = null) => {
    setModalType(type)
    setEditingItem(item || {})
    setShowModal(true)
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <div><span className="text-2xl">🌱</span><h1 className="text-xl font-semibold inline ml-2">Админ-панель</h1></div>
          <Link href="/" className="text-sm text-gray-500">На сайт</Link>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r min-h-screen p-4">
          <div className="space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>📊 Дашборд</button>
            <button onClick={() => setActiveTab('users')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>👥 Пользователи</button>
            <button onClick={() => setActiveTab('listings')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'listings' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>🌿 Товары</button>
            <button onClick={() => setActiveTab('categories')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'categories' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>🏷️ Категории</button>
            <button onClick={() => setActiveTab('banners')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'banners' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>🎨 Баннеры</button>
            <button onClick={() => setActiveTab('promocodes')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'promocodes' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>🎫 Промокоды</button>
            <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'orders' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>📦 Заказы</button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && stats && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Обзор</h2>
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div><div>Пользователей</div></div>
                <div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold text-green-600">{stats.totalListings}</div><div>Товаров</div></div>
                <div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold text-purple-600">{stats.totalOrders}</div><div>Заказов</div></div>
                <div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold text-yellow-600">{stats.totalRevenue} €</div><div>Выручка</div></div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">Пользователи</h2><button onClick={() => openModal('user')} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Добавить</button></div>
              <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3">ID</th><th className="px-6 py-3">Имя</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Тип</th><th className="px-6 py-3">Баланс</th><th></th></tr></thead><tbody>{users.map((user: any) => (<tr key={user.id} className="border-t"><td className="px-6 py-4">{user.id}</td><td className="px-6 py-4">{user.name}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4">{user.userType === 'business' ? 'Бизнес' : 'Частное'}</td><td className="px-6 py-4">{user.balance} €</td><td><button onClick={() => openModal('user', user)} className="text-blue-500 mr-2">✏️</button><button onClick={() => handleDelete('user', user.id)} className="text-red-500">🗑️</button></td></tr>))}</tbody></table></div>
            </div>
          )}

          {/* Listings */}
          {activeTab === 'listings' && (
            <div>
              <div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">Товары</h2><button onClick={() => openModal('listing')} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Добавить</button></div>
              <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3">ID</th><th className="px-6 py-3">Название</th><th className="px-6 py-3">Цена</th><th className="px-6 py-3">Город</th><th></th></table></thead><tbody>{listings.map((listing: any) => (<tr key={listing.id} className="border-t"><td className="px-6 py-4">{listing.id}</td><td className="px-6 py-4">{listing.title}<td><td className="px-6 py-4">{listing.price} €</td><td className="px-6 py-4">{listing.city}</td><td><button onClick={() => openModal('listing', listing)} className="text-blue-500 mr-2">✏️</button><button onClick={() => handleDelete('listing', listing.id)} className="text-red-500">🗑️</button></td></tr>))}</tbody></table></div>
            </div>
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">Категории</h2><button onClick={() => openModal('category')} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Добавить</button></div>
              <div className="grid grid-cols-3 gap-4">{categories.map((cat: any) => (<div key={cat.id} className="bg-white rounded-xl border p-4 flex justify-between items-center"><div><span className="text-2xl">{cat.icon || '📁'}</span><span className="font-semibold ml-2">{cat.name}</span><div className="text-sm text-gray-500">{cat.slug}</div></div><div><button onClick={() => openModal('category', cat)} className="text-blue-500 mr-2">✏️</button><button onClick={() => handleDelete('category', cat.id)} className="text-red-500">🗑️</button></div></div>))}</div>
            </div>
          )}

          {/* Banners */}
          {activeTab === 'banners' && (
            <div>
              <div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">Баннеры</h2><button onClick={() => openModal('banner')} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Добавить</button></div>
              <div className="grid grid-cols-2 gap-6">{banners.map((banner: any) => (<div key={banner.id} className="bg-white rounded-xl border overflow-hidden"><div className="h-32 bg-gradient-to-r from-green-500 to-emerald-500 relative">{banner.image && <img src={banner.image} className="w-full h-full object-cover opacity-30" />}<div className="absolute inset-0 p-4 text-white"><h3 className="font-bold">{banner.title}</h3><p className="text-sm">{banner.subtitle}</p></div></div><div className="p-4 flex justify-between items-center"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">{banner.active ? 'Активен' : 'Неактивен'}</span><div><button onClick={() => openModal('banner', banner)} className="text-blue-500 mr-2">✏️</button><button onClick={() => handleDelete('banner', banner.id)} className="text-red-500">🗑️</button></div></div></div>))}</div>
            </div>
          )}

          {/* Promocodes */}
          {activeTab === 'promocodes' && (
            <div>
              <div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">Промокоды</h2><button onClick={() => openModal('promocode')} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Добавить</button></div>
              <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3">Код</th><th className="px-6 py-3">Скидка</th><th className="px-6 py-3">Действует до</th><th></th></tr></thead><tbody>{promocodes.map((promo: any) => (<tr key={promo.code} className="border-t"><td className="px-6 py-4 font-mono font-bold">{promo.code}</td><td className="px-6 py-4">{promo.discount}%</td><td className="px-6 py-4">{new Date(promo.expires).toLocaleDateString()}</td><td><button onClick={() => openModal('promocode', promo)} className="text-blue-500 mr-2">✏️</button><button onClick={() => handleDelete('promocode', promo.code)} className="text-red-500">🗑️</button></td></tr>))}</tbody></table></div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Заказы</h2>
              <div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3">ID</th><th className="px-6 py-3">Сумма</th><th className="px-6 py-3">Статус</th><th className="px-6 py-3">Дата</th><th></th></tr></thead><tbody>{orders.map((order: any) => (<tr key={order.id} className="border-t"><td className="px-6 py-4">{order.id}</td><td className="px-6 py-4">{order.total} €</td><td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">{order.status}</span></td><td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td><td><button className="text-blue-500">📋</button></td></tr>))}</tbody></table></div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">{editingItem?.id ? 'Редактировать' : 'Добавить'} {modalType}</h2><button onClick={() => setShowModal(false)}>✕</button></div>
            <div className="space-y-3">
              {modalType === 'user' && (<><input className="w-full px-3 py-2 border rounded" placeholder="Имя" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Email" value={editingItem?.email || ''} onChange={e => setEditingItem({...editingItem, email: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Пароль" type="password" value={editingItem?.password || ''} onChange={e => setEditingItem({...editingItem, password: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Баланс" type="number" value={editingItem?.balance || 0} onChange={e => setEditingItem({...editingItem, balance: parseFloat(e.target.value)})} /><select className="w-full px-3 py-2 border rounded" value={editingItem?.userType || 'private'} onChange={e => setEditingItem({...editingItem, userType: e.target.value})}><option value="private">Частное лицо</option><option value="business">Бизнес</option></select></>)}
              {modalType === 'listing' && (<><div className="border rounded-lg p-4 bg-gray-50"><p className="text-sm font-medium mb-2">Фото товара</p><ImageUpload onImageUploaded={(url) => setEditingItem({...editingItem, image: url})} currentImage={editingItem?.image} /></div><input className="w-full px-3 py-2 border rounded" placeholder="Название" value={editingItem?.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} /><textarea className="w-full px-3 py-2 border rounded" rows={3} placeholder="Описание" value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Цена (€)" type="number" value={editingItem?.price || 0} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} /><input className="w-full px-3 py-2 border rounded" placeholder="Город" value={editingItem?.city || ''} onChange={e => setEditingItem({...editingItem, city: e.target.value})} /><select className="w-full px-3 py-2 border rounded" value={editingItem?.category || 'Комнатные'} onChange={e => setEditingItem({...editingItem, category: e.target.value})}><option>Комнатные</option><option>Суккуленты</option><option>Садовые</option></select></>)}
              {modalType === 'category' && (<><input className="w-full px-3 py-2 border rounded" placeholder="Название" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Slug" value={editingItem?.slug || ''} onChange={e => setEditingItem({...editingItem, slug: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Иконка (эмодзи)" value={editingItem?.icon || '🌿'} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} /></>)}
              {modalType === 'banner' && (<><div className="border rounded-lg p-4 bg-gray-50"><p className="text-sm font-medium mb-2">Изображение</p><ImageUpload onImageUploaded={(url) => setEditingItem({...editingItem, image: url})} currentImage={editingItem?.image} /></div><input className="w-full px-3 py-2 border rounded" placeholder="Заголовок" value={editingItem?.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Подзаголовок" value={editingItem?.subtitle || ''} onChange={e => setEditingItem({...editingItem, subtitle: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Ссылка" value={editingItem?.link || '/'} onChange={e => setEditingItem({...editingItem, link: e.target.value})} /></>)}
              {modalType === 'promocode' && (<><input className="w-full px-3 py-2 border rounded" placeholder="Код" value={editingItem?.code || ''} onChange={e => setEditingItem({...editingItem, code: e.target.value.toUpperCase()})} /><input className="w-full px-3 py-2 border rounded" placeholder="Скидка %" type="number" value={editingItem?.discount || 10} onChange={e => setEditingItem({...editingItem, discount: parseInt(e.target.value)})} /><input className="w-full px-3 py-2 border rounded" type="date" value={editingItem?.expires?.split('T')[0] || ''} onChange={e => setEditingItem({...editingItem, expires: e.target.value})} /></>)}
              <div className="flex gap-3 pt-4"><button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded">Сохранить</button><button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded">Отмена</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

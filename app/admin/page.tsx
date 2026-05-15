'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import { 
  LayoutDashboard, Users, Package, ShoppingBag, Tag, Image, Ticket,
  Trash2, Edit, Plus, Eye, X
} from 'lucide-react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [banners, setBanners] = useState([])
  const [promocodes, setPromocodes] = useState([])
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
      const [usersRes, listingsRes, ordersRes, categoriesRes, bannersRes, promocodesRes] = await Promise.all([
        fetch('/api/admin?action=users').then(r => r.json()),
        fetch('/api/admin?action=listings').then(r => r.json()),
        fetch('/api/admin?action=orders').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/admin?action=banners').then(r => r.json()),
        fetch('/api/admin?action=promocodes').then(r => r.json())
      ])
      setUsers(usersRes)
      setListings(listingsRes)
      setOrders(ordersRes)
      setCategories(categoriesRes)
      setBanners(bannersRes)
      setPromocodes(promocodesRes)
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
    const url = modalType === 'category' ? '/api/categories' : `/api/admin?action=${modalType}`
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

  const tabs = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'listings', label: 'Товары', icon: Package },
    { id: 'orders', label: 'Заказы', icon: ShoppingBag },
    { id: 'categories', label: 'Категории', icon: Tag },
    { id: 'banners', label: 'Баннеры', icon: Image },
    { id: 'promocodes', label: 'Промокоды', icon: Ticket },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <h1 className="text-xl font-semibold text-gray-900">Plantio Админ-панель</h1>
            </div>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">На сайт</Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Обзор</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border p-6"><div className="flex justify-between items-center mb-2"><Users className="w-8 h-8 text-blue-500" /><span className="text-2xl font-bold">{users.length}</span></div><p className="text-gray-500">Пользователей</p></div>
                <div className="bg-white rounded-xl border p-6"><div className="flex justify-between items-center mb-2"><Package className="w-8 h-8 text-green-500" /><span className="text-2xl font-bold">{listings.length}</span></div><p className="text-gray-500">Товаров</p></div>
                <div className="bg-white rounded-xl border p-6"><div className="flex justify-between items-center mb-2"><ShoppingBag className="w-8 h-8 text-purple-500" /><span className="text-2xl font-bold">{orders.length}</span></div><p className="text-gray-500">Заказов</p></div>
                <div className="bg-white rounded-xl border p-6"><div className="flex justify-between items-center mb-2"><Tag className="w-8 h-8 text-orange-500" /><span className="text-2xl font-bold">{categories.length}</span></div><p className="text-gray-500">Категорий</p></div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Пользователи</h2>
                <button onClick={() => openModal('user')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить</button>
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b"><tr className="text-left text-sm"><th className="px-6 py-3">ID</th><th className="px-6 py-3">Имя</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Тип</th><th className="px-6 py-3">Баланс</th><th className="px-6 py-3"></th></tr></thead>
                  <tbody className="divide-y">{users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm">{user.id}</td><td className="px-6 py-4 font-medium">{user.name}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs bg-gray-100">{user.userType === 'business' ? 'Бизнес' : 'Частное'}</span></td><td className="px-6 py-4">{user.balance} €</td><td className="px-6 py-4"><button onClick={() => openModal('user', user)} className="text-blue-500 mr-2"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete('user', user.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Товары</h2>
                <button onClick={() => openModal('listing')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить</button>
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b"><tr className="text-left text-sm"><th className="px-6 py-3">ID</th><th className="px-6 py-3">Название</th><th className="px-6 py-3">Цена</th><th className="px-6 py-3">Город</th><th className="px-6 py-3"></th></tr></thead>
                  <tbody className="divide-y">{listings.map((listing: any) => (
                    <tr key={listing.id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm">{listing.id}</td><td className="px-6 py-4 font-medium">{listing.title}</td><td className="px-6 py-4 text-green-600 font-semibold">{listing.price} €</td><td className="px-6 py-4">{listing.city}</td><td className="px-6 py-4"><button onClick={() => openModal('listing', listing)} className="text-blue-500 mr-2"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete('listing', listing.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td></td>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Заказы</h2>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full"><thead className="bg-gray-50 border-b"><tr className="text-left text-sm"><th className="px-6 py-3">ID</th><th className="px-6 py-3">Сумма</th><th className="px-6 py-3">Статус</th><th className="px-6 py-3">Дата</th></tr></thead>
                <tbody className="divide-y">{orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-mono text-sm">{order.id}</td><td className="px-6 py-4 font-semibold text-green-600">{order.total} €<td><td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">{order.status === 'paid' ? 'Оплачен' : order.status}</span></td><td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td></tr>
                ))}</tbody></tr>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Категории</h2>
                <button onClick={() => openModal('category')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="bg-white rounded-xl border p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3"><span className="text-2xl">{cat.icon || '📁'}</span><div><div className="font-semibold">{cat.name}</div><div className="text-sm text-gray-500">{cat.slug}</div></div></div>
                    <div className="flex gap-2"><button onClick={() => openModal('category', cat)} className="text-blue-500"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete('category', cat.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Баннеры</h2>
                <button onClick={() => openModal('banner')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner: any) => (
                  <div key={banner.id} className="bg-white rounded-xl border overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-500 relative">
                      {banner.image && <img src={banner.image} className="w-full h-full object-cover opacity-30" />}
                      <div className="absolute inset-0 p-4 text-white"><h3 className="font-bold">{banner.title}</h3><p className="text-sm opacity-90">{banner.subtitle}</p></div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{banner.active ? 'Активен' : 'Неактивен'}</span>
                      <div className="flex gap-2"><button onClick={() => openModal('banner', banner)} className="text-blue-500"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete('banner', banner.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'promocodes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Промокоды</h2>
                <button onClick={() => openModal('promocode')} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Добавить</button>
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full"><thead className="bg-gray-50 border-b"><tr className="text-left text-sm"><th className="px-6 py-3">Код</th><th className="px-6 py-3">Скидка</th><th className="px-6 py-3">Действует до</th><th className="px-6 py-3"></th></tr></thead>
                <tbody className="divide-y">{promocodes.map((promo: any) => (
                  <tr key={promo.code} className="hover:bg-gray-50"><td className="px-6 py-4 font-mono font-bold">{promo.code}<td><td className="px-6 py-4">{promo.discount}%</td><td className="px-6 py-4 text-gray-500">{new Date(promo.expires).toLocaleDateString()}</td><td className="px-6 py-4"><button onClick={() => openModal('promocode', promo)} className="text-blue-500 mr-2"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete('promocode', promo.code)} className="text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>
                ))}</tbody></table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold">{editingItem?.id ? 'Редактировать' : 'Добавить'} {modalType}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-4">
              {modalType === 'user' && (
                <>
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Имя" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Email" value={editingItem?.email || ''} onChange={e => setEditingItem({...editingItem, email: e.target.value})} />
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Пароль" type="password" value={editingItem?.password || ''} onChange={e => setEditingItem({...editingItem, password: e.target.value})} />
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Баланс" type="number" value={editingItem?.balance || 0} onChange={e => setEditingItem({...editingItem, balance: parseFloat(e.target.value)})} />
                  <select className="w-full px-3 py-2 border rounded-lg" value={editingItem?.userType || 'private'} onChange={e => setEditingItem({...editingItem, userType: e.target.value})}>
                    <option value="private">Частное лицо</option><option value="business">Бизнес</option>
                  </select>
                </>
              )}
              
              {modalType === 'listing' && (
                <>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-3">Фото товара</p>
                    <ImageUpload 
                      onImageUploaded={(url) => setEditingItem({...editingItem, image: url})}
                      currentImage={editingItem?.image}
                      label=""
                    />
                  </div>
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Название" value={editingItem?.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <textarea className="w-full px-3 py-2 border rounded-lg" rows={3} placeholder="Описание" value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Цена (€)" type="number" value={editingItem?.price || 0} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Город" value={editingItem?.city || ''} onChange={e => setEditingItem({...editingItem, city: e.target.value})} />
                  <select className="w-full px-3 py-2 border rounded-lg" value={editingItem?.category || 'Комнатные'} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                    <option>Комнатные</option><option>Суккуленты</option><option>Садовые</option><option>Редкие</option>
                  </select>
                </>
              )}
              
              {modalType === 'category' && (
                <>
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Название" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Slug" value={editingItem?.slug || ''} onChange={e => setEditingItem({...editingItem, slug: e.target.value})} />
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Иконка (эмодзи)" value={editingItem?.icon || '🌿'} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} />
                </>
              )}
              
              {modalType === 'banner' && (
                <>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-3">Изображение баннера</p>
                    <ImageUpload 
                      onImageUploaded={(url) => setEditingItem({...editingItem, image: url})}
                      currentImage={editingItem?.image}
                      label=""
                    />
                  </div>
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Заголовок" value={editingItem?.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Подзаголовок" value={editingItem?.subtitle || ''} onChange={e => setEditingItem({...editingItem, subtitle: e.target.value})} />
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Текст кнопки" value={editingItem?.buttonText || 'Купить'} onChange={e => setEditingItem({...editingItem, buttonText: e.target.value})} />
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Ссылка" value={editingItem?.link || '/'} onChange={e => setEditingItem({...editingItem, link: e.target.value})} />
                </>
              )}
              
              {modalType === 'promocode' && (
                <>
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Код" value={editingItem?.code || ''} onChange={e => setEditingItem({...editingItem, code: e.target.value.toUpperCase()})} />
                  <input className="w-full px-3 py-2 border rounded-lg" placeholder="Скидка %" type="number" value={editingItem?.discount || 10} onChange={e => setEditingItem({...editingItem, discount: parseInt(e.target.value)})} />
                  <input className="w-full px-3 py-2 border rounded-lg" type="date" value={editingItem?.expires?.split('T')[0] || ''} onChange={e => setEditingItem({...editingItem, expires: e.target.value})} />
                </>
              )}
              
              <div className="flex gap-3 pt-4">
                <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Сохранить</button>
                <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Отмена</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, Users, Package, ShoppingBag, Tag, Image, Ticket, Settings,
  Trash2, Edit, Plus, Eye, X, Check, AlertCircle, Search
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
  const [searchTerm, setSearchTerm] = useState('')

  // Загрузка данных
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

  // Фильтрация
  const filteredUsers = users.filter((u: any) => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const filteredListings = listings.filter((l: any) => 
    l.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🌱</span>
              <h1 className="text-xl font-semibold text-gray-900">Plantio Админ-панель</h1>
            </div>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition">
              На сайт
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Обзор</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-blue-500" />
                    <span className="text-2xl font-bold text-gray-900">{users.length}</span>
                  </div>
                  <p className="text-gray-500">Пользователей</p>
                </div>
                <div className="bg-white rounded-xl border p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 text-green-500" />
                    <span className="text-2xl font-bold text-gray-900">{listings.length}</span>
                  </div>
                  <p className="text-gray-500">Товаров</p>
                </div>
                <div className="bg-white rounded-xl border p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <ShoppingBag className="w-8 h-8 text-purple-500" />
                    <span className="text-2xl font-bold text-gray-900">{orders.length}</span>
                  </div>
                  <p className="text-gray-500">Заказов</p>
                </div>
                <div className="bg-white rounded-xl border p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Tag className="w-8 h-8 text-orange-500" />
                    <span className="text-2xl font-bold text-gray-900">{categories.length}</span>
                  </div>
                  <p className="text-gray-500">Категорий</p>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Пользователи</h2>
                <button
                  onClick={() => openModal('user')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Добавить
                </button>
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Имя</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Тип</th>
                      <th className="px-6 py-3">Баланс</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">{user.id}</td>
                        <td className="px-6 py-4 font-medium">{user.name}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.userType === 'business' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>
                            {user.userType === 'business' ? 'Бизнес' : 'Частное'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{user.balance} €</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => openModal('user', user)} className="text-blue-500 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete('user', user.id)} className="text-red-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Listings */}
          {activeTab === 'listings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Товары</h2>
                <button
                  onClick={() => openModal('listing')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Добавить
                </button>
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Название</th>
                      <th className="px-6 py-3">Цена</th>
                      <th className="px-6 py-3">Город</th>
                      <th className="px-6 py-3">Просмотры</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredListings.map((listing: any) => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-500">{listing.id}</td>
                        <td className="px-6 py-4 font-medium">{listing.title}</td>
                        <td className="px-6 py-4 text-green-600 font-semibold">{listing.price} €</td>
                        <td className="px-6 py-4">{listing.city}</td>
                        <td className="px-6 py-4">{listing.views || 0}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => openModal('listing', listing)} className="text-blue-500 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete('listing', listing.id)} className="text-red-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Заказы</h2>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Сумма</th>
                      <th className="px-6 py-3">Статус</th>
                      <th className="px-6 py-3">Дата</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                        <td className="px-6 py-4 font-semibold text-green-600">{order.total} €</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            {order.status === 'paid' ? 'Оплачен' : order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-500">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Категории</h2>
                <button
                  onClick={() => openModal('category')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Добавить
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat: any) => (
                  <div key={cat.id} className="bg-white rounded-xl border p-4 flex justify-between items-center hover:shadow-sm transition">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.icon || '📁'}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                        <p className="text-sm text-gray-500">{cat.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openModal('category', cat)} className="text-blue-500 hover:text-blue-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('category', cat.id)} className="text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Banners */}
          {activeTab === 'banners' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Баннеры</h2>
                <button
                  onClick={() => openModal('banner')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Добавить
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners.map((banner: any) => (
                  <div key={banner.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-sm transition">
                    <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-500 relative">
                      {banner.image && <img src={banner.image} className="w-full h-full object-cover opacity-30" />}
                      <div className="absolute inset-0 p-4 text-white">
                        <h3 className="font-bold text-lg">{banner.title}</h3>
                        <p className="text-sm opacity-90">{banner.subtitle}</p>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {banner.active ? 'Активен' : 'Неактивен'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => openModal('banner', banner)} className="text-blue-500 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('banner', banner.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promocodes */}
          {activeTab === 'promocodes' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Промокоды</h2>
                <button
                  onClick={() => openModal('promocode')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Добавить
                </button>
              </div>
              <div className="bg-white rounded-xl border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-left text-sm text-gray-500">
                      <th className="px-6 py-3">Код</th>
                      <th className="px-6 py-3">Скидка</th>
                      <th className="px-6 py-3">Действует до</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {promocodes.map((promo: any) => (
                      <tr key={promo.code} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono font-bold">{promo.code}</td>
                        <td className="px-6 py-4">{promo.discount}%</td>
                        <td className="px-6 py-4 text-gray-500">{new Date(promo.expires).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => openModal('promocode', promo)} className="text-blue-500 hover:text-blue-600">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete('promocode', promo.code)} className="text-red-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingItem?.id ? 'Редактировать' : 'Добавить'} {modalType}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {modalType === 'user' && (
                <>
                  <input className="input" placeholder="Имя" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                  <input className="input" placeholder="Email" value={editingItem?.email || ''} onChange={e => setEditingItem({...editingItem, email: e.target.value})} />
                  <input className="input" placeholder="Пароль" type="password" value={editingItem?.password || ''} onChange={e => setEditingItem({...editingItem, password: e.target.value})} />
                  <input className="input" placeholder="Баланс" type="number" value={editingItem?.balance || 0} onChange={e => setEditingItem({...editingItem, balance: parseFloat(e.target.value)})} />
                  <select className="input" value={editingItem?.userType || 'private'} onChange={e => setEditingItem({...editingItem, userType: e.target.value})}>
                    <option value="private">Частное лицо</option>
                    <option value="business">Бизнес</option>
                  </select>
                </>
              )}
              
              {modalType === 'listing' && (
                <>
                  <input className="input" placeholder="Название" value={editingItem?.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <textarea className="input" rows={3} placeholder="Описание" value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  <input className="input" placeholder="Цена (€)" type="number" value={editingItem?.price || 0} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
                  <input className="input" placeholder="Город" value={editingItem?.city || ''} onChange={e => setEditingItem({...editingItem, city: e.target.value})} />
                  <input className="input" placeholder="URL фото" value={editingItem?.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                  <select className="input" value={editingItem?.category || 'Комнатные'} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
                    <option>Комнатные</option><option>Суккуленты</option><option>Садовые</option>
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
              
              {modalType === 'banner' && (
                <>
                  <input className="input" placeholder="Заголовок" value={editingItem?.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <input className="input" placeholder="Подзаголовок" value={editingItem?.subtitle || ''} onChange={e => setEditingItem({...editingItem, subtitle: e.target.value})} />
                  <input className="input" placeholder="URL изображения" value={editingItem?.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
                  <input className="input" placeholder="Текст кнопки" value={editingItem?.buttonText || 'Купить'} onChange={e => setEditingItem({...editingItem, buttonText: e.target.value})} />
                  <input className="input" placeholder="Ссылка" value={editingItem?.link || '/'} onChange={e => setEditingItem({...editingItem, link: e.target.value})} />
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
          </div>
        </div>
      )}
    </div>
  )
}

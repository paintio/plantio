'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  LayoutDashboard, Users, Package, ShoppingBag, Tag, Image, Ticket, Settings,
  Shield, Trash2, Eye, CheckCircle, XCircle, Clock, Edit, Plus, X, Save,
  Phone, Mail, MapPin, DollarSign, MoreVertical
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface User {
  id: string
  name: string
  email: string
  phone: string
  city: string
  userType: 'private' | 'business'
  balance: number
  isAdmin: boolean
  isBlocked: boolean
  createdAt: string
}

interface Listing {
  id: string
  title: string
  description: string
  price: number
  city: string
  image: string
  category: string
  sellerId: string
  sellerName?: string
  isModerated: boolean
  moderationStatus: 'pending' | 'approved' | 'rejected'
  moderationReason?: string
  views: number
  createdAt: string
}

interface Order {
  id: string
  userId: string
  userName?: string
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  items: any[]
  createdAt: string
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  order: number
}

interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  buttonText: string
  link: string
  color: string
  active: boolean
  createdAt: string
}

interface Promocode {
  code: string
  discount: number
  expires: string
}

export default function AdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'dashboard')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [users, setUsers] = useState<User[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [promocodes, setPromocodes] = useState<Promocode[]>([])
  const [stats, setStats] = useState<any>(null)
  
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingListing, setEditingListing] = useState<Listing | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddBanner, setShowAddBanner] = useState(false)
  const [showAddPromocode, setShowAddPromocode] = useState(false)

  const [userForm, setUserForm] = useState({
    name: '', email: '', phone: '', city: '', userType: 'private', balance: 0, isAdmin: false, isBlocked: false
  })
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', icon: '', order: 0 })
  const [bannerForm, setBannerForm] = useState({
    title: '', subtitle: '', image: '', buttonText: 'Купить', link: '/', color: '#22c55e', active: true
  })
  const [promocodeForm, setPromocodeForm] = useState({ code: '', discount: 10, expires: '' })

  useEffect(() => {
    if (tabFromUrl) setActiveTab(tabFromUrl)
  }, [tabFromUrl])

  useEffect(() => {
    checkAuth()
    fetchAllData()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
    const data = await res.json()
    if (!data.user?.isAdmin) { router.push('/'); return }
    setCurrentUser(data.user)
  }

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, listingsRes, ordersRes, categoriesRes, bannersRes, promocodesRes] = await Promise.all([
        fetch('/api/admin?action=stats'),
        fetch('/api/admin?action=users'),
        fetch('/api/admin?action=listings'),
        fetch('/api/admin?action=orders'),
        fetch('/api/admin?action=categories'),
        fetch('/api/admin?action=banners'),
        fetch('/api/admin?action=promocodes')
      ])
      
      const listingsData = await listingsRes.json()
      const usersData = await usersRes.json()
      
      const listingsWithSeller = listingsData.map((l: any) => ({
        ...l,
        sellerName: usersData.find((u: any) => u.id === l.sellerId)?.name || 'Неизвестный'
      }))
      
      setStats(await statsRes.json())
      setUsers(usersData)
      setListings(listingsWithSeller)
      setOrders(await ordersRes.json())
      setCategories(await categoriesRes.json())
      setBanners(await bannersRes.json())
      setPromocodes(await promocodesRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async () => {
    if (!editingUser) return
    await fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'user', id: editingUser.id, ...userForm })
    })
    setEditingUser(null)
    fetchAllData()
  }

  const deleteUser = async (id: string) => {
    if (confirm('Удалить пользователя?')) {
      await fetch(`/api/admin?action=user&id=${id}`, { method: 'DELETE' })
      fetchAllData()
    }
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'order', id, status })
    })
    fetchAllData()
  }

  const deleteListing = async (id: string) => {
    if (confirm('Удалить объявление?')) {
      await fetch(`/api/admin?action=listing&id=${id}`, { method: 'DELETE' })
      fetchAllData()
    }
  }

  const moderateListing = async (listingId: string, status: 'approved' | 'rejected', reason?: string) => {
    const res = await fetch('/api/admin/moderate', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, status, reason: reason || '' })
    })
    if (res.ok) {
      fetchAllData()
      setShowRejectModal(false)
      setRejectReason('')
      setSelectedListing(null)
    }
  }

  const updateListing = async () => {
    if (!editingListing) return
    await fetch('/api/listings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingListing.id, title: editingListing.title, price: editingListing.price, city: editingListing.city, description: editingListing.description })
    })
    setEditingListing(null)
    fetchAllData()
  }

  const createCategory = async () => {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'category', ...categoryForm })
    })
    setShowAddCategory(false)
    setCategoryForm({ name: '', slug: '', icon: '', order: 0 })
    fetchAllData()
  }

  const updateCategory = async () => {
    if (!editingCategory) return
    await fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'category', id: editingCategory.id, ...categoryForm })
    })
    setEditingCategory(null)
    fetchAllData()
  }

  const deleteCategory = async (id: string) => {
    if (confirm('Удалить категорию?')) {
      await fetch(`/api/admin?action=category&id=${id}`, { method: 'DELETE' })
      fetchAllData()
    }
  }

  const createBanner = async () => {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'banner', ...bannerForm })
    })
    setShowAddBanner(false)
    setBannerForm({ title: '', subtitle: '', image: '', buttonText: 'Купить', link: '/', color: '#22c55e', active: true })
    fetchAllData()
  }

  const updateBanner = async () => {
    if (!editingBanner) return
    await fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'banner', id: editingBanner.id, ...bannerForm })
    })
    setEditingBanner(null)
    fetchAllData()
  }

  const deleteBanner = async (id: string) => {
    if (confirm('Удалить баннер?')) {
      await fetch(`/api/admin?action=banner&id=${id}`, { method: 'DELETE' })
      fetchAllData()
    }
  }

  const toggleBannerActive = async (id: string, active: boolean) => {
    await fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'banner', id, active: !active })
    })
    fetchAllData()
  }

  const createPromocode = async () => {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'promocode', ...promocodeForm, expires: new Date(promocodeForm.expires).toISOString() })
    })
    setShowAddPromocode(false)
    setPromocodeForm({ code: '', discount: 10, expires: '' })
    fetchAllData()
  }

  const deletePromocode = async (code: string) => {
    if (confirm('Удалить промокод?')) {
      await fetch(`/api/admin?action=promocode&id=${code}`, { method: 'DELETE' })
      fetchAllData()
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Обзор', icon: LayoutDashboard },
    { id: 'users', label: 'Пользователи', icon: Users },
    { id: 'listings', label: 'Товары', icon: Package },
    { id: 'orders', label: 'Заказы', icon: ShoppingBag },
    { id: 'categories', label: 'Категории', icon: Tag },
    { id: 'banners', label: 'Баннеры', icon: Image },
    { id: 'promocodes', label: 'Промокоды', icon: Ticket },
    { id: 'settings', label: 'Настройки', icon: Settings }
  ]

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { text: string; color: string }> = {
      pending: { text: 'Ожидает', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      paid: { text: 'Оплачен', color: 'bg-green-50 text-green-700 border-green-200' },
      shipped: { text: 'Отправлен', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      delivered: { text: 'Доставлен', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      cancelled: { text: 'Отменен', color: 'bg-red-50 text-red-700 border-red-200' }
    }
    return statuses[status] || { text: status, color: 'bg-gray-50 text-gray-700 border-gray-200' }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="text-xl font-semibold text-gray-900">Plantio</Link>
          <p className="text-xs text-gray-500 mt-1">Администрирование</p>
        </div>
        <nav className="p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); router.push(`/admin?tab=${tab.id}`) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === tab.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser?.name}</p>
              <p className="text-xs text-gray-500">Администратор</p>
            </div>
            <Link href="/" className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl">
          {/* Dashboard */}
          {activeTab === 'dashboard' && stats && (
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-8">Обзор</h1>
              <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</div><div className="text-sm text-gray-500 mt-1">Пользователей</div></div>
                <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="text-2xl font-semibold text-gray-900">{stats.totalListings}</div><div className="text-sm text-gray-500 mt-1">Товаров</div></div>
                <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</div><div className="text-sm text-gray-500 mt-1">Заказов</div></div>
                <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="text-2xl font-semibold text-green-600">{stats.totalRevenue?.toFixed(0) || 0} €</div><div className="text-sm text-gray-500 mt-1">Выручка</div></div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-medium text-gray-900 mb-4">Распределение по категориям</h2>
                <div className="space-y-3">
                  {Object.entries(stats.listingsByCategory || {}).map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-4">
                      <div className="w-32 text-sm text-gray-600">{cat}</div>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gray-900 rounded-full" style={{ width: `${(count as number / stats.totalListings) * 100}%` }} /></div>
                      <div className="text-sm font-medium text-gray-900 w-12 text-right">{count as number}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-semibold text-gray-900">Пользователи</h1><span className="text-sm text-gray-500">{users.length} всего</span></div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-left text-sm font-medium text-gray-500"><th className="px-6 py-3">Пользователь</th><th className="px-6 py-3">Контакты</th><th className="px-6 py-3">Тип</th><th className="px-6 py-3">Баланс</th><th className="px-6 py-3"></th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">{user.name?.charAt(0)}</div><div><div className="font-medium text-gray-900">{user.name}</div><div className="text-xs text-gray-400">ID: {user.id.slice(-6)}</div></div></div></td>
                        <td className="px-6 py-4"><div className="text-sm text-gray-600">{user.email}</div><div className="text-xs text-gray-400">{user.phone || '—'}</div></td>
                        <td className="px-6 py-4"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${user.userType === 'business' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{user.userType === 'business' ? 'Бизнес' : 'Частное'}</span>{user.isAdmin && <span className="ml-2 inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">Админ</span>}</td>
                        <td className="px-6 py-4"><span className="text-sm font-medium text-gray-900">{user.balance} €</span></td>
                        <td className="px-6 py-4"><button onClick={() => { setEditingUser(user); setUserForm({ name: user.name, email: user.email, phone: user.phone || '', city: user.city || '', userType: user.userType, balance: user.balance, isAdmin: user.isAdmin, isBlocked: user.isBlocked || false }) }} className="text-gray-400 hover:text-gray-600"><Edit className="w-4 h-4" /></button></td>
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
              <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-semibold text-gray-900">Товары</h1><span className="text-sm text-gray-500">{listings.length} всего</span></div>
              <div className="space-y-3">
                {listings.map(listing => {
                  const isPending = !listing.isModerated || listing.moderationStatus === 'pending'
                  return (
                    <div key={listing.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
                      <div className="flex gap-4">
                        <img src={listing.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div><h3 className="font-medium text-gray-900">{listing.title}</h3><p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{listing.description || '—'}</p></div>
                            <div className="flex items-center gap-2">
                              {isPending ? <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">На модерации</span> : listing.moderationStatus === 'approved' ? <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Одобрен</span> : <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full">Отклонен</span>}
                            </div>
                          </div>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500"><span>{listing.price} €</span><span>📍 {listing.city}</span><span>👤 {listing.sellerName}</span><span>👁️ {listing.views}</span></div>
                          <div className="flex gap-3 mt-3">
                            <button onClick={() => setEditingListing(listing)} className="text-sm text-gray-500 hover:text-gray-700">Редактировать</button>
                            {isPending && <><button onClick={() => moderateListing(listing.id, 'approved')} className="text-sm text-green-600 hover:text-green-700">Одобрить</button><button onClick={() => { setSelectedListing(listing); setShowRejectModal(true) }} className="text-sm text-red-500 hover:text-red-600">Отклонить</button></>}
                            <button onClick={() => deleteListing(listing.id)} className="text-sm text-gray-400 hover:text-red-500">Удалить</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Заказы</h1>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200"><tr className="text-left text-sm font-medium text-gray-500"><th className="px-6 py-3">№</th><th className="px-6 py-3">Покупатель</th><th className="px-6 py-3">Сумма</th><th className="px-6 py-3">Статус</th><th className="px-6 py-3">Дата</th></tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map(order => {
                      const status = getStatusBadge(order.status)
                      return <tr key={order.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-mono text-sm">{order.id.slice(-8)}</td><td className="px-6 py-4 text-sm">{users.find(u => u.id === order.userId)?.name || '—'}</td><td className="px-6 py-4 font-medium">{order.total} €</td><td className="px-6 py-4"><select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className={`text-xs border rounded-full px-3 py-1 ${status.color} border-current`}><option value="pending">Ожидает</option><option value="paid">Оплачен</option><option value="shipped">Отправлен</option><option value="delivered">Доставлен</option><option value="cancelled">Отменен</option></select></td><td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td></tr>
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-semibold text-gray-900">Категории</h1><button onClick={() => setShowAddCategory(true)} className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition">+ Добавить</button></div>
              <div className="grid grid-cols-3 gap-3">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3"><span className="text-2xl">{cat.icon}</span><div><div className="font-medium text-gray-900">{cat.name}</div><div className="text-xs text-gray-400">{cat.slug}</div></div></div>
                    <div className="flex gap-2"><button onClick={() => { setEditingCategory(cat); setCategoryForm({ name: cat.name, slug: cat.slug, icon: cat.icon, order: cat.order }) }} className="text-gray-400 hover:text-gray-600"><Edit className="w-4 h-4" /></button><button onClick={() => deleteCategory(cat.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Banners */}
          {activeTab === 'banners' && (
            <div>
              <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-semibold text-gray-900">Баннеры</h1><button onClick={() => setShowAddBanner(true)} className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition">+ Добавить</button></div>
              <div className="grid grid-cols-2 gap-4">
                {banners.map(banner => (
                  <div key={banner.id} className={`bg-white rounded-xl border ${banner.active ? 'border-gray-200' : 'border-gray-100 opacity-50'}`}>
                    <div className="h-24 bg-gray-100 rounded-t-xl flex items-center justify-center text-4xl">🎨</div>
                    <div className="p-4"><div className="font-medium text-gray-900">{banner.title}</div><div className="text-sm text-gray-500 mt-1 line-clamp-1">{banner.subtitle}</div><div className="flex justify-between items-center mt-3"><div className="flex gap-2"><button onClick={() => toggleBannerActive(banner.id, banner.active)} className={`text-xs px-2 py-1 rounded ${banner.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{banner.active ? 'Активен' : 'Неактивен'}</button></div><div className="flex gap-2"><button onClick={() => { setEditingBanner(banner); setBannerForm({ title: banner.title, subtitle: banner.subtitle, image: banner.image, buttonText: banner.buttonText, link: banner.link, color: banner.color, active: banner.active }) }} className="text-gray-400 hover:text-gray-600"><Edit className="w-4 h-4" /></button><button onClick={() => deleteBanner(banner.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div></div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Promocodes */}
          {activeTab === 'promocodes' && (
            <div>
              <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-semibold text-gray-900">Промокоды</h1><button onClick={() => setShowAddPromocode(true)} className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition">+ Добавить</button></div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full"><thead className="bg-gray-50 border-b"><tr className="text-left text-sm font-medium text-gray-500"><th className="px-6 py-3">Код</th><th className="px-6 py-3">Скидка</th><th className="px-6 py-3">Действует до</th><th className="px-6 py-3"></th></tr></thead>
                <tbody className="divide-y divide-gray-100">{promocodes.map(promo => <tr key={promo.code}><td className="px-6 py-4 font-mono text-sm font-medium">{promo.code}</td><td className="px-6 py-4">{promo.discount}%</td><td className="px-6 py-4 text-sm text-gray-500">{new Date(promo.expires).toLocaleDateString()}</td><td className="px-6 py-4"><button onClick={() => deletePromocode(promo.code)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></td></tr>)}</tbody></table>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="max-w-md"><h1 className="text-2xl font-semibold text-gray-900 mb-6">Настройки</h1>
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Комиссия платформы (%)</label><input type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900" placeholder="10" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Комиссия платежной системы (%)</label><input type="number" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900" placeholder="2.5" /></div>
                <button className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">Сохранить</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 w-full max-w-md"><h2 className="text-lg font-semibold mb-4">Редактировать пользователя</h2><div className="space-y-3"><input value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Имя" /><input value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Email" /><input value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Телефон" /><input value={userForm.city} onChange={e => setUserForm({...userForm, city: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Город" /><select value={userForm.userType} onChange={e => setUserForm({...userForm, userType: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg"><option value="private">Частное лицо</option><option value="business">Бизнес</option></select><input type="number" value={userForm.balance} onChange={e => setUserForm({...userForm, balance: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" placeholder="Баланс" /><label className="flex items-center gap-2"><input type="checkbox" checked={userForm.isAdmin} onChange={e => setUserForm({...userForm, isAdmin: e.target.checked})} /> Администратор</label><div className="flex gap-3 pt-3"><button onClick={updateUser} className="flex-1 bg-gray-900 text-white py-2 rounded-lg">Сохранить</button><button onClick={() => setEditingUser(null)} className="flex-1 border border-gray-200 py-2 rounded-lg">Отмена</button></div></div></div></div>
      )}

      {editingListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 w-full max-w-md"><h2 className="text-lg font-semibold mb-4">Редактировать товар</h2><div className="space-y-3"><input value={editingListing.title} onChange={e => setEditingListing({...editingListing, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /><textarea rows={3} value={editingListing.description} onChange={e => setEditingListing({...editingListing, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /><input type="number" value={editingListing.price} onChange={e => setEditingListing({...editingListing, price: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /><input value={editingListing.city} onChange={e => setEditingListing({...editingListing, city: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /><div className="flex gap-3 pt-3"><button onClick={updateListing} className="flex-1 bg-gray-900 text-white py-2 rounded-lg">Сохранить</button><button onClick={() => setEditingListing(null)} className="flex-1 border border-gray-200 py-2 rounded-lg">Отмена</button></div></div></div></div>
      )}

      {(showAddCategory || editingCategory) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 w-full max-w-md"><h2 className="text-lg font-semibold mb-4">{editingCategory ? 'Редактировать' : 'Новая категория'}</h2><div className="space-y-3"><input value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Название" /><input value={categoryForm.slug} onChange={e => setCategoryForm({...categoryForm, slug: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Slug" /><input value={categoryForm.icon} onChange={e => setCategoryForm({...categoryForm, icon: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Иконка" /><div className="flex gap-3"><button onClick={editingCategory ? updateCategory : createCategory} className="flex-1 bg-gray-900 text-white py-2 rounded-lg">Сохранить</button><button onClick={() => { setShowAddCategory(false); setEditingCategory(null) }} className="flex-1 border border-gray-200 py-2 rounded-lg">Отмена</button></div></div></div></div>
      )}

      {showRejectModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-xl p-6 w-full max-w-md"><h2 className="text-lg font-semibold mb-2">Отклонить объявление</h2><p className="text-sm text-gray-500 mb-4">Укажите причину</p><textarea className="w-full px-3 py-2 border rounded-lg mb-4" rows={3} placeholder="Причина..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} /><div className="flex gap-3"><button onClick={() => moderateListing(selectedListing.id, 'rejected', rejectReason)} className="flex-1 bg-red-600 text-white py-2 rounded-lg" disabled={!rejectReason}>Отклонить</button><button onClick={() => { setShowRejectModal(false); setRejectReason(''); setSelectedListing(null) }} className="flex-1 border border-gray-200 py-2 rounded-lg">Отмена</button></div></div></div>
      )}
    </div>
  )
}

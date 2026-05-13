'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Package, ShoppingBag, Eye, DollarSign, TrendingUp, 
  Plus, Edit, Trash2, BarChart3, LogOut,
  MapPin, CheckCircle, Clock, AlertCircle, Minus, Plus as PlusIcon,
  X, Upload
} from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  city: string
  image: string
  category: string
  views: number
  ordersCount: number
  stock: number
  stockType: 'available' | 'preorder' | 'out_of_stock'
  status: 'active' | 'pending' | 'sold'
  createdAt: string
}

export default function SellerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'products'>('overview')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Listing | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', price: '', city: '', image: '', category: 'Комнатные', phone: '',
    stock: 1, stockType: 'available'
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
    const data = await res.json()
    if (!data.user) { router.push('/'); return }
    setUser(data.user)
    await fetchData(data.user.id)
    setLoading(false)
  }

  const fetchData = async (userId: string) => {
    const listingsRes = await fetch('/api/admin?action=listings')
    const allListings = await listingsRes.json()
    const sellerListings = allListings.filter((l: any) => l.sellerId === userId)
    
    const ordersRes = await fetch('/api/admin?action=orders')
    const allOrders = await ordersRes.json()
    
    let totalRevenue = 0, totalOrders = 0, totalViews = 0, totalStock = 0, lowStockItems = 0
    
    const listingsWithStats = sellerListings.map((listing: any) => {
      const listingOrders = allOrders.filter((order: any) => 
        order.items.some((item: any) => item.listingId === listing.id)
      )
      const ordersCount = listingOrders.length
      const revenue = ordersCount * listing.price
      totalRevenue += revenue
      totalOrders += ordersCount
      totalViews += listing.views || 0
      
      const stock = listing.stock || 1
      totalStock += stock
      if (stock > 0 && stock <= 3) lowStockItems++
      
      return {
        ...listing,
        stock: stock,
        stockType: listing.stockType || 'available',
        ordersCount,
        revenue,
        status: listing.isModerated ? 'active' : 'pending'
      }
    })
    
    setListings(listingsWithStats)
    setStats({
      totalRevenue, totalOrders, totalViews, totalListings: sellerListings.length,
      averagePrice: sellerListings.length > 0 ? sellerListings.reduce((sum: number, l: any) => sum + l.price, 0) / sellerListings.length : 0,
      totalStock, lowStockItems
    })
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    if (data.success) return data.url
    throw new Error(data.error)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const url = await uploadImage(file)
      if (editingProduct) {
        setEditingProduct({ ...editingProduct, image: url })
      } else {
        setForm({ ...form, image: url })
      }
    } catch (error) {
      alert('Ошибка загрузки фото')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const url = await uploadImage(file)
      if (editingProduct) {
        setEditingProduct({ ...editingProduct, image: url })
      } else {
        setForm({ ...form, image: url })
      }
    } catch (error) {
      alert('Ошибка загрузки фото')
    } finally {
      setUploading(false)
    }
  }

  const createListing = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('📝 Отправка формы:', form)
    console.log('👤 Продавец:', user)
    console.log('💰 Цена:', parseFloat(form.price))
    
    if (!user || !user.id) {
      alert('Ошибка: пользователь не авторизован')
      return
    }
    
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          price: parseFloat(form.price), 
          sellerId: user.id, 
          sellerType: user.userType,
          stock: form.stock,
          stockType: form.stockType
        })
      })
      
      const data = await res.json()
      console.log('📦 Ответ сервера:', data)
      
      if (res.ok) {
        alert('✅ Товар успешно добавлен!')
        setShowAddForm(false)
        setForm({ title: '', description: '', price: '', city: '', image: '', category: 'Комнатные', phone: '', stock: 1, stockType: 'available' })
        fetchData(user.id)
      } else {
        alert(data.error || '❌ Ошибка при создании товара')
      }
    } catch (error) {
      console.error('❌ Ошибка:', error)
      alert('Ошибка соединения с сервером')
    }
  }

  const updateListing = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    const res = await fetch('/api/listings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: editingProduct.id,
        title: editingProduct.title,
        description: editingProduct.description,
        price: editingProduct.price,
        city: editingProduct.city,
        image: editingProduct.image,
        stock: editingProduct.stock,
        stockType: editingProduct.stockType
      })
    })
    if (res.ok) {
      setEditingProduct(null)
      fetchData(user.id)
    }
  }

  const updateStock = async (id: string, delta: number) => {
    const listing = listings.find(l => l.id === id)
    if (!listing) return
    const newStock = Math.max(0, listing.stock + delta)
    await fetch('/api/listings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, stock: newStock })
    })
    fetchData(user.id)
  }

  const deleteListing = async (id: string) => {
    if (confirm('Удалить товар?')) {
      await fetch(`/api/listings?id=${id}`, { method: 'DELETE' })
      fetchData(user.id)
    }
  }

  const getStockBadge = (stock: number, stockType: string) => {
    if (stockType === 'preorder') return { text: 'Под заказ', color: 'bg-blue-50 text-blue-700', icon: Clock }
    if (stock === 0) return { text: 'Нет в наличии', color: 'bg-red-50 text-red-700', icon: AlertCircle }
    if (stock <= 3) return { text: `Осталось ${stock} шт`, color: 'bg-yellow-50 text-yellow-700', icon: AlertCircle }
    return { text: `В наличии ${stock} шт`, color: 'bg-green-50 text-green-700', icon: CheckCircle }
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
          <p className="text-xs text-gray-500 mt-1">Личный кабинет</p>
        </div>
        <nav className="p-4 space-y-1">
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'overview' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
            <TrendingUp className="w-4 h-4" /> Обзор
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === 'products' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Package className="w-4 h-4" /> Товары
            <span className="ml-auto text-xs text-gray-400">{listings.length}</span>
          </button>
          <Link href="/seller/analytics" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
            <BarChart3 className="w-4 h-4" /> Аналитика
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">{user.name?.charAt(0) || 'U'}</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div>
            <button onClick={async () => { await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ action: 'logout' }) }); router.push('/') }} className="text-gray-400 hover:text-gray-600"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl">
          {/* Overview */}
          {activeTab === 'overview' && stats && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Добро пожаловать, {user.name}!</h1>
                <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                  <Plus className="w-4 h-4" /> Добавить товар
                </button>
              </div>
              <div className="grid grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between mb-2"><DollarSign className="w-5 h-5 text-gray-400" /><span className="text-xs text-gray-400">Выручка</span></div><div className="text-2xl font-semibold text-gray-900">{stats.totalRevenue.toFixed(0)} €</div></div>
                <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between mb-2"><ShoppingBag className="w-5 h-5 text-gray-400" /><span className="text-xs text-gray-400">Заказы</span></div><div className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</div></div>
                <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between mb-2"><Eye className="w-5 h-5 text-gray-400" /><span className="text-xs text-gray-400">Просмотры</span></div><div className="text-2xl font-semibold text-gray-900">{stats.totalViews}</div></div>
                <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between mb-2"><Package className="w-5 h-5 text-gray-400" /><span className="text-xs text-gray-400">Товары</span></div><div className="text-2xl font-semibold text-gray-900">{stats.totalListings}</div></div>
                <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between mb-2"><Package className="w-5 h-5 text-gray-400" /><span className="text-xs text-gray-400">Остатки</span></div><div className="text-2xl font-semibold text-gray-900">{stats.totalStock}</div></div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5"><h3 className="text-sm font-medium text-gray-900 mb-3">Средняя цена товара</h3><div className="text-2xl font-semibold text-gray-900">{stats.averagePrice.toFixed(0)} €</div></div>
            </>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Мои товары</h1>
                <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-2 text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                  <Plus className="w-4 h-4" /> Добавить товар
                </button>
              </div>

              {showAddForm && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Новый товар</h3>
                  <form onSubmit={createListing} className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Загрузка фото */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Фото</label>
                        <div
                          className={`relative aspect-square rounded-lg border-2 border-dashed transition overflow-hidden ${
                            dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50'
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          {form.image ? (
                            <>
                              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setForm({ ...form, image: '' })}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                              {uploading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 text-gray-400" />
                                  <p className="text-sm text-gray-500 mt-2">Нажмите или перетащите фото</p>
                                  <p className="text-xs text-gray-400">JPEG, PNG до 5MB</p>
                                </>
                              )}
                              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                          )}
                        </div>
                      </div>
                      
                      {/* Форма */}
                      <div className="space-y-3">
                        <input type="text" placeholder="Название *" className="w-full px-3 py-2 border rounded-lg" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                        <textarea placeholder="Описание" rows={2} className="w-full px-3 py-2 border rounded-lg" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="number" placeholder="Цена (€) *" className="px-3 py-2 border rounded-lg" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                          <input type="text" placeholder="Город *" className="px-3 py-2 border rounded-lg" value={form.city} onChange={e => setForm({...form, city: e.target.value})} required />
                        </div>
                        <select className="w-full px-3 py-2 border rounded-lg" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                          <option>Комнатные</option><option>Суккуленты</option><option>Садовые</option>
                        </select>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className="text-xs text-gray-500">Количество</label><input type="number" className="w-full px-3 py-2 border rounded-lg" value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value)})} /></div>
                          <div><label className="text-xs text-gray-500">Тип наличия</label><select className="w-full px-3 py-2 border rounded-lg" value={form.stockType} onChange={e => setForm({...form, stockType: e.target.value as any})}><option value="available">В наличии</option><option value="preorder">Под заказ</option></select></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition">Опубликовать</button>
                      <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 border border-gray-200 py-2 rounded-lg text-sm">Отмена</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Список товаров */}
              <div className="space-y-3">
                {listings.map(product => {
                  const stockBadge = getStockBadge(product.stock, product.stockType)
                  const StockIcon = stockBadge.icon
                  return (
                    <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition">
                      <div className="flex gap-4">
                        <img src={product.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div><h3 className="font-medium text-gray-900">{product.title}</h3><p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{product.description || '—'}</p></div>
                            <div className="flex gap-2">
                              <button onClick={() => setEditingProduct(product)} className="text-gray-400 hover:text-gray-600"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => deleteListing(product.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                            <span className="font-medium text-gray-900">{product.price} €</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {product.city}</span>
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {product.views}</span>
                            <span className="flex items-center gap-1"><ShoppingBag className="w-3 h-3" /> {product.ordersCount} продаж</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-3">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${stockBadge.color}`}><StockIcon className="w-3 h-3" /> {stockBadge.text}</span>
                              {product.stockType === 'available' && product.stock > 0 && (
                                <div className="flex items-center gap-1">
                                  <button onClick={() => updateStock(product.id, -1)} className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
                                  <span className="text-sm font-medium w-8 text-center">{product.stock}</span>
                                  <button onClick={() => updateStock(product.id, 1)} className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50"><PlusIcon className="w-3 h-3" /></button>
                                </div>
                              )}
                              {product.status === 'pending' && <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> На модерации</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {listings.length === 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <div className="text-4xl mb-3">📦</div>
                    <p className="text-gray-500">У вас пока нет товаров</p>
                    <button onClick={() => setShowAddForm(true)} className="mt-4 text-sm bg-gray-900 text-white px-4 py-2 rounded-lg">Добавить товар</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Редактировать товар</h2>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Загрузка фото */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Фото</label>
                <div
                  className={`relative aspect-square rounded-lg border-2 border-dashed transition overflow-hidden ${
                    dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {editingProduct.image ? (
                    <>
                      <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, image: '' })}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                      {uploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">Нажмите или перетащите фото</p>
                          <p className="text-xs text-gray-400">JPEG, PNG до 5MB</p>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>
              
              {/* Форма */}
              <div className="space-y-3">
                <input value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Название" />
                <textarea rows={3} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Описание" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="px-3 py-2 border rounded-lg" placeholder="Цена" />
                  <input value={editingProduct.city} onChange={e => setEditingProduct({...editingProduct, city: e.target.value})} className="px-3 py-2 border rounded-lg" placeholder="Город" />
                </div>
                <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  <option>Комнатные</option><option>Суккуленты</option><option>Садовые</option>
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500">Количество</label><input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="text-xs text-gray-500">Тип наличия</label><select value={editingProduct.stockType} onChange={e => setEditingProduct({...editingProduct, stockType: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg"><option value="available">В наличии</option><option value="preorder">Под заказ</option></select></div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button onClick={updateListing} className="flex-1 bg-gray-900 text-white py-2 rounded-lg">Сохранить</button>
              <button onClick={() => setEditingProduct(null)} className="flex-1 border border-gray-200 py-2 rounded-lg">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

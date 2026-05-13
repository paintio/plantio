'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AuthModal from '@/components/AuthModal'
import { Search, ShoppingBag, Heart, User, MapPin, ChevronDown, Leaf, TrendingUp, Shield, Truck, CheckCircle, Sparkles } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  city: string
  image: string
  category: string
  sellerType: string
  views: number
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchListings()
    checkAuth()
  }, [search, selectedCategory])

  const fetchListings = async () => {
    const params = new URLSearchParams({ search, category: selectedCategory, limit: '8' })
    const res = await fetch(`/api/listings?${params}`)
    const data = await res.json()
    setListings(data.listings || [])
    setLoading(false)
  }

  const checkAuth = async () => {
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
    const data = await res.json()
    if (data.user) setUser(data.user)
  }

  const categories = [
    { id: 'all', name: 'Все растения', icon: <Leaf className="w-5 h-5" /> },
    { id: 'Комнатные растения', name: 'Комнатные', icon: '🏠' },
    { id: 'Суккуленты', name: 'Суккуленты', icon: '🌵' },
    { id: 'Садовые растения', name: 'Садовые', icon: '🌻' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <Leaf className="w-5 h-5 text-emerald-600 group-hover:rotate-12 transition" />
              <span className="text-xl font-semibold text-gray-900">Plantio</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/catalog" className="text-sm text-gray-600 hover:text-emerald-600 transition">Каталог</Link>
              <Link href="/seller" className="text-sm text-gray-600 hover:text-emerald-600 transition">Продавать</Link>
              <Link href="/about" className="text-sm text-gray-600 hover:text-emerald-600 transition">О нас</Link>
            </div>
            
            <div className="flex items-center gap-5">
              <button className="text-gray-500 hover:text-emerald-600 transition">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-500 hover:text-emerald-600 transition relative">
                <ShoppingBag className="w-5 h-5" />
              </button>
              
              {user ? (
                <div className="relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="p-3 border-b border-gray-50 bg-gray-50/30"><p className="text-sm font-medium text-gray-900">{user.name}</p><p className="text-xs text-gray-400">{user.email}</p></div>
                      <Link href="/seller" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition">📦 Мои товары</Link>
                      <Link href="/balance" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition">💰 Баланс: {user.balance} €</Link>
                      {user.isAdmin && <Link href="/admin" className="block px-4 py-2 text-sm text-purple-600 hover:bg-gray-50">⚡ Админ-панель</Link>}
                      <button onClick={async () => { await fetch('/api/auth', { method: 'POST', body: JSON.stringify({ action: 'logout' }) }); window.location.reload() }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition">Выйти</button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition">
                  Войти
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero секция с зеленым акцентом */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/20 to-white py-20">
        <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm mb-6">
                <Sparkles className="w-3 h-3" />
                Добро пожаловать в Plantio
              </div>
              <h1 className="text-5xl lg:text-6xl font-light tracking-tight text-gray-900 mb-4">
                Растения, <br />которые вдохновляют
              </h1>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Коллекция редких и комнатных растений от проверенных продавцов. 
                Доставка по всей России.
              </p>
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск растений..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 transition"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=500&fit=crop" className="w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Категории с зелеными акцентами */}
      <section className="py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Популярные растения</h2>
            <p className="text-sm text-gray-400 mt-1">Выбор наших покупателей</p>
          </div>
          <Link href="/catalog" className="text-sm text-emerald-600 hover:text-emerald-700 transition flex items-center gap-1 group">
            Все товары <span className="group-hover:translate-x-1 transition">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20"><p className="text-gray-400">Ничего не найдено</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((item, idx) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="relative overflow-hidden bg-gray-100 rounded-xl aspect-square">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  {item.views > 50 && (
                    <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                      🌟 Популярное
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition">{item.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-base font-semibold text-gray-900">{item.price} €</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {item.city}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.sellerType === 'business' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                      {item.sellerType === 'business' ? 'Магазин' : 'Частное'}
                    </span>
                    <span className="text-xs text-gray-400">👁️ {item.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Преимущества с зеленым акцентом */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3 shadow-sm group-hover:shadow-md group-hover:scale-105 transition">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">Быстрая доставка</h3>
              <p className="text-xs text-gray-400">По всей России</p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3 shadow-sm group-hover:shadow-md group-hover:scale-105 transition">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">Безопасная оплата</h3>
              <p className="text-xs text-gray-400">Защита покупателя</p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3 shadow-sm group-hover:shadow-md group-hover:scale-105 transition">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">Оригинальные растения</h3>
              <p className="text-xs text-gray-400">От проверенных продавцов</p>
            </div>
            <div className="text-center group">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-3 shadow-sm group-hover:shadow-md group-hover:scale-105 transition">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium text-gray-900">Выгодные цены</h3>
              <p className="text-xs text-gray-400">Без наценок</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция с зеленым градиентом */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light mb-4">Готовы пополнить коллекцию?</h2>
          <p className="text-emerald-100 mb-8 max-w-md mx-auto">Присоединяйтесь к сообществу Plantio</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setShowAuthModal(true)} className="px-8 py-3 bg-white text-emerald-700 rounded-full text-sm font-medium hover:shadow-lg transition transform hover:scale-105">
              Зарегистрироваться
            </button>
            <Link href="/catalog" className="px-8 py-3 border border-white/30 rounded-full text-sm font-medium hover:bg-white/10 transition">
              Каталог
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-medium text-gray-900">Plantio</h3>
              </div>
              <p className="text-xs text-gray-400">Маркетплейс растений</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-900 mb-3">Покупателям</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link href="/catalog" className="hover:text-emerald-600">Каталог</Link></li>
                <li><Link href="/delivery" className="hover:text-emerald-600">Доставка</Link></li>
                <li><Link href="/payment" className="hover:text-emerald-600">Оплата</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-900 mb-3">Продавцам</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link href="/seller" className="hover:text-emerald-600">Личный кабинет</Link></li>
                <li><Link href="/commission" className="hover:text-emerald-600">Комиссия</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-900 mb-3">Документы</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link href="/privacy" className="hover:text-emerald-600">Политика</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-600">Соглашение</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
            © 2024 Plantio — маркетплейс растений
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={() => window.location.reload()} />
    </div>
  )
}

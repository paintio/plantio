'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import { Search, ShoppingBag, Heart, User, MapPin, ChevronDown, Leaf, TrendingUp, Shield, Truck, CheckCircle, Sparkles, ArrowRight } from 'lucide-react'

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
  const { user, logout } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchListings()
  }, [search, selectedCategory])

  const fetchListings = async () => {
    const params = new URLSearchParams({ search, category: selectedCategory, limit: '8' })
    const res = await fetch(`/api/listings?${params}`)
    const data = await res.json()
    setListings(data.listings || [])
    setLoading(false)
  }

  const categories = [
    { id: 'all', name: 'Все растения' },
    { id: 'Комнатные растения', name: 'Комнатные' },
    { id: 'Суккуленты', name: 'Суккуленты' },
    { id: 'Садовые растения', name: 'Садовые' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <Leaf className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-light tracking-tight text-gray-900">Plantio</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/catalog" className="text-sm text-gray-500 hover:text-gray-900 transition">Каталог</Link>
              <Link href="/seller" className="text-sm text-gray-500 hover:text-gray-900 transition">Продавать</Link>
            </div>
            
            <div className="flex items-center gap-5">
              <button className="text-gray-400 hover:text-gray-900 transition">
                <Search className="w-5 h-5" />
              </button>
              <Link href="/cart" className="text-gray-400 hover:text-gray-900 transition relative">
                <ShoppingBag className="w-5 h-5" />
              </Link>
              
              {user ? (
                <div className="relative">
                  <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="p-3 border-b border-gray-50 bg-gray-50/30">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <Link href="/seller" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Мои товары</Link>
                      <Link href="/balance" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Баланс: {user.balance} €</Link>
                      {user.isAdmin && <Link href="/admin" className="block px-4 py-2 text-sm text-purple-600 hover:bg-gray-50">Админ-панель</Link>}
                      <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">Выйти</button>
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

      <section className="relative bg-gradient-to-br from-emerald-50/40 via-white to-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs mb-6">
                <Sparkles className="w-3 h-3" />
                Живая красота в вашем доме
              </div>
              <h1 className="text-5xl lg:text-6xl font-light tracking-tight text-gray-900 mb-6">
                Растения, которые<br />вдохновляют
              </h1>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Коллекция редких и комнатных растений от проверенных продавцов. Доставка по всей России.
              </p>
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск растений..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 transition"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=500&fit=crop" className="w-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">⭐</div>
                  <div><div className="text-sm font-medium">4.9 / 5.0</div><div className="text-xs text-gray-400">на основе 289 отзывов</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 sticky top-16 bg-white z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto py-4 scrollbar-hide justify-center">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-sm whitespace-nowrap pb-2 transition ${
                  selectedCategory === cat.id 
                    ? 'text-gray-900 border-b-2 border-gray-900 font-medium' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Популярные растения</h2>
            <p className="text-sm text-gray-400 mt-1">Выбор наших покупателей</p>
          </div>
          <Link href="/catalog" className="text-sm text-gray-400 hover:text-gray-600 transition flex items-center gap-1 group">
            Все товары <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Ничего не найдено</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map((item) => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group">
                <div className="overflow-hidden rounded-xl bg-gray-50 aspect-square">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition">{item.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-base font-semibold text-gray-900">{item.price} €</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.city}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}

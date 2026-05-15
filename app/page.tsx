'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AuthModal from '@/components/AuthModal'
import UserMenu from '@/components/UserMenu'
import { Search, ShoppingBag, Leaf, Truck, Shield, Heart, Star, Sparkles, ArrowRight, MapPin, TrendingUp, Clock, Award } from 'lucide-react'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) setUser(JSON.parse(savedUser))
    
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.listings || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <Leaf className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-gray-900">Plantio</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/catalog" className="text-gray-600 hover:text-green-600 transition">Каталог</Link>
              <Link href="/seller" className="text-gray-600 hover:text-green-600 transition">Продавать</Link>
              <Link href="/about" className="text-gray-600 hover:text-green-600 transition">О нас</Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/cart" className="text-gray-600 hover:text-green-600 transition relative">
                <ShoppingBag className="w-5 h-5" />
              </Link>
              
              {user ? (
                <UserMenu user={user} />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="btn-primary !py-1.5 !px-4 text-sm"
                >
                  Войти
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                Добро пожаловать в Plantio
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Растения, которые <br />вдохновляют
              </h1>
              <p className="text-lg text-gray-500 mb-8 max-w-lg mx-auto lg:mx-0">
                Коллекция редких и комнатных растений от проверенных продавцов. Доставка по всей России.
              </p>
              <div className="relative max-w-md mx-auto lg:mx-0">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск растений..."
                  className="input pl-11 pr-4 py-3 rounded-full"
                />
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-4 mt-6">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9 (285 отзывов)</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600"
                  alt="Hero"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">⭐</div>
                  <div>
                    <div className="text-sm font-medium">4.9 / 5.0</div>
                    <div className="text-xs text-gray-400">на основе 285 отзывов</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Быстрая доставка', desc: 'По всей России' },
              { icon: Shield, title: 'Безопасная оплата', desc: 'Защита покупателя' },
              { icon: Leaf, title: 'Оригинальные растения', desc: 'От проверенных продавцов' },
              { icon: Heart, title: 'Поддержка 24/7', desc: 'Всегда на связи' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Популярные растения</h2>
            <p className="section-subtitle">Выбор наших покупателей</p>
          </div>

          {loading ? (
            <div className="text-center py-12">Загрузка...</div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Нет товаров</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map((item: any) => (
                <Link key={item.id} href={`/listing/${item.id}`} className="group">
                  <div className="card overflow-hidden group-hover:-translate-y-1">
                    <div className="relative h-56 overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                      {item.views > 100 && (
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded-full">
                          🔥 Хит
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-2xl font-bold text-green-600">{item.price} €</span>
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {item.city}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                        <span>👁️ {item.views || 0} просмотров</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-5 h-5 text-green-500" />
                <span className="text-white font-semibold">Plantio</span>
              </div>
              <p className="text-sm">Маркетплейс растений №1</p>
              <p className="text-xs mt-2">© 2024 Все права защищены</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Покупателям</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/catalog" className="hover:text-white transition">Каталог</Link></li>
                <li><Link href="/delivery" className="hover:text-white transition">Доставка</Link></li>
                <li><Link href="/payment" className="hover:text-white transition">Оплата</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Продавцам</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/seller" className="hover:text-white transition">Личный кабинет</Link></li>
                <li><Link href="/commission" className="hover:text-white transition">Комиссия</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Документы</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Политика</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Соглашение</Link></li>
                <li><Link href="/consent" className="hover:text-white transition">Согласие на ПД</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p>С любовью к растениям 🌱</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}

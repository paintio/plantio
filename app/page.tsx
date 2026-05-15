'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from '@/components/AuthModal'
import { Search, ShoppingBag, Heart, MapPin, Leaf, Truck, Shield, Star, Sparkles, ArrowRight } from 'lucide-react'

export default function Home() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => { setListings(data.listings || []); setLoading(false) })
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2"><Leaf className="w-6 h-6 text-green-600" /><span className="text-xl font-bold text-gray-900">Plantio</span></Link>
            <div className="hidden md:flex items-center gap-8"><Link href="/catalog" className="text-gray-600 hover:text-green-600">Каталог</Link><Link href="/seller" className="text-gray-600 hover:text-green-600">Продавать</Link></div>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="text-gray-600 hover:text-green-600"><ShoppingBag className="w-5 h-5" /></Link>
              {user ? (
                <div className="flex items-center gap-2"><span className="text-sm text-gray-700">{user.name}</span><button onClick={() => { localStorage.removeItem('user'); window.location.reload() }} className="text-red-500 text-sm">Выйти</button></div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-green-700">Войти</button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div><div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mb-6"><Sparkles className="w-4 h-4" /> Растения для дома</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Растения, которые вдохновляют</h1>
            <p className="text-gray-500 mb-8">Коллекция редких и комнатных растений от проверенных продавцов. Доставка по всей России.</p>
            <div className="relative max-w-md"><Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="text" placeholder="Поиск растений..." className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500" /></div>
            <div className="flex items-center gap-4 mt-6"><div className="flex -space-x-2"><div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div><div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div></div><div className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="text-sm text-gray-600 ml-2">4.9 (285 отзывов)</span></div></div></div>
            <div className="hidden md:block"><div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl overflow-hidden"><img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600" className="w-full" /></div></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-gray-100"><div className="max-w-7xl mx-auto px-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-6"><div className="flex items-center gap-3"><Truck className="w-8 h-8 text-green-600" /><div><h3 className="font-semibold">Быстрая доставка</h3><p className="text-sm text-gray-500">По всей России</p></div></div><div className="flex items-center gap-3"><Shield className="w-8 h-8 text-green-600" /><div><h3 className="font-semibold">Безопасная оплата</h3><p className="text-sm text-gray-500">Защита покупателя</p></div></div><div className="flex items-center gap-3"><Leaf className="w-8 h-8 text-green-600" /><div><h3 className="font-semibold">Оригинальные растения</h3><p className="text-sm text-gray-500">От проверенных продавцов</p></div></div><div className="flex items-center gap-3"><Heart className="w-8 h-8 text-green-600" /><div><h3 className="font-semibold">Поддержка 24/7</h3><p className="text-sm text-gray-500">Всегда на связи</p></div></div></div></div></section>

      {/* Products */}
      <section className="py-16"><div className="max-w-7xl mx-auto px-6"><div className="flex justify-between items-center mb-8"><div><h2 className="text-2xl font-bold text-gray-900">Популярные растения</h2><p className="text-gray-500 mt-1">Выбор наших покупателей</p></div><Link href="/catalog" className="text-green-600 hover:text-green-700 flex items-center gap-1">Все товары <ArrowRight className="w-4 h-4" /></Link></div>
      {loading ? <div className="text-center py-12">Загрузка...</div> : listings.length === 0 ? <div className="text-center py-12 text-gray-400">Нет товаров</div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">{listings.map((item: any) => (<Link key={item.id} href={`/listing/${item.id}`} className="group"><div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"><div className="h-48 overflow-hidden bg-gray-100"><img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" /></div><div className="p-4"><h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3><div className="flex justify-between items-center"><span className="text-xl font-bold text-green-600">{item.price} €</span><span className="text-sm text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.city}</span></div></div></div></Link>))}</div>}</div></section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12"><div className="max-w-7xl mx-auto px-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-8"><div><div className="flex items-center gap-2 mb-3"><Leaf className="w-5 h-5 text-green-500" /><span className="text-white font-semibold">Plantio</span></div><p className="text-sm">Маркетплейс растений</p></div><div><h4 className="text-white font-medium mb-3">Покупателям</h4><ul className="space-y-2 text-sm"><li><Link href="/catalog" className="hover:text-white">Каталог</Link></li><li><Link href="/delivery" className="hover:text-white">Доставка</Link></li></ul></div><div><h4 className="text-white font-medium mb-3">Продавцам</h4><ul className="space-y-2 text-sm"><li><Link href="/seller" className="hover:text-white">Личный кабинет</Link></li></ul></div><div><h4 className="text-white font-medium mb-3">Документы</h4><ul className="space-y-2 text-sm"><li><Link href="/privacy" className="hover:text-white">Политика</Link></li><li><Link href="/terms" className="hover:text-white">Соглашение</Link></li></ul></div></div><div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">© 2024 Plantio — маркетплейс растений</div></div></footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, User, LogIn } from 'lucide-react'

interface CartItem {
  id: string
  listingId: string
  quantity: number
  title: string
  price: number
  city: string
  image: string
}

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [promocode, setPromocode] = useState('')
  const [promocodeDiscount, setPromocodeDiscount] = useState(0)
  const [promocodeApplied, setPromocodeApplied] = useState(false)

  useEffect(() => {
    checkAuth()
    loadCartFromLocalStorage()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
    const data = await res.json()
    setUser(data.user)
  }

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('plantio_cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setLoading(false)
  }

  const saveCartToLocalStorage = (newCart: CartItem[]) => {
    localStorage.setItem('plantio_cart', JSON.stringify(newCart))
    setCart(newCart)
  }

  const addToCart = (listing: any) => {
    const existing = cart.find(item => item.listingId === listing.id)
    if (existing) {
      const updated = cart.map(item =>
        item.listingId === listing.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      saveCartToLocalStorage(updated)
    } else {
      saveCartToLocalStorage([...cart, {
        id: Date.now().toString(),
        listingId: listing.id,
        quantity: 1,
        title: listing.title,
        price: listing.price,
        city: listing.city,
        image: listing.image
      }])
    }
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    const updated = cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    saveCartToLocalStorage(updated)
  }

  const removeItem = (itemId: string) => {
    const updated = cart.filter(item => item.id !== itemId)
    saveCartToLocalStorage(updated)
  }

  const applyPromocode = async () => {
    const res = await fetch(`/api/promocode?code=${promocode.toUpperCase()}`)
    const data = await res.json()
    if (data.valid) {
      setPromocodeDiscount(data.discount)
      setPromocodeApplied(true)
      alert(`Промокод активирован! Скидка ${data.discount}%`)
    } else {
      alert('Неверный или просроченный промокод')
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = subtotal * (promocodeDiscount / 100)
  const total = subtotal - discountAmount

  const proceedToCheckout = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    localStorage.setItem('checkout_cart', JSON.stringify(cart))
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl group-hover:scale-110 transition">🌱</span>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Plantio
              </span>
            </Link>
            <Link href="/" className="text-gray-500 hover:text-green-600 transition flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Продолжить покупки
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-green-600" />
          Корзина
          <span className="text-lg font-normal text-gray-500">({cart.length} товаров)</span>
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
            <div className="text-7xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Корзина пуста</h2>
            <p className="text-gray-500 mb-6">Добавьте товары из каталога</p>
            <Link href="/catalog" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition inline-block">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Список товаров */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 transition hover:shadow-md">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'} 
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">📍 {item.city}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">{item.price} €</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 mt-1"
                        >
                          <Trash2 className="w-3 h-3" /> Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Итоговая информация */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Итого по заказу</h2>
                
                {/* Промокод */}
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Промокод"
                      className="flex-1 px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      value={promocode}
                      onChange={e => setPromocode(e.target.value.toUpperCase())}
                      disabled={promocodeApplied}
                    />
                    <button
                      onClick={applyPromocode}
                      disabled={promocodeApplied}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
                    >
                      {promocodeApplied ? 'Активирован' : 'Применить'}
                    </button>
                  </div>
                  {promocodeApplied && (
                    <p className="text-xs text-green-600 mt-1">✓ Промокод активирован, скидка {promocodeDiscount}%</p>
                  )}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Товары ({cart.length} шт)</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  {promocodeDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Скидка ({promocodeDiscount}%)</span>
                      <span>-{discountAmount.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-3 border-t">
                    <span>Итого</span>
                    <span className="text-green-600">{total.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Информация о пользователе */}
                {!user ? (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
                    <p className="text-sm text-yellow-800 flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Для оформления заказа необходимо войти
                    </p>
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="mt-2 w-full bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition"
                    >
                      Войти или зарегистрироваться
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-green-50 rounded-xl">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ваш баланс</span>
                      <span className={`font-semibold ${user.balance >= total ? 'text-green-600' : 'text-red-600'}`}>
                        {user.balance.toFixed(2)} €
                      </span>
                    </div>
                    {user.balance < total && (
                      <Link href="/balance" className="text-xs text-blue-600 hover:underline mt-1 block">
                        Пополнить баланс →
                      </Link>
                    )}
                  </div>
                )}

                <button
                  onClick={proceedToCheckout}
                  disabled={!user || user.balance < total}
                  className={`w-full mt-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all ${
                    user && user.balance >= total
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Оформить заказ
                </button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  Нажимая «Оформить заказ», вы соглашаетесь с условиями продажи
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Модалка авторизации для корзины */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Для оформления заказа</h2>
            <p className="text-gray-600 mb-6">Войдите или зарегистрируйтесь, чтобы продолжить</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAuthModal(false)
                  // Открываем основную модалку авторизации
                  const event = new CustomEvent('openAuthModal')
                  window.dispatchEvent(event)
                }}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Войти
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

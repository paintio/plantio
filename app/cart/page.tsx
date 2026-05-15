'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react'

interface CartItem {
  id: number
  listing_id: number
  quantity: number
  listing: {
    id: number
    title: string
    price: number
    city: string
    image: string
  }
}

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [promocode, setPromocode] = useState('')
  const [promocodeDiscount, setPromocodeDiscount] = useState(0)

  useEffect(() => {
    if (user) {
      loadCart()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadCart = async () => {
    if (!user) return
    const res = await fetch(`/api/cart?userId=${user.id}`)
    const data = await res.json()
    setCart(data)
    setLoading(false)
  }

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setUpdating(true)
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, cartItemId, quantity: newQuantity })
    })
    await loadCart()
    setUpdating(false)
  }

  const removeItem = async (cartItemId: number) => {
    setUpdating(true)
    await fetch(`/api/cart?userId=${user.id}&cartItemId=${cartItemId}`, { method: 'DELETE' })
    await loadCart()
    setUpdating(false)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.listing.price * item.quantity, 0)
  const discountAmount = subtotal * (promocodeDiscount / 100)
  const total = subtotal - discountAmount

  const checkout = async () => {
    if (!user) return
    
    const items = cart.map(item => ({
      listingId: item.listing_id,
      quantity: item.quantity,
      price: item.listing.price
    }))
    
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        items,
        total,
        promocode: promocodeDiscount > 0 ? promocode : null,
        discount: promocodeDiscount
      })
    })
    
    if (res.ok) {
      const order = await res.json()
      router.push(`/order/${order.id}`)
    } else {
      alert('Ошибка при оформлении заказа')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Войдите чтобы увидеть корзину</p>
          <Link href="/" className="text-green-600 hover:underline">На главную</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-semibold text-gray-900">🌱 Plantio</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-light text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="w-6 h-6" /> Корзина
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <p className="text-gray-400">Корзина пуста</p>
            <Link href="/catalog" className="text-green-600 hover:underline mt-4 inline-block">Перейти в каталог</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border p-4 flex gap-4">
                  <img src={item.listing.image} className="w-20 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.listing.title}</h3>
                    <p className="text-sm text-gray-500">{item.listing.city}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-50"><Plus className="w-3 h-3" /></button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{item.listing.price} €</p>
                        <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm">Удалить</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border p-6 sticky top-24">
                <h2 className="font-semibold mb-4">Итого</h2>
                <div className="space-y-2 border-t pt-3">
                  <div className="flex justify-between"><span>Товары</span><span>{subtotal.toFixed(2)} €</span></div>
                  {promocodeDiscount > 0 && <div className="flex justify-between text-green-600"><span>Скидка</span><span>-{discountAmount.toFixed(2)} €</span></div>}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t"><span>Итого</span><span className="text-green-600">{total.toFixed(2)} €</span></div>
                </div>
                <button onClick={checkout} className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">Оформить заказ</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

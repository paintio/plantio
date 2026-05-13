'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingCart, Heart, Share2, ChevronLeft, Star, Phone, MapPin, Tag, Award, Check } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  city: string
  image: string
  category: string
  phone: string
  sellerType: 'private' | 'business'
  sellerId: string
  views: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface Review {
  id: string
  author: string
  rating: number
  text: string
  createdAt: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  city: string
}

export default function ListingPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [listing, setListing] = useState<Listing | null>(null)
  const [seller, setSeller] = useState<User | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showPhone, setShowPhone] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    phone: ''
  })
  const [reviewForm, setReviewForm] = useState({
    author: '',
    rating: 5,
    text: ''
  })

  useEffect(() => {
    if (id) {
      checkAuth()
      fetchListing()
      fetchReviews()
    }
  }, [id])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
      const data = await res.json()
      setCurrentUser(data.user)
    } catch (error) {
      console.error('Auth check error:', error)
    }
  }

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${id}`)
      if (!res.ok) throw new Error('Listing not found')
      const data = await res.json()
      setListing(data)
      setEditForm({
        title: data.title,
        description: data.description || '',
        price: data.price.toString(),
        city: data.city,
        phone: data.phone || ''
      })
      
      if (data.sellerId) {
        const usersRes = await fetch('/api/admin?action=users')
        const users = await usersRes.json()
        const sellerData = users.find((u: any) => u.id === data.sellerId)
        setSeller(sellerData)
      }
    } catch (error) {
      console.error('Error fetching listing:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?listingId=${id}`)
      const data = await res.json()
      setReviews(data.reviews || [])
      setAverageRating(data.averageRating || 0)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
      setAverageRating(0)
    }
  }

  const updateListing = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/listings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        ...editForm,
        price: parseFloat(editForm.price)
      })
    })
    if (res.ok) {
      const updated = await res.json()
      setListing(updated)
      setIsEditing(false)
    }
  }

  const addReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewForm.author || !reviewForm.text) {
      alert('Заполните имя и отзыв')
      return
    }
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: id,
        ...reviewForm,
        rating: parseInt(reviewForm.rating.toString())
      })
    })
    if (res.ok) {
      setReviewForm({ author: '', rating: 5, text: '' })
      fetchReviews()
    }
  }

  const deleteListing = async () => {
    if (confirm('Удалить объявление?')) {
      await fetch(`/api/listings?id=${id}`, { method: 'DELETE' })
      router.push('/')
    }
  }

  const addToCart = () => {
    if (!listing) return
    
    setAddingToCart(true)
    
    // Получаем текущую корзину из localStorage
    const cart = JSON.parse(localStorage.getItem('plantio_cart') || '[]')
    
    // Проверяем, есть ли уже такой товар
    const existingIndex = cart.findIndex((item: any) => item.listingId === listing.id)
    
    if (existingIndex !== -1) {
      // Увеличиваем количество
      cart[existingIndex].quantity += 1
    } else {
      // Добавляем новый товар
      cart.push({
        id: Date.now().toString(),
        listingId: listing.id,
        quantity: 1,
        title: listing.title,
        price: listing.price,
        city: listing.city,
        image: listing.image
      })
    }
    
    // Сохраняем обратно в localStorage
    localStorage.setItem('plantio_cart', JSON.stringify(cart))
    
    // Показываем анимацию добавления
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
    setAddingToCart(false)
    
    // Отправляем событие обновления корзины
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const getImageUrl = () => {
    if (listing?.image && !imageError) {
      return listing.image
    }
    return 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌿</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Объявление не найдено</h1>
          <Link href="/" className="text-green-600 hover:underline">← Вернуться на главную</Link>
        </div>
      </div>
    )
  }

  const isOwner = currentUser?.id === listing.sellerId || currentUser?.isAdmin

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
            <span>🌱</span> Plantio
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="text-gray-500 hover:text-green-600 mb-4 inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Назад
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="relative h-96 bg-gradient-to-br from-green-400 to-emerald-500">
              <img 
                src={getImageUrl()} 
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{listing.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {listing.city}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">👁️ {listing.views} просмотров</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">{listing.price} €</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                  {listing.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs ${listing.sellerType === 'business' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {listing.sellerType === 'business' ? '🏢 Бизнес' : '🏠 Частное лицо'}
                </span>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={addToCart}
                  disabled={addingToCart}
                  className={`flex-1 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all ${
                    addedToCart
                      ? 'bg-green-700 text-white'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {addedToCart ? (
                    <><Check className="w-5 h-5" /> Добавлено!</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5" /> В корзину</>
                  )}
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition">
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {listing.description && (
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-3">Описание</h2>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3">Продавец</h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{seller?.name || 'Продавец'}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-500">⭐ {averageRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">{reviews.length} отзывов</span>
                  </div>
                </div>
                {listing.phone && (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition"
                  >
                    {showPhone ? listing.phone : '📞 Показать телефон'}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-3">Отзывы ({reviews.length})</h2>
              
              <form onSubmit={addReview} className="mb-6 p-4 bg-gray-50 rounded-2xl">
                <h3 className="font-medium mb-3">Оставить отзыв</h3>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full px-3 py-2 border rounded-lg mb-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  value={reviewForm.author}
                  onChange={e => setReviewForm({...reviewForm, author: e.target.value})}
                  required
                />
                <select
                  className="w-full px-3 py-2 border rounded-lg mb-2 text-sm"
                  value={reviewForm.rating}
                  onChange={e => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5</option>
                  <option value={4}>⭐⭐⭐⭐ 4</option>
                  <option value={3}>⭐⭐⭐ 3</option>
                  <option value={2}>⭐⭐ 2</option>
                  <option value={1}>⭐ 1</option>
                </select>
                <textarea
                  placeholder="Ваш отзыв"
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg mb-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  value={reviewForm.text}
                  onChange={e => setReviewForm({...reviewForm, text: e.target.value})}
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                >
                  Отправить
                </button>
              </form>

              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Пока нет отзывов</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{review.author}</span>
                          <span className="text-yellow-500 text-xs">
                            {'⭐'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isOwner && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                >
                  {isEditing ? 'Отмена' : '✏️ Редактировать'}
                </button>
                <button
                  onClick={deleteListing}
                  className="flex-1 bg-red-600 text-white py-2 rounded-full font-semibold hover:bg-red-700 transition"
                >
                  🗑️ Удалить
                </button>
              </div>
            )}

            {isEditing && (
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <form onSubmit={updateListing} className="space-y-3">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={editForm.title}
                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                    required
                  />
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={editForm.description}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      className="px-3 py-2 border rounded-lg text-sm"
                      value={editForm.price}
                      onChange={e => setEditForm({...editForm, price: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      className="px-3 py-2 border rounded-lg text-sm"
                      value={editForm.city}
                      onChange={e => setEditForm({...editForm, city: e.target.value})}
                      required
                    />
                  </div>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value={editForm.phone}
                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-green-700 transition"
                  >
                    Сохранить
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, X, Eye, Clock, AlertCircle } from 'lucide-react'

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
  isModerated?: boolean
  moderationStatus?: 'pending' | 'approved' | 'rejected'
  moderationReason?: string
  createdAt: string
}

export default function ModeratePage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  useEffect(() => {
    checkAuth()
    fetchListings()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
    const data = await res.json()
    if (!data.user?.isAdmin) {
      router.push('/')
      return
    }
    setCurrentUser(data.user)
  }

  const fetchListings = async () => {
    try {
      const res = await fetch('/api/admin?action=listings')
      const data = await res.json()
      
      // Получаем имена продавцов
      const usersRes = await fetch('/api/admin?action=users')
      const users = await usersRes.json()
      
      const listingsWithSeller = data.map((listing: any) => ({
        ...listing,
        sellerName: users.find((u: any) => u.id === listing.sellerId)?.name || 'Неизвестный',
        moderationStatus: listing.moderationStatus || 'pending'
      }))
      
      setListings(listingsWithSeller)
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const moderateListing = async (listingId: string, status: 'approved' | 'rejected', reason?: string) => {
    try {
      const res = await fetch('/api/admin/moderate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, status, reason: reason || '' })
      })
      
      if (res.ok) {
        await fetchListings()
        setShowRejectModal(false)
        setRejectReason('')
        setSelectedListing(null)
      } else {
        const error = await res.json()
        alert(error.error || 'Ошибка при модерации')
      }
    } catch (error) {
      console.error('Error moderating:', error)
      alert('Ошибка при модерации')
    }
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'approved':
        return { text: '✅ Одобрено', color: 'bg-green-100 text-green-700', icon: Check }
      case 'rejected':
        return { text: '❌ Отклонено', color: 'bg-red-100 text-red-700', icon: X }
      default:
        return { text: '⏳ На модерации', color: 'bg-yellow-100 text-yellow-700', icon: Clock }
    }
  }

  const filteredListings = listings.filter(l => {
    if (filter === 'all') return true
    if (filter === 'pending') return !l.isModerated || l.moderationStatus === 'pending'
    return l.moderationStatus === filter
  })

  const pendingCount = listings.filter(l => !l.isModerated || l.moderationStatus === 'pending').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-green-600 transition">
                ← Назад в админку
              </Link>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                📋 Модерация товаров
              </h1>
              {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingCount} на проверке
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">{currentUser?.name}</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Фильтры */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-full text-sm transition ${
              filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            ⏳ На модерации ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-full text-sm transition ${
              filter === 'approved' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            ✅ Одобренные
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-full text-sm transition ${
              filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            ❌ Отклоненные
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm transition ${
              filter === 'all' ? 'bg-gray-700 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Все
          </button>
        </div>

        {/* Список товаров */}
        <div className="space-y-4">
          {filteredListings.map((listing) => {
            const status = getStatusBadge(listing.moderationStatus)
            const StatusIcon = status.icon
            return (
              <div key={listing.id} className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition">
                <div className="flex gap-4 flex-wrap md:flex-nowrap">
                  <img 
                    src={listing.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'} 
                    alt={listing.title}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{listing.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{listing.description || 'Нет описания'}</p>
                        <div className="flex gap-3 mt-2 text-sm flex-wrap">
                          <span className="text-green-600 font-bold">{listing.price} €</span>
                          <span className="text-gray-400">📍 {listing.city}</span>
                          <span className="text-gray-400">👤 {listing.sellerName}</span>
                          <span className="text-gray-400">📅 {new Date(listing.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.text}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Link href={`/listing/${listing.id}`} target="_blank" className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Просмотр
                      </Link>
                      
                      {(!listing.isModerated || listing.moderationStatus === 'pending') && (
                        <>
                          <button
                            onClick={() => moderateListing(listing.id, 'approved')}
                            className="bg-green-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-green-700 transition flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Одобрить
                          </button>
                          <button
                            onClick={() => {
                              setSelectedListing(listing)
                              setShowRejectModal(true)
                            }}
                            className="bg-red-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-red-700 transition flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Отклонить
                          </button>
                        </>
                      )}
                    </div>
                    
                    {listing.moderationStatus === 'rejected' && listing.moderationReason && (
                      <p className="text-xs text-red-500 mt-2">Причина: {listing.moderationReason}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          
          {filteredListings.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500">Нет товаров для отображения</p>
            </div>
          )}
        </div>
      </div>

      {/* Модалка отклонения */}
      {showRejectModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Отклонить объявление</h2>
            <p className="text-gray-600 mb-4">Укажите причину отклонения:</p>
            <textarea
              className="w-full px-3 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-red-500 outline-none"
              rows={3}
              placeholder="Причина отклонения..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => moderateListing(selectedListing.id, 'rejected', rejectReason)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                disabled={!rejectReason}
              >
                Отклонить
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason('')
                  setSelectedListing(null)
                }}
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

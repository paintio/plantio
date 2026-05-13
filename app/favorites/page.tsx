'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Listing {
  id: string
  title: string
  price: number
  city: string
  image: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]')
    fetchFavorites(favoriteIds)
  }, [])

  const fetchFavorites = async (ids: string[]) => {
    const res = await fetch('/api/listings')
    const allListings = await res.json()
    const favListings = allListings.filter((l: Listing) => ids.includes(l.id))
    setFavorites(favListings)
    setLoading(false)
  }

  const removeFavorite = (id: string) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    const newFavorites = favorites.filter((f: string) => f !== id)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    setFavorites(favorites.filter((f: Listing) => f.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md p-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-2xl font-bold text-green-700">
            🌱 Plantio
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">❤️ Избранное</h1>
        
        {loading ? (
          <div className="text-center py-12">Загрузка...</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">У вас нет избранных объявлений</p>
            <Link href="/" className="text-green-600 hover:underline mt-4 inline-block">
              Перейти к покупкам →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {favorites.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-2xl font-bold text-green-600">{item.price} €</p>
                  <p className="text-gray-500">{item.city}</p>
                  <div className="flex gap-2 mt-3">
                    <Link href={`/listing/${item.id}`}>
                      <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        Смотреть
                      </button>
                    </Link>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

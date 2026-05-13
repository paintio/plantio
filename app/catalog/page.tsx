'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Grid, List, MapPin, Heart, Filter, X, ChevronDown, SlidersHorizontal } from 'lucide-react'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  city: string
  image: string
  category: string
  views: number
  createdAt: string
}

export default function CatalogPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  // Фильтры
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('all')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  
  const [categories, setCategories] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [listings, search, selectedCategory, selectedCity, priceMin, priceMax, sortBy])

  const fetchListings = async () => {
    const res = await fetch('/api/listings?limit=100')
    const data = await res.json()
    const allListings = data.listings || []
    setListings(allListings)
    
    // Извлекаем уникальные категории и города
    const uniqueCategories = [...new Set(allListings.map((l: Listing) => l.category))] as string[]
    const uniqueCities = [...new Set(allListings.map((l: Listing) => l.city))] as string[]
    setCategories(uniqueCategories)
    setCities(uniqueCities)
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...listings]
    
    // Поиск
    if (search) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Категория
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    
    // Город
    if (selectedCity !== 'all') {
      filtered = filtered.filter(item => item.city === selectedCity)
    }
    
    // Цена
    if (priceMin) {
      filtered = filtered.filter(item => item.price >= parseFloat(priceMin))
    }
    if (priceMax) {
      filtered = filtered.filter(item => item.price <= parseFloat(priceMax))
    }
    
    // Сортировка
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    
    setFilteredListings(filtered)
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedCategory('all')
    setSelectedCity('all')
    setPriceMin('')
    setPriceMax('')
    setSortBy('newest')
  }

  const activeFiltersCount = [
    search ? 1 : 0,
    selectedCategory !== 'all' ? 1 : 0,
    selectedCity !== 'all' ? 1 : 0,
    priceMin || priceMax ? 1 : 0
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-semibold text-gray-900">🌿 Plantio</Link>
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">← На главную</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-8">Каталог растений</h1>
        
        {/* Поиск и панель фильтров */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Поиск по названию или описанию..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                showFilters || activeFiltersCount > 0
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Фильтры
              {activeFiltersCount > 0 && (
                <span className="ml-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <div className="flex gap-2">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>
                <Grid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Расширенные фильтры */}
          {showFilters && (
            <div className="bg-gray-50 rounded-xl p-5 mb-4 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-900">Расширенный поиск</h3>
                <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-gray-600">Сбросить все</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Категория</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Все категории</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Город</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                  >
                    <option value="all">Все города</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Цена от (€)</label>
                  <input
                    type="number"
                    placeholder="от"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    value={priceMin}
                    onChange={e => setPriceMin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Цена до (€)</label>
                  <input
                    type="number"
                    placeholder="до"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    value={priceMax}
                    onChange={e => setPriceMax(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <select
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="newest">Сначала новые</option>
                  <option value="oldest">Сначала старые</option>
                  <option value="price_asc">Сначала дешевле</option>
                  <option value="price_desc">Сначала дороже</option>
                  <option value="popular">По популярности</option>
                </select>
              </div>
            </div>
          )}

          {/* Активные фильтры */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                  Поиск: {search}
                  <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCity !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {selectedCity}
                  <button onClick={() => setSelectedCity('all')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {(priceMin || priceMax) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs">
                  Цена: {priceMin || '0'} - {priceMax || '∞'} €
                  <button onClick={() => { setPriceMin(''); setPriceMax('') }}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Результаты */}
        <div className="mb-4 text-sm text-gray-400">
          Найдено: {filteredListings.length} товаров
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🌿</div>
            <p className="text-gray-400">Ничего не найдено</p>
            <button onClick={resetFilters} className="mt-4 text-sm text-emerald-600 hover:text-emerald-700">Сбросить фильтры</button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredListings.map(item => (
              <Link key={item.id} href={`/listing/${item.id}`} className="group">
                <div className="bg-gray-100 rounded-lg aspect-square overflow-hidden">
                  <img src={item.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-base font-semibold text-gray-900">{item.price} €</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.city}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredListings.map(item => (
              <Link key={item.id} href={`/listing/${item.id}`} className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6'} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{item.description || 'Без описания'}</p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-sm font-semibold text-gray-900">{item.price} €</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.city}</span>
                    <span className="text-xs text-gray-400">👁️ {item.views}</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition">
                  <Heart className="w-4 h-4" />
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

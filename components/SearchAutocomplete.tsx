'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

interface SearchAutocompleteProps {
  onSearch: (value: string) => void
}

export default function SearchAutocomplete({ onSearch }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length > 1) {
      fetch(`/api/listings?search=${query}&limit=5`)
        .then(res => res.json())
        .then(data => setSuggestions(data.listings || []))
    } else {
      setSuggestions([])
    }
  }, [query])

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Поиск растений..."
          className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-white/80 focus:ring-2 focus:ring-green-500 outline-none"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            onSearch(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-96 overflow-y-auto">
          {suggestions.map((item) => (
            <Link
              key={item.id}
              href={`/listing/${item.id}`}
              onClick={() => setShowSuggestions(false)}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 transition border-b last:border-0"
            >
              <img src={item.image || '/placeholder.jpg'} className="w-10 h-10 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-sm text-green-600">{item.price} €</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'

interface MapProps {
  city: string
  lat?: number
  lng?: number
}

export default function Map({ city, lat, lng }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return
    
    // Загружаем карту от OpenStreetMap (бесплатно, без API ключа)
    const map = document.createElement('iframe')
    map.style.width = '100%'
    map.style.height = '100%'
    map.style.border = 'none'
    map.style.borderRadius = '12px'
    
    const query = encodeURIComponent(city)
    map.src = `https://www.openstreetmap.org/export/embed.html?bbox=30.0,55.0,40.0,60.0&layer=mapnik&marker=55.75,37.62`
    
    mapRef.current.innerHTML = ''
    mapRef.current.appendChild(map)
  }, [city, lat, lng])

  return (
    <div ref={mapRef} className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-center h-full text-gray-400">
        🗺️ Загрузка карты...
      </div>
    </div>
  )
}

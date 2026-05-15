'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'

export default function CreateListingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    category: 'Комнатные растения',
    phone: ''
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      router.push('/')
      return
    }
    setUser(JSON.parse(savedUser))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        image: imageUrl,
        sellerId: user?.id,
        sellerType: user?.userType
      })
    })
    
    if (res.ok) {
      alert('Товар успешно добавлен!')
      router.push('/')
    } else {
      alert('Ошибка при добавлении товара')
    }
    setLoading(false)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">🌱 Plantio</Link>
        </div>
      </header>
      
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Новое объявление</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Фото растения</label>
            <ImageUpload onImageUploaded={setImageUrl} currentImage={imageUrl} label="" />
            <p className="text-xs text-gray-400 mt-2">Рекомендуем фото 1:1, до 5MB</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <input type="text" required className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea rows={4} className="input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена (€) *</label>
              <input type="number" required className="input" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Город *</label>
              <input type="text" required className="input" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
            <select className="input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option>Комнатные растения</option><option>Суккуленты</option><option>Садовые растения</option><option>Редкие растения</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
            <input type="tel" className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Публикация...' : 'Опубликовать'}</button>
            <Link href="/" className="btn-secondary flex-1 text-center">Отмена</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

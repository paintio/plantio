'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Power, Image as ImageIcon } from 'lucide-react'

interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  buttonText: string
  link: string
  color: string
  active: boolean
  createdAt: string
}

export default function BannersPage() {
  const router = useRouter()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    buttonText: 'Купить',
    link: '/',
    color: 'from-green-500 to-emerald-600'
  })

  useEffect(() => {
    checkAuth()
    fetchBanners()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
    const data = await res.json()
    if (!data.user?.isAdmin) {
      router.push('/')
    }
  }

  const fetchBanners = async () => {
    const res = await fetch('/api/admin?action=banners')
    const data = await res.json()
    setBanners(data)
    setLoading(false)
  }

  const saveBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const url = editingBanner 
      ? '/api/admin' 
      : '/api/admin'
    
    const body = editingBanner
      ? { action: 'banner', id: editingBanner.id, ...form }
      : { action: 'banner', ...form }
    
    const res = await fetch(url, {
      method: editingBanner ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    
    if (res.ok) {
      fetchBanners()
      setShowForm(false)
      setEditingBanner(null)
      setForm({ title: '', subtitle: '', image: '', buttonText: 'Купить', link: '/', color: 'from-green-500 to-emerald-600' })
    }
  }

  const deleteBanner = async (id: string) => {
    if (confirm('Удалить баннер?')) {
      await fetch(`/api/admin?action=banner&id=${id}`, { method: 'DELETE' })
      fetchBanners()
    }
  }

  const toggleBannerActive = async (id: string, active: boolean) => {
    await fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'banner', id, active: !active })
    })
    fetchBanners()
  }

  const colorOptions = [
    { value: 'from-green-500 to-emerald-600', label: 'Зеленый' },
    { value: 'from-blue-500 to-cyan-600', label: 'Голубой' },
    { value: 'from-purple-500 to-pink-600', label: 'Фиолетовый' },
    { value: 'from-orange-500 to-red-600', label: 'Оранжевый' },
    { value: 'from-yellow-500 to-amber-600', label: 'Желтый' }
  ]

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
                🎨 Управление баннерами
              </h1>
            </div>
            <button
              onClick={() => {
                setEditingBanner(null)
                setForm({ title: '', subtitle: '', image: '', buttonText: 'Купить', link: '/', color: 'from-green-500 to-emerald-600' })
                setShowForm(true)
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Добавить баннер
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Форма добавления/редактирования */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">
              {editingBanner ? 'Редактировать баннер' : 'Новый баннер'}
            </h2>
            <form onSubmit={saveBanner} className="space-y-4">
              <input
                type="text"
                placeholder="Заголовок"
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Подзаголовок"
                className="w-full px-4 py-2 border rounded-xl"
                value={form.subtitle}
                onChange={e => setForm({...form, subtitle: e.target.value})}
              />
              <input
                type="text"
                placeholder="URL изображения"
                className="w-full px-4 py-2 border rounded-xl"
                value={form.image}
                onChange={e => setForm({...form, image: e.target.value})}
              />
              <input
                type="text"
                placeholder="Текст кнопки"
                className="w-full px-4 py-2 border rounded-xl"
                value={form.buttonText}
                onChange={e => setForm({...form, buttonText: e.target.value})}
              />
              <input
                type="text"
                placeholder="Ссылка"
                className="w-full px-4 py-2 border rounded-xl"
                value={form.link}
                onChange={e => setForm({...form, link: e.target.value})}
              />
              <select
                className="w-full px-4 py-2 border rounded-xl"
                value={form.color}
                onChange={e => setForm({...form, color: e.target.value})}
              >
                {colorOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  {editingBanner ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingBanner(null)
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Список баннеров */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className={`relative h-32 bg-gradient-to-r ${banner.color}`}>
                {banner.image && (
                  <img src={banner.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <div className="relative z-10 p-4 text-white">
                  <h3 className="font-bold text-lg">{banner.title}</h3>
                  <p className="text-sm opacity-90">{banner.subtitle}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleBannerActive(banner.id, banner.active)}
                      className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                        banner.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      {banner.active ? 'Активен' : 'Неактивен'}
                    </button>
                    <span className="text-xs text-gray-400">Ссылка: {banner.link}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingBanner(banner)
                        setForm({
                          title: banner.title,
                          subtitle: banner.subtitle,
                          image: banner.image,
                          buttonText: banner.buttonText,
                          link: banner.link,
                          color: banner.color
                        })
                        setShowForm(true)
                      }}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBanner(banner.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {banners.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-gray-500">Нет баннеров. Создайте первый!</p>
          </div>
        )}
      </div>
    </div>
  )
}

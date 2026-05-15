'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState([])
  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [usersRes, listingsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin?action=users').then(r => r.json()),
        fetch('/api/admin?action=listings').then(r => r.json()),
        fetch('/api/categories').then(r => r.json())
      ])
      setUsers(usersRes)
      setListings(listingsRes)
      setCategories(categoriesRes)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type: string, id: any) => {
    if (confirm('Удалить?')) {
      await fetch(`/api/admin?action=${type}&id=${id}`, { method: 'DELETE' })
      fetchAllData()
    }
  }

  const handleSave = async () => {
    const url = modalType === 'category' ? '/api/categories' : `/api/admin?action=${modalType}`
    const method = editingItem?.id ? 'PUT' : 'POST'
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    })
    if (res.ok) {
      setShowModal(false)
      setEditingItem(null)
      fetchAllData()
    }
  }

  const openModal = (type: string, item: any = null) => {
    setModalType(type)
    setEditingItem(item || {})
    setShowModal(true)
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4"><div className="flex justify-between items-center"><div><span className="text-2xl">🌱</span><h1 className="text-xl font-semibold inline ml-2">Админ-панель</h1></div><Link href="/" className="text-sm text-gray-500">На сайт</Link></div></header>
      <div className="flex">
        <div className="w-64 bg-white border-r min-h-screen p-4">
          <div className="space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>📊 Дашборд</button>
            <button onClick={() => setActiveTab('users')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>👥 Пользователи</button>
            <button onClick={() | setActiveTab('listings')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'listings' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>🌿 Товары</button>
            <button onClick={() => setActiveTab('categories')} className={`w-full text-left px-4 py-2 rounded-lg ${activeTab === 'categories' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}>🏷️ Категории</button>
          </div>
        </div>
        <div className="flex-1 p-6">
          {activeTab === 'dashboard' && (<div><h2 className="text-2xl font-bold mb-6">Обзор</h2><div className="grid grid-cols-3 gap-6"><div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold text-blue-600">{users.length}</div><div>Пользователей</div></div><div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold text-green-600">{listings.length}</div><div>Товаров</div></div><div className="bg-white rounded-xl border p-6"><div className="text-2xl font-bold text-purple-600">{categories.length}</div><div>Категорий</div></div></div></div>)}
          
          {activeTab === 'users' && (<div><div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">Пользователи</h2><button onClick={() => openModal('user')} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Добавить</button></div><div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left">ID</th><th className="px-6 py-3 text-left">Имя</th><th className="px-6 py-3 text-left">Email</th><th className="px-6 py-3 text-left">Тип</th><th className="px-6 py-3 text-left">Баланс</th><th className="px-6 py-3"></th></tr></thead><tbody>{users.map((user: any) => (<tr key={user.id} className="border-t"><td className="px-6 py-4">{user.id}</td><td className="px-6 py-4">{user.name}</td><td className="px-6 py-4">{user.email}</td><td className="px-6 py-4">{user.userType === 'business' ? 'Бизнес' : 'Частное'}</td><td className="px-6 py-4">{user.balance} €</td><td className="px-6 py-4"><button onClick={() => openModal('user', user)} className="text-blue-500 mr-2">✏️</button><button onClick={() => handleDelete('user', user.id)} className="text-red-500">🗑️</button></td></tr>))}</tbody></table></div></div>)}
          
          {activeTab === 'listings' && (<div><div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">Товары</h2><button onClick={() => openModal('listing')} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Добавить</button></div><div className="bg-white rounded-xl border overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b"><tr><th className="px-6 py-3 text-left">ID</th><th className="px-6 py-3 text-left">Название</th><th className="px-6 py-3 text-left">Цена</th><th className="px-6 py-3 text-left">Город</th><th className="px-6 py-3"></th></tr></thead><tbody>{listings.map((listing: any) => (<tr key={listing.id} className="border-t"><td className="px-6 py-4">{listing.id}</td><td className="px-6 py-4">{listing.title}<td><td className="px-6 py-4">{listing.price} €</td><td className="px-6 py-4">{listing.city}</td><td className="px-6 py-4"><button onClick={() => openModal('listing', listing)} className="text-blue-500 mr-2">✏️</button><button onClick={() => handleDelete('listing', listing.id)} className="text-red-500">🗑️</button></td></tr>))}</tbody></table></div></div>)}
          
          {activeTab === 'categories' && (<div><div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">Категории</h2><button onClick={() => openModal('category')} className="bg-green-600 text-white px-4 py-2 rounded-lg">+ Добавить</button></div><div className="grid grid-cols-3 gap-4">{categories.map((cat: any) => (<div key={cat.id} className="bg-white rounded-xl border p-4 flex justify-between items-center"><div><span className="text-2xl">{cat.icon || '📁'}</span> <span className="font-semibold">{cat.name}</span><div className="text-sm text-gray-500">{cat.slug}</div></div><div><button onClick={() => openModal('category', cat)} className="text-blue-500 mr-2">✏️</button><button onClick={() => handleDelete('category', cat.id)} className="text-red-500">🗑️</button></div></div>))}</div></div>)}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold">{editingItem?.id ? 'Редактировать' : 'Добавить'} {modalType}</h2><button onClick={() => setShowModal(false)}>✕</button></div>
            <div className="space-y-3">
              {modalType === 'user' && (<><input className="w-full px-3 py-2 border rounded" placeholder="Имя" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Email" value={editingItem?.email || ''} onChange={e => setEditingItem({...editingItem, email: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Пароль" type="password" value={editingItem?.password || ''} onChange={e => setEditingItem({...editingItem, password: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Баланс" type="number" value={editingItem?.balance || 0} onChange={e => setEditingItem({...editingItem, balance: parseFloat(e.target.value)})} /><select className="w-full px-3 py-2 border rounded" value={editingItem?.userType || 'private'} onChange={e => setEditingItem({...editingItem, userType: e.target.value})}><option value="private">Частное лицо</option><option value="business">Бизнес</option></select></>)}
              
              {modalType === 'listing' && (<><div className="border rounded-lg p-4 bg-gray-50"><p className="text-sm font-medium mb-2">Фото товара</p><ImageUpload onImageUploaded={(url) => setEditingItem({...editingItem, image: url})} currentImage={editingItem?.image} /></div><input className="w-full px-3 py-2 border rounded" placeholder="Название" value={editingItem?.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} /><textarea className="w-full px-3 py-2 border rounded" rows={3} placeholder="Описание" value={editingItem?.description || ''} onChange={e => setEditingItem({...editingItem, description: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Цена (€)" type="number" value={editingItem?.price || 0} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} /><input className="w-full px-3 py-2 border rounded" placeholder="Город" value={editingItem?.city || ''} onChange={e => setEditingItem({...editingItem, city: e.target.value})} /><select className="w-full px-3 py-2 border rounded" value={editingItem?.category || 'Комнатные'} onChange={e => setEditingItem({...editingItem, category: e.target.value})}><option>Комнатные</option><option>Суккуленты</option><option>Садовые</option></select></>)}
              
              {modalType === 'category' && (<><input className="w-full px-3 py-2 border rounded" placeholder="Название" value={editingItem?.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Slug" value={editingItem?.slug || ''} onChange={e => setEditingItem({...editingItem, slug: e.target.value})} /><input className="w-full px-3 py-2 border rounded" placeholder="Иконка (эмодзи)" value={editingItem?.icon || '🌿'} onChange={e => setEditingItem({...editingItem, icon: e.target.value})} /></>)}
              
              <div className="flex gap-3 pt-4"><button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded">Сохранить</button><button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 py-2 rounded">Отмена</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

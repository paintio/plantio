'use client'

import Link from 'next/link'
import { Leaf, LogOut } from 'lucide-react'

interface AdminHeaderProps {
  title: string
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold text-gray-900">Plantio</span>
            </Link>
            <span className="text-sm text-gray-400">/</span>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition">
              На сайт
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

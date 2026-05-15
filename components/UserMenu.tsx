'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Store, Wallet, ShoppingBag, Heart, LogOut } from 'lucide-react'

interface UserMenuProps {
  user: {
    id: number
    name: string
    email: string
    isAdmin: boolean
    balance: number
  }
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.reload()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 hover:bg-gray-200 transition"
      >
        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm text-gray-700">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          
          {user.isAdmin && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-500" />
              Панель управления
            </Link>
          )}
          
          <Link
            href="/seller"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <Store className="w-4 h-4 text-blue-500" />
            Кабинет продавца
          </Link>
          
          <Link
            href="/balance"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <Wallet className="w-4 h-4 text-green-500" />
            Баланс: {user.balance} €
          </Link>
          
          <Link
            href="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <ShoppingBag className="w-4 h-4 text-orange-500" />
            Корзина
          </Link>
          
          <Link
            href="/favorites"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <Heart className="w-4 h-4 text-red-500" />
            Избранное
          </Link>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      )}
    </div>
  )
}

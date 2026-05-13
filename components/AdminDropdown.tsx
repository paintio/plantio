'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingBag, 
  Tag, 
  Image, 
  Ticket, 
  Settings,
  LogOut,
  Store,
  History,
  Wallet
} from 'lucide-react'

interface AdminDropdownProps {
  userName: string
  onLogout: () => void
}

export default function AdminDropdown({ userName, onLogout }: AdminDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuItems = [
    { icon: <LayoutDashboard className="w-4 h-4" />, label: 'Дашборд', href: '/admin', color: 'text-green-600' },
    { icon: <Users className="w-4 h-4" />, label: 'Пользователи', href: '/admin?tab=users', color: 'text-blue-600' },
    { icon: <Package className="w-4 h-4" />, label: 'Товары', href: '/admin?tab=listings', color: 'text-purple-600' },
    { icon: <ShoppingBag className="w-4 h-4" />, label: 'Заказы', href: '/admin?tab=orders', color: 'text-yellow-600' },
    { icon: <Tag className="w-4 h-4" />, label: 'Категории', href: '/admin?tab=categories', color: 'text-pink-600' },
    { icon: <Image className="w-4 h-4" />, label: 'Баннеры', href: '/admin?tab=banners', color: 'text-indigo-600' },
    { icon: <Ticket className="w-4 h-4" />, label: 'Промокоды', href: '/admin?tab=promocodes', color: 'text-orange-600' },
    { icon: <Settings className="w-4 h-4" />, label: 'Настройки', href: '/admin?tab=settings', color: 'text-gray-600' },
  ]

  const userMenuItems = [
    { icon: <Store className="w-4 h-4" />, label: 'Мой магазин', href: '/seller', color: 'text-green-600' },
    { icon: <History className="w-4 h-4" />, label: 'История', href: '/history', color: 'text-blue-600' },
    { icon: <Wallet className="w-4 h-4" />, label: 'Баланс', href: '/balance', color: 'text-purple-600' },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transition-all hover:scale-105"
      >
        <span>👑</span>
        <span className="text-sm font-medium">Администратор</span>
        <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
          {/* Шапка меню */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">{userName}</p>
            <p className="text-xs text-purple-600">Администратор</p>
          </div>

          {/* Раздел админки */}
          <div className="py-2">
            <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Администрирование</p>
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors group"
              >
                <span className={item.color}>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Разделитель */}
          <div className="border-t border-gray-100"></div>

          {/* Пользовательские ссылки */}
          <div className="py-2">
            <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Личное</p>
            {userMenuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors group"
              >
                <span className={item.color}>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Разделитель */}
          <div className="border-t border-gray-100"></div>

          {/* Выход */}
          <button
            onClick={() => {
              setIsOpen(false)
              onLogout()
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Выйти</span>
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

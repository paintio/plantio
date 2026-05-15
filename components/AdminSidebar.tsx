'use client'

import { LayoutDashboard, Users, Package, ShoppingBag, Tag, Image, Ticket, Settings } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: any
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { id: 'users', label: 'Пользователи', icon: Users },
  { id: 'listings', label: 'Товары', icon: Package },
  { id: 'orders', label: 'Заказы', icon: ShoppingBag },
  { id: 'categories', label: 'Категории', icon: Tag },
  { id: 'banners', label: 'Баннеры', icon: Image },
  { id: 'promocodes', label: 'Промокоды', icon: Ticket },
  { id: 'settings', label: 'Настройки', icon: Settings },
]

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === item.id
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-green-600' : ''}`} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

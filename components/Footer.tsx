'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌱</span>
              <h3 className="text-sm font-medium text-gray-900">Plantio</h3>
            </div>
            <p className="text-xs text-gray-400">Маркетплейс растений</p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-900 mb-3">Покупателям</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/catalog" className="hover:text-gray-600">Каталог</Link></li>
              <li><Link href="/delivery" className="hover:text-gray-600">Доставка</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-900 mb-3">Продавцам</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/seller" className="hover:text-gray-600">Личный кабинет</Link></li>
              <li><Link href="/commission" className="hover:text-gray-600">Комиссия</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-900 mb-3">Документы</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/privacy" className="hover:text-gray-600">Политика</Link></li>
              <li><Link href="/terms" className="hover:text-gray-600">Соглашение</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © 2024 Plantio — маркетплейс растений
        </div>
      </div>
    </footer>
  )
}

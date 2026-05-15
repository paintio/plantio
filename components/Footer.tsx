'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Plantio</h3>
            <p className="text-xs text-gray-400">Маркетплейс растений</p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Покупателям</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li><Link href="/catalog" className="hover:text-gray-600">Каталог</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Продавцам</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li><Link href="/seller" className="hover:text-gray-600">Личный кабинет</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Документы</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li><Link href="/privacy" className="hover:text-gray-600">Политика</Link></li>
              <li><Link href="/terms" className="hover:text-gray-600">Соглашение</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
          © 2024 Plantio
        </div>
      </div>
    </footer>
  )
}

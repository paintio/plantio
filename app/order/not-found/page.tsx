'use client'

import Link from 'next/link'

export default function OrderNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Заказ не найден</h1>
        <p className="text-gray-500 mb-8">Проверьте номер заказа или вернитесь на главную</p>
        <Link href="/" className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition">
          На главную
        </Link>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, DollarSign, ShoppingBag, Eye, TrendingUp, RefreshCw } from 'lucide-react'

export default function SellerAnalytics() {
  const [period, setPeriod] = useState('year')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/seller/analytics?period=${period}`)
      const json = await res.json()
      setData(json)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Ошибка загрузки данных</p>
          <button onClick={fetchAnalytics} className="mt-4 text-green-600">Повторить</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/seller" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-semibold">Аналитика продаж</h1>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    period === p ? 'bg-green-600 text-white' : 'bg-white border'
                  }`}
                >
                  {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
                </button>
              ))}
              <button onClick={fetchAnalytics} className="p-1.5 bg-white border rounded-lg">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border p-4">
            <DollarSign className="w-5 h-5 text-green-600 mb-2" />
            <div className="text-2xl font-bold">{data.summary.totalRevenue} €</div>
            <div className="text-xs text-gray-400">Выручка</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <ShoppingBag className="w-5 h-5 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{data.summary.totalOrders}</div>
            <div className="text-xs text-gray-400">Заказы</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <Eye className="w-5 h-5 text-yellow-600 mb-2" />
            <div className="text-2xl font-bold">{data.summary.totalViews}</div>
            <div className="text-xs text-gray-400">Просмотры</div>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <TrendingUp className="w-5 h-5 text-purple-600 mb-2" />
            <div className="text-2xl font-bold">{data.summary.conversionRate}%</div>
            <div className="text-xs text-gray-400">Конверсия</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6 mb-6">
          <h3 className="font-semibold mb-4">🏆 Топ-5 товаров</h3>
          <div className="space-y-3">
            {data.topProducts.map((p: any, i: number) => (
              <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.sales} продаж</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">{p.revenue} €</div>
                  <div className="text-sm text-green-500">+{p.growth}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold">📦 Последние заказы</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-sm">
                  <th className="px-6 py-3">№</th>
                  <th className="px-6 py-3">Покупатель</th>
                  <th className="px-6 py-3">Сумма</th>
                  <th className="px-6 py-3">Статус</th>
                  <th className="px-6 py-3">Дата</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4 font-semibold">{order.amount} €</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        {order.status === 'delivered' ? 'Доставлен' : order.status === 'shipped' ? 'Отправлен' : 'Оплачен'}
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

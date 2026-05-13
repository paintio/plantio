'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, DollarSign, ShoppingBag, Eye, Package, 
  TrendingUp, Calendar, Download, RefreshCw
} from 'lucide-react'

export default function SellerAnalytics() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month')

  useEffect(() => {
    checkAuth()
  }, [period])

  const checkAuth = async () => {
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
    const data = await res.json()
    if (!data.user) {
      router.push('/')
      return
    }
    setUser(data.user)
    fetchAnalytics(data.user.id)
  }

  const fetchAnalytics = async (sellerId: string) => {
    setLoading(true)
    const res = await fetch(`/api/seller/analytics?sellerId=${sellerId}&period=${period}`)
    const analyticsData = await res.json()
    setData(analyticsData)
    setLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/seller" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Аналитика продаж</h1>
          <div className="flex gap-2 ml-auto">
            {(['week', 'month', 'year', 'all'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-sm rounded-lg transition ${
                period === p ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}>{p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : p === 'year' ? 'Год' : 'Всё'}</button>
            ))}
            <button onClick={() => fetchAnalytics(user.id)} className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex items-center justify-between mb-1"><DollarSign className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-400">Выручка</span></div><div className="text-xl font-semibold">{data.summary.totalRevenue.toFixed(0)} €</div></div>
          <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex items-center justify-between mb-1"><ShoppingBag className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-400">Заказы</span></div><div className="text-xl font-semibold">{data.summary.totalOrders}</div></div>
          <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex items-center justify-between mb-1"><Package className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-400">Продано</span></div><div className="text-xl font-semibold">{data.summary.totalItems}</div></div>
          <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex items-center justify-between mb-1"><Eye className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-400">Просмотры</span></div><div className="text-xl font-semibold">{data.summary.totalViews}</div></div>
          <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex items-center justify-between mb-1"><TrendingUp className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-400">Ср. чек</span></div><div className="text-xl font-semibold">{data.summary.averageOrderValue.toFixed(0)} €</div></div>
        </div>

        {/* Sales by month */}
        {data.salesByMonth.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Продажи по месяцам</h2>
            <div className="space-y-3">
              {data.salesByMonth.slice(-6).map((month: any) => (
                <div key={month.month}>
                  <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">{month.month}</span><span className="font-medium">{month.revenue.toFixed(0)} €</span></div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gray-900 rounded-full" style={{ width: `${Math.min(100, (month.revenue / Math.max(...data.salesByMonth.map((m: any) => m.revenue))) * 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top products */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200"><h2 className="text-sm font-medium text-gray-900">🏆 Топ товары</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b"><tr className="text-left text-xs font-medium text-gray-500"><th className="px-6 py-3">Товар</th><th className="px-6 py-3">Цена</th><th className="px-6 py-3">Продажи</th><th className="px-6 py-3">Выручка</th><th className="px-6 py-3">Конверсия</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {data.topProducts.slice(0, 10).map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm">{product.title.length > 40 ? product.title.slice(0, 40) + '...' : product.title}</td>
                    <td className="px-6 py-3 text-sm font-medium">{product.price} €</td>
                    <td className="px-6 py-3 text-sm">{product.soldCount}</td>
                    <td className="px-6 py-3 text-sm font-medium">{product.revenue.toFixed(0)} €</td>
                    <td className="px-6 py-3 text-sm"><span className={`text-xs px-2 py-0.5 rounded-full ${product.conversionRate > 5 ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{product.conversionRate.toFixed(1)}%</span></td>
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

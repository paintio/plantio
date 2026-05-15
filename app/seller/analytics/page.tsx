'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  TrendingUp, DollarSign, ShoppingBag, Eye, Package, 
  Calendar, Download, RefreshCw, ArrowLeft,
  TrendingDown, Award, Users, Clock
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
  ArcElement, PointElement, LineElement, Filler
)

export default function SellerAnalytics() {
  const [period, setPeriod] = useState('year')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setLoading(true)
    const res = await fetch(`/api/seller/analytics?period=${period}`)
    const analyticsData = await res.json()
    setData(analyticsData)
    setLoading(false)
  }

  if (loading || !data) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>
  }

  const revenueChartData = {
    labels: data.salesData.map((d: any) => d.month),
    datasets: [{
      label: 'Выручка (€)',
      data: data.salesData.map((d: any) => d.revenue),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }

  const ordersChartData = {
    labels: data.salesData.map((d: any) => d.month),
    datasets: [{
      label: 'Заказы',
      data: data.salesData.map((d: any) => d.orders),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }

  const categoryChartData = {
    labels: data.salesByCategory.map((c: any) => c.category),
    datasets: [{
      data: data.salesByCategory.map((c: any) => c.revenue),
      backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderWidth: 0
    }]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/seller" className="text-gray-400 hover:text-gray-600">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Аналитика продаж</h1>
            </div>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-sm rounded-lg transition ${period === p ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border'}`}>
                  {p === 'week' ? 'Неделя' : p === 'month' ? 'Месяц' : 'Год'}
                </button>
              ))}
              <button onClick={fetchAnalytics} className="p-1.5 bg-white border rounded-lg hover:bg-gray-50">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-green-600" /><span className="text-xs text-gray-400">Выручка</span></div><div className="text-2xl font-bold">{data.summary.totalRevenue} €</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><ShoppingBag className="w-4 h-4 text-blue-600" /><span className="text-xs text-gray-400">Заказы</span></div><div className="text-2xl font-bold">{data.summary.totalOrders}</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><Eye className="w-4 h-4 text-yellow-600" /><span className="text-xs text-gray-400">Просмотры</span></div><div className="text-2xl font-bold">{data.summary.totalViews}</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-purple-600" /><span className="text-xs text-gray-400">Конверсия</span></div><div className="text-2xl font-bold">{data.summary.conversionRate}%</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-orange-600" /><span className="text-xs text-gray-400">Ср. чек</span></div><div className="text-2xl font-bold">{data.summary.averageOrderValue} €</div></div>
          <div className="bg-white rounded-xl border p-4"><div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-teal-600" /><span className="text-xs text-gray-400">Прибыль</span></div><div className="text-2xl font-bold">{data.summary.profitMargin}%</div></div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6"><h3 className="font-semibold mb-4">📈 Динамика выручки</h3><Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} /></div>
          <div className="bg-white rounded-xl border p-6"><h3 className="font-semibold mb-4">📊 Динамика заказов</h3><Line data={ordersChartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} /></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6"><h3 className="font-semibold mb-4">🥧 Продажи по категориям</h3><div className="h-64"><Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} /></div></div>
          <div className="bg-white rounded-xl border p-6"><h3 className="font-semibold mb-4">🏆 Топ-5 товаров</h3><div className="space-y-3">{data.topProducts.map((p: any, i: number) => (<div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><div><div className="font-medium">{p.name}</div><div className="text-sm text-gray-500">{p.sales} продаж</div></div><div className="text-right"><div className="font-bold text-green-600">{p.revenue} €</div><div className="text-sm text-green-500">+{p.growth}%</div></div></div>))}</div></div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="px-6 py-4 border-b"><h3 className="font-semibold">📦 Последние заказы</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full"><thead className="bg-gray-50 border-b"><tr className="text-left text-sm"><th className="px-6 py-3">№</th><th className="px-6 py-3">Покупатель</th><th className="px-6 py-3">Сумма</th><th className="px-6 py-3">Статус</th><th className="px-6 py-3">Дата</th></tr></thead>
            <tbody>{data.recentOrders.map((order: any) => (<tr key={order.id} className="border-t"><td className="px-6 py-4 font-mono text-sm">{order.id}</td><td className="px-6 py-4">{order.customer}</td><td className="px-6 py-4 font-semibold">{order.amount} €</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status === 'delivered' ? 'Доставлен' : order.status === 'shipped' ? 'Отправлен' : 'Оплачен'}</span></td><td className="px-6 py-4 text-gray-500">{order.date}</td></tr>))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

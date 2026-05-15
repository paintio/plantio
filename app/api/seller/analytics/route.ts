import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || 'year'
  
  // Тестовые данные для аналитики
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  const salesData = months.map((month, i) => ({
    month,
    revenue: 500 + Math.floor(Math.random() * 3000),
    orders: 5 + Math.floor(Math.random() * 40),
    profit: 200 + Math.floor(Math.random() * 2000)
  }))
  
  const topProducts = [
    { name: 'Монстера Делициоза', sales: 45, revenue: 2025, growth: 12 },
    { name: 'Фикус Бенджамина', sales: 38, revenue: 950, growth: 8 },
    { name: 'Кактус Сан-Педро', sales: 32, revenue: 960, growth: 15 },
    { name: 'Спатифиллум', sales: 28, revenue: 980, growth: 5 },
    { name: 'Сансевиерия', sales: 25, revenue: 625, growth: 20 }
  ]
  
  const recentOrders = [
    { id: 'ORD-001', customer: 'Анна Иванова', amount: 45, status: 'delivered', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Петр Сидоров', amount: 78, status: 'shipped', date: '2024-01-14' },
    { id: 'ORD-003', customer: 'Мария Петрова', amount: 30, status: 'paid', date: '2024-01-14' }
  ]
  
  const salesByCategory = [
    { category: 'Комнатные', revenue: 5240, percentage: 42 },
    { category: 'Суккуленты', revenue: 3120, percentage: 25 },
    { category: 'Садовые', revenue: 4220, percentage: 33 }
  ]
  
  return NextResponse.json({
    summary: {
      totalRevenue: 12580,
      totalOrders: 342,
      averageOrderValue: 36.78,
      conversionRate: 3.2,
      totalViews: 12450,
      profitMargin: 42.5
    },
    salesData,
    topProducts,
    recentOrders,
    salesByCategory
  })
}

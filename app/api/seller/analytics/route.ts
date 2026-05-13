import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get('sellerId')
    
    if (!sellerId) {
      return NextResponse.json({ error: 'sellerId required' }, { status: 400 })
    }
    
    const listings = db.getListings().filter((l: any) => l.sellerId === sellerId)
    const allOrders = db.getAllOrders()
    
    // Находим заказы, которые содержат товары этого продавца
    const orders = allOrders.filter((order: any) => {
      return order.items.some((item: any) => {
        return listings.some((l: any) => l.id === item.listingId)
      })
    })
    
    // Общая статистика
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.total, 0)
    const totalOrders = orders.length
    const totalItems = orders.reduce((sum: number, o: any) => {
      return sum + o.items.reduce((s: number, i: any) => s + i.quantity, 0)
    }, 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    // Статистика по товарам
    const productStats = listings.map((listing: any) => {
      let soldCount = 0
      orders.forEach((order: any) => {
        const item = order.items.find((i: any) => i.listingId === listing.id)
        if (item) soldCount += item.quantity
      })
      const revenue = soldCount * listing.price
      return {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        views: listing.views || 0,
        soldCount,
        revenue,
        conversionRate: listing.views > 0 ? (soldCount / listing.views) * 100 : 0
      }
    }).sort((a: any, b: any) => b.revenue - a.revenue)
    
    // Статистика по месяцам
    const salesByMonth: Record<string, { revenue: number; count: number }> = {}
    orders.forEach((order: any) => {
      const month = new Date(order.createdAt).toISOString().slice(0, 7)
      if (!salesByMonth[month]) salesByMonth[month] = { revenue: 0, count: 0 }
      salesByMonth[month].revenue += order.total
      salesByMonth[month].count += 1
    })
    
    // Статистика по городам
    const salesByCity: Record<string, { revenue: number; count: number }> = {}
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        const listing = listings.find((l: any) => l.id === item.listingId)
        if (listing) {
          if (!salesByCity[listing.city]) salesByCity[listing.city] = { revenue: 0, count: 0 }
          salesByCity[listing.city].revenue += item.price * item.quantity
          salesByCity[listing.city].count += item.quantity
        }
      })
    })
    
    return NextResponse.json({
      summary: {
        totalRevenue,
        totalOrders,
        totalItems,
        averageOrderValue,
        totalProducts: listings.length,
        totalViews: listings.reduce((sum: number, l: any) => sum + (l.views || 0), 0)
      },
      topProducts: productStats,
      salesByMonth: Object.entries(salesByMonth).map(([month, data]) => ({ month, ...data })).sort((a, b) => a.month.localeCompare(b.month)),
      salesByCity: Object.entries(salesByCity).map(([city, data]) => ({ city, ...data })).sort((a, b) => b.revenue - a.revenue),
      products: productStats
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

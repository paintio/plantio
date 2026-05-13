import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data.json')

const getData = () => JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
const saveData = (data: any) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    const data = getData()
    
    if (action === 'stats') {
      const users = data.users || []
      const listings = data.listings || []
      const orders = data.orders || []
      
      return NextResponse.json({
        totalUsers: users.length,
        totalListings: listings.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
        usersByType: {
          private: users.filter((u: any) => u.userType === 'private').length,
          business: users.filter((u: any) => u.userType === 'business').length
        },
        listingsByCategory: listings.reduce((acc: any, l: any) => {
          acc[l.category] = (acc[l.category] || 0) + 1
          return acc
        }, {})
      })
    }
    
    if (action === 'users') {
      const users = data.users || []
      return NextResponse.json(users.map(({ password, ...u }: any) => u))
    }
    
    if (action === 'listings') {
      const listings = data.listings || []
      return NextResponse.json(listings)
    }
    
    if (action === 'orders') {
      const orders = data.orders || []
      return NextResponse.json(orders)
    }
    
    if (action === 'categories') {
      const categories = data.categories || []
      return NextResponse.json(categories)
    }
    
    if (action === 'banners') {
      const banners = data.banners || []
      return NextResponse.json(banners)
    }
    
    if (action === 'promocodes') {
      const promocodes = data.promocodes || []
      return NextResponse.json(promocodes)
    }
    
    if (action === 'commissions') {
      return NextResponse.json(data.commissions || { platform: 10, paymentSystem: 2.5 })
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Admin API GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, id, ...updates } = body
    const data = getData()
    
    if (action === 'user' && id) {
      const index = data.users.findIndex((u: any) => u.id === id)
      if (index !== -1) {
        data.users[index] = { ...data.users[index], ...updates }
        saveData(data)
        return NextResponse.json({ success: true, user: data.users[index] })
      }
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    if (action === 'order' && id) {
      const index = data.orders.findIndex((o: any) => o.id === id)
      if (index !== -1) {
        data.orders[index].status = updates.status
        saveData(data)
        return NextResponse.json({ success: true, order: data.orders[index] })
      }
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    
    if (action === 'banner' && id) {
      const index = data.banners.findIndex((b: any) => b.id === id)
      if (index !== -1) {
        data.banners[index] = { ...data.banners[index], ...updates }
        saveData(data)
        return NextResponse.json({ success: true, banner: data.banners[index] })
      }
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
    }
    
    if (action === 'commissions') {
      data.commissions = updates
      saveData(data)
      return NextResponse.json({ success: true, commissions: data.commissions })
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Admin API PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...dataItem } = body
    const data = getData()
    
    if (action === 'banner') {
      const newBanner = {
        id: Date.now().toString(),
        ...dataItem,
        active: true,
        createdAt: new Date().toISOString()
      }
      if (!data.banners) data.banners = []
      data.banners.push(newBanner)
      saveData(data)
      return NextResponse.json({ success: true, banner: newBanner })
    }
    
    if (action === 'promocode') {
      const newPromocode = {
        ...dataItem,
        createdAt: new Date().toISOString()
      }
      if (!data.promocodes) data.promocodes = []
      data.promocodes.push(newPromocode)
      saveData(data)
      return NextResponse.json({ success: true, promocode: newPromocode })
    }
    
    if (action === 'category') {
      const newCategory = {
        id: Date.now().toString(),
        ...dataItem,
        subcategories: []
      }
      if (!data.categories) data.categories = []
      data.categories.push(newCategory)
      saveData(data)
      return NextResponse.json({ success: true, category: newCategory })
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Admin API POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const id = searchParams.get('id')
    const data = getData()
    
    if (action === 'user' && id) {
      const user = data.users.find((u: any) => u.id === id)
      if (user?.isAdmin) {
        return NextResponse.json({ error: 'Cannot delete admin' }, { status: 400 })
      }
      data.users = data.users.filter((u: any) => u.id !== id)
      saveData(data)
      return NextResponse.json({ success: true })
    }
    
    if (action === 'listing' && id) {
      data.listings = data.listings.filter((l: any) => l.id !== id)
      saveData(data)
      return NextResponse.json({ success: true })
    }
    
    if (action === 'banner' && id) {
      data.banners = data.banners.filter((b: any) => b.id !== id)
      saveData(data)
      return NextResponse.json({ success: true })
    }
    
    if (action === 'promocode' && id) {
      data.promocodes = data.promocodes.filter((p: any) => p.code !== id)
      saveData(data)
      return NextResponse.json({ success: true })
    }
    
    if (action === 'category' && id) {
      data.categories = data.categories.filter((c: any) => c.id !== id)
      saveData(data)
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Admin API DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

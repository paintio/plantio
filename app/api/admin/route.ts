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
        }
      })
    }
    if (action === 'users') return NextResponse.json(data.users || [])
    if (action === 'listings') return NextResponse.json(data.listings || [])
    if (action === 'orders') return NextResponse.json(data.orders || [])
    if (action === 'categories') return NextResponse.json(data.categories || [])
    if (action === 'banners') return NextResponse.json(data.banners || [])
    if (action === 'promocodes') return NextResponse.json(data.promocodes || [])
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const id = searchParams.get('id')
    const data = getData()
    
    if (action === 'user' && id) {
      data.users = data.users.filter((u: any) => u.id !== parseInt(id))
      saveData(data)
      return NextResponse.json({ success: true })
    }
    if (action === 'listing' && id) {
      data.listings = data.listings.filter((l: any) => l.id !== parseInt(id))
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
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, id, status } = body
    const data = getData()
    
    if (action === 'order' && id) {
      const index = data.orders.findIndex((o: any) => o.id === parseInt(id))
      if (index !== -1) {
        data.orders[index].status = status
        saveData(data)
        return NextResponse.json({ success: true })
      }
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

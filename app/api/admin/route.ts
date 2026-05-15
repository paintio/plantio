import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  if (action === 'users') {
    const { data, error } = await supabase.from('users').select('*')
    if (error) return NextResponse.json([])
    return NextResponse.json(data)
  }
  
  if (action === 'listings') {
    const { data, error } = await supabase.from('listings').select('*')
    if (error) return NextResponse.json([])
    return NextResponse.json(data)
  }
  
  if (action === 'stats') {
    const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
    const { count: listingsCount } = await supabase.from('listings').select('*', { count: 'exact', head: true })
    return NextResponse.json({ totalUsers: usersCount, totalListings: listingsCount })
  }
  
  return NextResponse.json([])
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const id = searchParams.get('id')
  
  if (action === 'user' && id) {
    await supabase.from('users').delete().eq('id', id)
    return NextResponse.json({ success: true })
  }
  
  if (action === 'listing' && id) {
    await supabase.from('listings').delete().eq('id', id)
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}

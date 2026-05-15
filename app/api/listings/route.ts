import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    
    let query = supabase.from('listings').select('*').order('created_at', { ascending: false })
    
    if (search) {
      query = query.ilike('title', `%${search}%`)
    }
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return NextResponse.json({ listings: data || [], total: data?.length || 0 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Проверка подключения
export async function testConnection() {
  const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
  return { success: !error, error }
}

// Экспортируем db как объект с методами
export const db = {
  // Пользователи
  async getUsers() {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw error
    return data
  },
  
  async getUserById(id: number) {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
    if (error) return null
    return data
  },
  
  async getUserByEmail(email: string) {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single()
    if (error) return null
    return data
  },
  
  async createUser(user: any) {
    const { data, error } = await supabase.from('users').insert({
      email: user.email,
      name: user.name,
      password: user.password,
      phone: user.phone,
      city: user.city,
      user_type: user.userType,
      balance: user.balance || 0
    }).select().single()
    if (error) throw error
    return data
  },
  
  async updateUserBalance(userId: number, amount: number) {
    const { data: user } = await supabase.from('users').select('balance').eq('id', userId).single()
    const newBalance = (user?.balance || 0) + amount
    
    const { data, error } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return data
  },
  
  // Товары
  async getListings() {
    const { data, error } = await supabase
      .from('listings')
      .select('*, seller:users(id, name, email)')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  
  async getListing(id: number) {
    const { data, error } = await supabase
      .from('listings')
      .select('*, seller:users(id, name, email, phone, city)')
      .eq('id', id)
      .single()
    if (error) return null
    return data
  },
  
  async createListing(listing: any) {
    const { data, error } = await supabase.from('listings').insert({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      city: listing.city,
      image: listing.image,
      category: listing.category,
      seller_id: listing.sellerId,
      seller_type: listing.sellerType,
      stock: listing.stock || 1
    }).select().single()
    if (error) throw error
    return data
  },
  
  async updateListing(id: number, updates: any) {
    const { data, error } = await supabase
      .from('listings')
      .update({
        title: updates.title,
        price: updates.price,
        city: updates.city,
        description: updates.description,
        moderation_status: updates.moderationStatus
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
  
  async deleteListing(id: number) {
    const { error } = await supabase.from('listings').delete().eq('id', id)
    if (error) throw error
  },
  
  // Заказы
  async getOrders(userId?: number) {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (userId) {
      query = query.eq('user_id', userId)
    }
    const { data, error } = await query
    if (error) throw error
    return data
  },
  
  async createOrder(order: any) {
    const { data, error } = await supabase.from('orders').insert({
      user_id: order.userId,
      items: order.items,
      total: order.total,
      status: order.status,
      promocode: order.promocode,
      discount: order.discount
    }).select().single()
    if (error) throw error
    return data
  },
  
  async updateOrderStatus(id: number, status: string) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) throw error
  },
  
  // Категории
  async getCategories() {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order')
    if (error) throw error
    return data
  },
  
  // Баннеры
  async getBanners() {
    const { data, error } = await supabase.from('banners').select('*').eq('active', true)
    if (error) throw error
    return data
  },
  
  // Промокоды
  async getPromocodes() {
    const { data, error } = await supabase.from('promocodes').select('*')
    if (error) throw error
    return data
  },
  
  async validatePromocode(code: string) {
    const { data, error } = await supabase
      .from('promocodes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single()
    if (error) return { valid: false }
    if (new Date(data.expires) < new Date()) return { valid: false }
    return { valid: true, discount: data.discount }
  }
}

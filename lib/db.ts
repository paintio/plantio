import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data.json')

// Инициализация
if (!fs.existsSync(dataPath)) {
  const defaultData = {
    listings: [],
    favorites: [],
    users: [],
    categories: [],
    reviews: [],
    cart: [],
    orders: [],
    messages: [],
    notifications: [],
    expenses: [],
    salaryPayments: [],
    promocodes: [],
    banners: [],
    viewHistory: [],
    tags: ['хит', 'новинка', 'скидка', 'редкий', 'популярный'],
    commissions: { platform: 10, paymentSystem: 2.5 }
  }
  fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2))
}

export const getData = () => JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
export const saveData = (data: any) => fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))

export const db = {
  getData,
  saveData,
  
  // Users
  getUsers: () => getData().users || [],
  getUserById: (id: string) => getData().users?.find((u: any) => u.id === id),
  getUserByEmail: (email: string) => getData().users?.find((u: any) => u.email === email),
  updateUser: (id: string, updates: any) => {
    const data = getData()
    const index = data.users.findIndex((u: any) => u.id === id)
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...updates }
      saveData(data)
      return data.users[index]
    }
    return null
  },
  updateUserBalance: (userId: string, amount: number) => {
    const data = getData()
    const index = data.users.findIndex((u: any) => u.id === userId)
    if (index !== -1) {
      data.users[index].balance = (data.users[index].balance || 0) + amount
      saveData(data)
      return data.users[index]
    }
    return null
  },
  createUser: (user: any) => {
    const data = getData()
    data.users.push(user)
    saveData(data)
    return user
  },
  deleteUser: (id: string) => {
    const data = getData()
    data.users = data.users.filter((u: any) => u.id !== id)
    saveData(data)
  },
  
  // Listings
  getListings: () => getData().listings || [],
  getListing: (id: string) => getData().listings?.find((l: any) => l.id === id),
  createListing: (listing: any) => {
    const data = getData()
    data.listings.unshift(listing)
    saveData(data)
    return listing
  },
  updateListing: (id: string, updates: any) => {
    const data = getData()
    const listings = data.listings || []
    const index = listings.findIndex((l: any) => l.id === id)
    if (index !== -1) {
      listings[index] = { ...listings[index], ...updates, updatedAt: new Date().toISOString() }
      data.listings = listings
      saveData(data)
      return listings[index]
    }
    return null
  },
  deleteListing: (id: string) => {
    const data = getData()
    data.listings = data.listings.filter((l: any) => l.id !== id)
    saveData(data)
  },
  
  // Categories
  getCategories: () => getData().categories || [],
  createCategory: (category: any) => {
    const data = getData()
    data.categories.push(category)
    saveData(data)
    return category
  },
  updateCategory: (id: string, updates: any) => {
    const data = getData()
    const index = data.categories.findIndex((c: any) => c.id === id)
    if (index !== -1) {
      data.categories[index] = { ...data.categories[index], ...updates }
      saveData(data)
      return data.categories[index]
    }
    return null
  },
  deleteCategory: (id: string) => {
    const data = getData()
    data.categories = data.categories.filter((c: any) => c.id !== id)
    saveData(data)
  },
  
  // Orders
  getOrders: (userId?: string) => {
    const data = getData()
    const orders = data.orders || []
    return userId ? orders.filter((o: any) => o.userId === userId) : orders
  },
  getAllOrders: () => getData().orders || [],
  createOrder: (order: any) => {
    const data = getData()
    if (!data.orders) data.orders = []
    data.orders.unshift(order)
    saveData(data)
    return order
  },
  updateOrderStatus: (id: string, status: string) => {
    const data = getData()
    const index = (data.orders || []).findIndex((o: any) => o.id === id)
    if (index !== -1) {
      data.orders[index].status = status
      saveData(data)
      return data.orders[index]
    }
    return null
  },
  
  // Notifications
  addNotification: (notification: any) => {
    const data = getData()
    if (!data.notifications) data.notifications = []
    data.notifications.unshift(notification)
    saveData(data)
    return notification
  },
  getNotifications: (userId: string) => (getData().notifications || []).filter((n: any) => n.userId === userId),
  
  // Banners
  getBanners: () => getData().banners || [],
  createBanner: (banner: any) => {
    const data = getData()
    if (!data.banners) data.banners = []
    data.banners.push(banner)
    saveData(data)
    return banner
  },
  updateBanner: (id: string, updates: any) => {
    const data = getData()
    const index = data.banners.findIndex((b: any) => b.id === id)
    if (index !== -1) {
      data.banners[index] = { ...data.banners[index], ...updates }
      saveData(data)
      return data.banners[index]
    }
    return null
  },
  deleteBanner: (id: string) => {
    const data = getData()
    data.banners = data.banners.filter((b: any) => b.id !== id)
    saveData(data)
  },
  
  // Promocodes
  getPromocodes: () => getData().promocodes || [],
  createPromocode: (promocode: any) => {
    const data = getData()
    if (!data.promocodes) data.promocodes = []
    data.promocodes.push(promocode)
    saveData(data)
    return promocode
  },
  deletePromocode: (code: string) => {
    const data = getData()
    data.promocodes = data.promocodes.filter((p: any) => p.code !== code)
    saveData(data)
  },
  validatePromocode: (code: string) => {
    const promocodes = db.getPromocodes()
    const promo = promocodes.find((p: any) => p.code === code)
    if (!promo) return { valid: false }
    if (new Date(promo.expires) < new Date()) return { valid: false }
    return { valid: true, discount: promo.discount }
  },
  
  // Commissions
  getCommissions: () => getData().commissions || { platform: 10, paymentSystem: 2.5 },
  updateCommissions: (commissions: any) => {
    const data = getData()
    data.commissions = commissions
    saveData(data)
    return commissions
  },
  
  // Cart
  getCart: (userId: string) => (getData().cart || []).filter((item: any) => item.userId === userId),
  addToCart: (userId: string, listingId: string, quantity: number = 1) => {
    const data = getData()
    if (!data.cart) data.cart = []
    const existing = data.cart.find((item: any) => item.userId === userId && item.listingId === listingId)
    if (existing) {
      existing.quantity += quantity
    } else {
      data.cart.push({ id: Date.now().toString(), userId, listingId, quantity, addedAt: new Date().toISOString() })
    }
    saveData(data)
    return db.getCart(userId)
  },
  removeFromCart: (userId: string, cartItemId: string) => {
    const data = getData()
    data.cart = (data.cart || []).filter((item: any) => !(item.userId === userId && item.id === cartItemId))
    saveData(data)
    return db.getCart(userId)
  },
  clearCart: (userId: string) => {
    const data = getData()
    data.cart = (data.cart || []).filter((item: any) => item.userId !== userId)
    saveData(data)
  },
  
  // Expenses
  getExpenses: (userId: string) => (getData().expenses || []).filter((e: any) => e.userId === userId),
  addExpense: (expense: any) => {
    const data = getData()
    if (!data.expenses) data.expenses = []
    data.expenses.push(expense)
    saveData(data)
    return expense
  },
  deleteExpense: (id: string) => {
    const data = getData()
    data.expenses = (data.expenses || []).filter((e: any) => e.id !== id)
    saveData(data)
  },
  
  // Salary
  getSalaryPayments: (userId: string) => (getData().salaryPayments || []).filter((s: any) => s.userId === userId),
  addSalaryPayment: (payment: any) => {
    const data = getData()
    if (!data.salaryPayments) data.salaryPayments = []
    data.salaryPayments.push(payment)
    saveData(data)
    return payment
  },
  updateSalaryStatus: (id: string, status: string) => {
    const data = getData()
    const index = (data.salaryPayments || []).findIndex((s: any) => s.id === id)
    if (index !== -1) {
      data.salaryPayments[index].status = status
      saveData(data)
      return data.salaryPayments[index]
    }
    return null
  },
  
  // Stats
  getSellerStats: (userId: string) => {
    const orders = db.getOrders(userId)
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
    const expenses = db.getExpenses(userId)
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0)
    const salaries = db.getSalaryPayments(userId)
    const totalSalaries = salaries.reduce((sum: number, s: any) => sum + (s.status === 'paid' ? s.amount : 0), 0)
    const commissions = db.getCommissions()
    const platformCommission = totalRevenue * commissions.platform / 100
    const netProfit = totalRevenue - totalExpenses - totalSalaries - platformCommission
    return { totalRevenue, totalExpenses, totalSalaries, platformCommission, netProfit, ordersCount: orders.length, expensesCount: expenses.length }
  }
}

// Создаем тестовые данные если нет
const users = db.getUsers()
if (users.length === 0) {
  const testUsers = [
    { id: '1', email: 'admin@plantio.com', name: 'Администратор', password: 'admin123', phone: '+7 (999) 000-00-00', city: 'Москва', userType: 'private', balance: 10000, avatar: '', createdAt: new Date().toISOString(), isAdmin: true },
    { id: '2', email: 'demo@plantio.com', name: 'Анна Иванова', password: 'demo123', phone: '+7 (999) 123-45-67', city: 'Москва', userType: 'private', balance: 1000, avatar: '', createdAt: new Date().toISOString(), isAdmin: false },
    { id: '3', email: 'seller@plantio.com', name: 'Иван Петров', password: 'seller123', phone: '+7 (777) 123-45-67', city: 'Казань', userType: 'private', balance: 500, avatar: '', createdAt: new Date().toISOString(), isAdmin: false }
  ]
  const data = db.getData()
  data.users = testUsers
  db.saveData(data)
  console.log('✅ Тестовые пользователи добавлены')
}

// Создаем тестовые товары
const listings = db.getListings()
if (listings.length === 0) {
  const testListings = [
    { id: '1001', title: 'Монстера Делициоза', description: 'Красивое комнатное растение', price: 45, city: 'Москва', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6', category: 'Комнатные растения', tags: ['хит'], phone: '+7 (999) 123-45-67', sellerId: '2', sellerType: 'private', isModerated: true, moderationStatus: 'approved', views: 156, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '1002', title: 'Кактус Сан-Педро', description: 'Редкий кактус', price: 30, city: 'СПб', image: 'https://images.unsplash.com/photo-1484047103223-1ead3e9ddd4f', category: 'Суккуленты', tags: ['редкий'], phone: '+7 (888) 123-45-67', sellerId: '3', sellerType: 'private', isModerated: false, moderationStatus: 'pending', views: 89, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ]
  const data = db.getData()
  data.listings = testListings
  db.saveData(data)
  console.log('✅ Тестовые товары добавлены')
}

// Создаем категории
const categories = db.getCategories()
if (categories.length === 0) {
  const defaultCategories = [
    { id: '1', name: 'Комнатные растения', slug: 'komnatnye', icon: '🏠', order: 1, subcategories: [] },
    { id: '2', name: 'Суккуленты', slug: 'sukkulenty', icon: '🌵', order: 2, subcategories: [] },
    { id: '3', name: 'Садовые растения', slug: 'sadovye', icon: '🌻', order: 3, subcategories: [] }
  ]
  const data = db.getData()
  data.categories = defaultCategories
  db.saveData(data)
  console.log('✅ Категории добавлены')
}

// Создаем баннеры
const banners = db.getBanners()
if (banners.length === 0) {
  const defaultBanners = [
    { id: '1', title: 'Весенняя распродажа', subtitle: 'Скидка до 50%', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735', buttonText: 'Купить', link: '/catalog', color: 'from-green-500 to-emerald-600', active: true, createdAt: new Date().toISOString() }
  ]
  const data = db.getData()
  data.banners = defaultBanners
  db.saveData(data)
  console.log('✅ Баннеры добавлены')
}

const fs = require('fs');
const path = require('path');
const dataPath = path.join(process.cwd(), 'data.json');

let data = { users: [], listings: [], categories: [], orders: [], banners: [], promocodes: [] };

if (fs.existsSync(dataPath)) {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

// Создаем пользователей
data.users = [
  {
    id: '1',
    email: 'admin@plantio.com',
    name: 'Администратор',
    password: 'admin123',
    phone: '+7 (999) 123-45-67',
    city: 'Москва',
    userType: 'private',
    balance: 10000,
    avatar: '',
    createdAt: new Date().toISOString(),
    isAdmin: true,
    isBlocked: false,
    sellerRating: 5,
    totalSales: 0
  },
  {
    id: '2',
    email: 'seller@plantio.com',
    name: 'Иван Продавец',
    password: 'seller123',
    phone: '+7 (999) 234-56-78',
    city: 'Санкт-Петербург',
    userType: 'private',
    balance: 500,
    avatar: '',
    createdAt: new Date().toISOString(),
    isAdmin: false,
    isBlocked: false,
    sellerRating: 4.8,
    totalSales: 15
  },
  {
    id: '3',
    email: 'user@plantio.com',
    name: 'Петр Покупатель',
    password: 'user123',
    phone: '+7 (999) 345-67-89',
    city: 'Казань',
    userType: 'private',
    balance: 200,
    avatar: '',
    createdAt: new Date().toISOString(),
    isAdmin: false,
    isBlocked: false,
    sellerRating: 0,
    totalSales: 0
  },
  {
    id: '4',
    email: 'business@plantio.com',
    name: 'ООО Растения',
    password: 'business123',
    phone: '+7 (999) 456-78-90',
    city: 'Новосибирск',
    userType: 'business',
    balance: 5000,
    avatar: '',
    createdAt: new Date().toISOString(),
    isAdmin: false,
    isBlocked: false,
    sellerRating: 4.9,
    totalSales: 128
  }
];

// Создаем тестовые товары
if (!data.listings || data.listings.length === 0) {
  data.listings = [
    {
      id: '1001',
      title: 'Монстера Делициоза',
      description: 'Красивое комнатное растение с большими листьями',
      price: 45,
      city: 'Москва',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
      category: 'Комнатные растения',
      sellerId: '2',
      sellerType: 'private',
      views: 156,
      moderationStatus: 'approved',
      isModerated: true,
      stock: 5,
      stockType: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '1002',
      title: 'Кактус Сан-Педро',
      description: 'Редкий кактус, цветет красивыми цветами',
      price: 30,
      city: 'Санкт-Петербург',
      image: 'https://images.unsplash.com/photo-1484047103223-1ead3e9ddd4f',
      category: 'Суккуленты',
      sellerId: '4',
      sellerType: 'business',
      views: 89,
      moderationStatus: 'pending',
      isModerated: false,
      stock: 3,
      stockType: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '1003',
      title: 'Фикус Бенджамина',
      description: 'Классическое комнатное растение',
      price: 25,
      city: 'Казань',
      image: 'https://images.unsplash.com/photo-1509423350716-481729ef494a',
      category: 'Комнатные растения',
      sellerId: '2',
      sellerType: 'private',
      views: 234,
      moderationStatus: 'approved',
      isModerated: true,
      stock: 10,
      stockType: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

// Создаем категории
if (!data.categories || data.categories.length === 0) {
  data.categories = [
    { id: '1', name: 'Комнатные растения', slug: 'komnatnye', icon: '🏠', order: 1 },
    { id: '2', name: 'Суккуленты', slug: 'sukkulenty', icon: '🌵', order: 2 },
    { id: '3', name: 'Садовые растения', slug: 'sadovye', icon: '🌻', order: 3 },
    { id: '4', name: 'Редкие растения', slug: 'redkie', icon: '⭐', order: 4 }
  ];
}

// Создаем баннеры
if (!data.banners || data.banners.length === 0) {
  data.banners = [
    {
      id: '1',
      title: 'Весенняя распродажа',
      subtitle: 'Скидка до 50% на комнатные растения',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735',
      buttonText: 'Купить',
      link: '/catalog',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Новые поступления',
      subtitle: 'Редкие растения из Азии',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
      buttonText: 'Смотреть',
      link: '/catalog',
      active: true,
      createdAt: new Date().toISOString()
    }
  ];
}

// Создаем промокоды
if (!data.promocodes || data.promocodes.length === 0) {
  data.promocodes = [
    { code: 'WELCOME10', discount: 10, expires: new Date(Date.now() + 30*24*60*60*1000).toISOString() },
    { code: 'PLANTIO20', discount: 20, expires: new Date(Date.now() + 60*24*60*60*1000).toISOString() }
  ];
}

// Создаем массив заказов
if (!data.orders) data.orders = [];

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('✅ Данные успешно созданы!');
console.log('📊 Пользователей:', data.users.length);
console.log('🌿 Товаров:', data.listings.length);
console.log('🏷️ Категорий:', data.categories.length);
console.log('🎨 Баннеров:', data.banners.length);
console.log('🎫 Промокодов:', data.promocodes.length);
console.log('');
console.log('🔑 Тестовые аккаунты:');
console.log('   Админ: admin@plantio.com / admin123');
console.log('   Продавец: seller@plantio.com / seller123');
console.log('   Пользователь: user@plantio.com / user123');
console.log('   Бизнес: business@plantio.com / business123');

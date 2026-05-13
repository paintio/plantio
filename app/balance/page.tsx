'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BalancePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [transactions, setTransactions] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'me' }) })
    const data = await res.json()
    if (!data.user) {
      router.push('/')
    } else {
      setUser(data.user)
      loadTransactions(data.user.id)
    }
    setLoading(false)
  }

  const loadTransactions = async (userId: string) => {
    // Загружаем историю транзакций из заказов
    const ordersRes = await fetch(`/api/orders?userId=${userId}`)
    const orders = await ordersRes.json()
    const tx = orders.map((order: any) => ({
      id: order.id,
      amount: -order.total,
      type: 'order',
      description: `Заказ #${order.id.slice(-8)}`,
      date: order.createdAt,
      status: order.status
    }))
    setTransactions(tx)
  }

  const addBalance = async () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Введите корректную сумму')
      return
    }

    const res = await fetch('/api/balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, amount: numAmount })
    })
    
    if (res.ok) {
      const data = await res.json()
      setUser(data.user)
      setAmount('')
      setShowModal(false)
      alert(`Баланс пополнен на ${numAmount} €`)
    } else {
      alert('Ошибка при пополнении')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              🌱 Plantio
            </Link>
            <Link href="/" className="text-gray-500 hover:text-green-600 transition">
              ← На главную
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Баланс карточка */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <p className="text-green-100 mb-1">Ваш баланс</p>
              <p className="text-5xl font-bold">{user.balance.toFixed(2)} €</p>
              <p className="text-green-100 mt-2 text-sm">Доступно для покупок</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-green-700 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Пополнить баланс
            </button>
          </div>
        </div>

        {/* История операций */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">📜 История операций</h2>
          </div>
          <div className="divide-y">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Нет операций. Пополните баланс чтобы начать покупки
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                  <div>
                    <p className="font-semibold text-gray-800">{tx.description}</p>
                    <p className="text-sm text-gray-400">{new Date(tx.date).toLocaleString('ru-RU')}</p>
                    <p className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                      tx.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tx.status === 'paid' ? 'Завершено' : 'Ожидает'}
                    </p>
                  </div>
                  <div className={`text-xl font-bold ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.amount < 0 ? '' : '+'}{tx.amount} €
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Информация */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl text-sm text-blue-700">
          💡 Средства на балансе можно использовать для покупки товаров на маркетплейсе.
          Пополнение происходит моментально. Комиссия за пополнение не взимается.
        </div>
      </div>

      {/* Модальное окно пополнения */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">💰 Пополнение баланса</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Сумма пополнения (€)</label>
              <input
                type="number"
                placeholder="Введите сумму"
                className="w-full px-4 py-3 border rounded-xl"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[10, 50, 100].map(sum => (
                <button
                  key={sum}
                  onClick={() => setAmount(sum.toString())}
                  className="py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  {sum} €
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={addBalance}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold"
              >
                Пополнить
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

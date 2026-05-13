'use client'

import { useState } from 'react'
import Modal from './Modal'

interface PromoteModalProps {
  isOpen: boolean
  onClose: () => void
  listingId: string
  onPromote: () => void
}

export default function PromoteModal({ isOpen, onClose, listingId, onPromote }: PromoteModalProps) {
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)

  const prices = {
    7: 10,
    14: 15,
    30: 25
  }

  const handlePromote = async () => {
    setLoading(true)
    const res = await fetch('/api/listings/promote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: listingId, days })
    })
    if (res.ok) {
      onPromote()
      onClose()
    } else {
      alert('Ошибка при продвижении')
    }
    setLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🚀 Продвижение объявления">
      <div className="space-y-4">
        <p className="text-gray-600">
          Продвинутое объявление будет показываться в топе каталога
        </p>
        
        <div className="space-y-2">
          {[7, 14, 30].map(d => (
            <label key={d} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="days"
                  value={d}
                  checked={days === d}
                  onChange={() => setDays(d)}
                  className="w-4 h-4 text-green-600"
                />
                <span>{d} дней</span>
              </div>
              <span className="font-bold text-green-600">{prices[d as keyof typeof prices]} €</span>
            </label>
          ))}
        </div>
        
        <button
          onClick={handlePromote}
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Обработка...' : 'Продвинуть за ' + prices[days as keyof typeof prices] + ' €'}
        </button>
      </div>
    </Modal>
  )
}

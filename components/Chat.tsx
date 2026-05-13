'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string
  fromUserId: string
  toUserId: string
  text: string
  isRead: boolean
  createdAt: string
}

interface ChatProps {
  currentUserId: string
  otherUserId: string
  listingId?: string
}

export default function Chat({ currentUserId, otherUserId, listingId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [otherUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages?userId=${currentUserId}&otherUserId=${otherUserId}`)
    const data = await res.json()
    setMessages(data)
    setLoading(false)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromUserId: currentUserId,
        toUserId: otherUserId,
        listingId: listingId || '',
        text: newMessage
      })
    })

    if (res.ok) {
      setNewMessage('')
      fetchMessages()
    }
  }

  if (loading) return <div className="p-4 text-center">Загрузка чата...</div>

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Нет сообщений. Напишите что-нибудь!
          </div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.fromUserId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  msg.fromUserId === currentUserId
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="border-t p-4 flex gap-2">
        <input
          type="text"
          placeholder="Введите сообщение..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Отправить
        </button>
      </form>
    </div>
  )
}

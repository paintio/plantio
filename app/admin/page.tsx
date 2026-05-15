'use client'

import { Suspense } from 'react'
import AdminContent from './AdminContent'

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Загрузка...</div>}>
      <AdminContent />
    </Suspense>
  )
}

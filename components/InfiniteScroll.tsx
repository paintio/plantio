'use client'

import { useEffect, useRef, useCallback } from 'react'

interface InfiniteScrollProps {
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  children: React.ReactNode
}

export default function InfiniteScroll({ loading, hasMore, onLoadMore, children }: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return
    if (observerRef.current) observerRef.current.disconnect()
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore()
      }
    })
    if (node) observerRef.current.observe(node)
  }, [loading, hasMore, onLoadMore])

  return (
    <div>
      {children}
      <div ref={lastElementRef} className="h-10" />
      {loading && <div className="text-center py-4">Загрузка...</div>}
    </div>
  )
}

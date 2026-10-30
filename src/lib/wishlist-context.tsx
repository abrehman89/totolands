'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Product } from '@/components/home/ProductCard'

interface WishlistContextValue {
  items:      Product[]
  toggle:     (product: Product) => void
  isWished:   (id: string) => boolean
  remove:     (id: string) => void
  totalItems: number
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('totolands-wishlist')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try { localStorage.setItem('totolands-wishlist', JSON.stringify(items)) } catch {}
  }, [items])

  function toggle(product: Product) {
    setItems(prev =>
      prev.find(i => i.id === product.id)
        ? prev.filter(i => i.id !== product.id)
        : [...prev, product]
    )
  }

  function remove(id: string) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function isWished(id: string) {
    return items.some(i => i.id === id)
  }

  return (
    <WishlistContext.Provider value={{ items, toggle, isWished, remove, totalItems: items.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider')
  return ctx
}

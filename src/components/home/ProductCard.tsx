'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'

export interface Product {
  id: string
  name: string
  category: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  badge?: 'sale' | 'new' | 'top'
  badgeText?: string
}

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const { toggle, isWished } = useWishlist()
  const wishlisted = isWished(product.id)

  function handleAdd() {
    addItem({ id: product.id, name: product.name, category: product.category,
              price: product.price, oldPrice: product.oldPrice, image: product.image })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="bg-white rounded-[1.25rem] overflow-hidden card-hover
                    border-2 border-transparent hover:border-brand-teal group cursor-pointer">

      {/* Image */}
      <div className="h-[210px] relative bg-brand-green-light overflow-hidden">
        {product.badge === 'sale' && (
          <span className="badge-sale">-{Math.round((1 - product.price / product.oldPrice!) * 100)}%</span>
        )}
        {product.badge === 'new' && <span className="badge-new">New</span>}
        {product.badge === 'top' && <span className="badge-top">🏆 Top Pick</span>}

        <button
          onClick={() => toggle(product)}
          className="absolute top-2.5 right-2.5 bg-white/90 rounded-full w-9 h-9 flex items-center
                     justify-center z-10 hover:bg-white hover:scale-110 transition-all text-lg
                     shadow-md"
          aria-label="Toggle wishlist">
          {wishlisted ? '❤️' : '🤍'}
        </button>

        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-brand-green mb-1">{product.category}</p>
        <Link href={`/products/${product.id}`} className="no-underline">
          <h3 className="font-heading font-semibold text-[0.97rem] text-[#0f1f28] mb-2 leading-snug
                         hover:text-brand-teal transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Stars */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-brand-yellow-dark text-sm">
            {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
          </span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-display text-[1.2rem] text-brand-teal-dark">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="block text-[0.8rem] text-gray-400 line-through">
                Rs. {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`font-heading font-semibold text-[0.82rem] px-3.5 py-1.5 rounded-full
                       flex items-center gap-1 whitespace-nowrap transition-all ${
              added
                ? 'bg-brand-green text-white scale-105'
                : 'bg-brand-teal text-white hover:bg-brand-teal-dark hover:scale-105'
            }`}>
            {added ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

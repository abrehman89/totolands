'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useWishlist } from '@/lib/wishlist-context'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

export default function WishlistClient() {
  const { items, remove } = useWishlist()
  const { addItem } = useCart()
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  function handleAddToCart(item: typeof items[0]) {
    addItem({ id: item.id, name: item.name, category: item.category,
              price: item.price, oldPrice: item.oldPrice, image: item.image })
    setAddedIds(prev => new Set(prev).add(item.id))
    setTimeout(() => setAddedIds(prev => { const s = new Set(prev); s.delete(item.id); return s }), 1500)
  }

  return (
    <main className="min-h-screen bg-brand-off-white">
      {/* Header */}
      <div className="bg-brand-teal py-10">
        <div className="inner">
          <nav className="text-xs font-body text-white/60 mb-3 flex items-center gap-1.5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Wishlist</span>
          </nav>
          <h1 className="font-display text-white" style={{ fontSize: '2rem', fontWeight: 800 }}>
            My Wishlist ❤️
          </h1>
          {items.length > 0 && (
            <p className="font-body text-white/75 text-sm mt-1">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      <div className="inner py-10">

        {/* Empty state */}
        {items.length === 0 && (
          <div className="text-center py-24">
            <div className="text-7xl mb-5">🤍</div>
            <h2 className="font-display text-2xl text-brand-teal-dark mb-3" style={{ fontWeight: 800 }}>
              Your wishlist is empty
            </h2>
            <p className="font-body text-[#3d5a65] mb-8 max-w-sm mx-auto">
              Browse our products and tap the heart icon to save your favourites here.
            </p>
            <Link href="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        )}

        {/* Grid */}
        {items.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map(item => {
                const isAdded = addedIds.has(item.id)
                const discount = item.oldPrice
                  ? Math.round((1 - item.price / item.oldPrice) * 100)
                  : null

                return (
                  <div key={item.id}
                    className="bg-white rounded-[1.25rem] overflow-hidden border-2 border-transparent
                               hover:border-brand-teal transition-all group"
                    style={{ boxShadow: '0 4px 20px rgba(46,107,122,0.1)' }}>

                    {/* Image */}
                    <div className="h-[200px] relative bg-brand-green-light overflow-hidden">
                      {discount && (
                        <span className="badge-sale">-{discount}%</span>
                      )}
                      {item.badge === 'new' && <span className="badge-new">New</span>}
                      {item.badge === 'top' && <span className="badge-top">🏆 Top</span>}

                      {/* Remove from wishlist */}
                      <button
                        onClick={() => remove(item.id)}
                        className="absolute top-2.5 right-2.5 bg-white/90 rounded-full w-9 h-9 flex items-center
                                   justify-center z-10 hover:bg-red-50 hover:scale-110 transition-all shadow-md
                                   text-lg"
                        aria-label="Remove from wishlist">
                        ❤️
                      </button>

                      <Link href={`/products/${item.id}`}>
                        <Image src={item.image} alt={item.name} fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      </Link>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-brand-green mb-1">
                        {item.category}
                      </p>
                      <Link href={`/products/${item.id}`} className="no-underline">
                        <h3 className="font-heading font-semibold text-[0.95rem] text-[#0f1f28] leading-snug mb-2
                                       hover:text-brand-teal transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      {/* Stars */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-brand-yellow-dark text-sm">
                          {'★'.repeat(Math.floor(item.rating))}{'☆'.repeat(5 - Math.floor(item.rating))}
                        </span>
                        <span className="text-xs text-gray-400">({item.reviews})</span>
                      </div>

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="font-display text-[1.15rem] text-brand-teal-dark">
                            Rs. {item.price.toLocaleString()}
                          </span>
                          {item.oldPrice && (
                            <span className="block text-[0.78rem] text-gray-400 line-through">
                              Rs. {item.oldPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className={`font-heading font-semibold text-[0.82rem] px-3.5 py-1.5 rounded-full
                                     flex items-center gap-1 whitespace-nowrap transition-all ${
                            isAdded
                              ? 'bg-brand-green text-white scale-105'
                              : 'bg-brand-teal text-white hover:bg-brand-teal-dark hover:scale-105'
                          }`}>
                          {isAdded ? '✓ Added' : '+ Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Continue shopping */}
            <div className="mt-10 text-center">
              <Link href="/products"
                className="inline-flex items-center gap-2 font-heading font-bold text-sm text-brand-teal
                           hover:text-brand-teal-dark transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

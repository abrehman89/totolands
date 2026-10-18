'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

const DELIVERY_FEE = 250
const FREE_DELIVERY_THRESHOLD = 3000

export default function CartClient() {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart()

  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const grandTotal  = totalPrice + deliveryFee

  if (items.length === 0) {
    return (
      <main>
        {/* Header */}
        <section className="bg-brand-teal py-10">
          <div className="inner">
            <p className="section-eyebrow text-brand-yellow">🛒 Shopping</p>
            <h1 className="font-display text-white mt-1" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Your Cart
            </h1>
            <nav className="mt-4 flex items-center gap-2 text-xs font-body text-white/60">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span>/</span>
              <span className="text-white">Cart</span>
            </nav>
          </div>
        </section>

        {/* Empty state */}
        <div className="inner py-24 text-center">
          <p className="text-7xl mb-5">🛒</p>
          <h2 className="font-display text-2xl text-brand-teal-dark mb-3">Your cart is empty</h2>
          <p className="font-body text-gray-400 mb-8">Looks like you haven&apos;t added any toys yet!</p>
          <Link href="/products" className="btn-primary px-8 py-3 text-base">
            Browse Toys
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      {/* Header */}
      <section className="bg-brand-teal py-10">
        <div className="inner">
          <p className="section-eyebrow text-brand-yellow">🛒 Shopping</p>
          <h1 className="font-display text-white mt-1" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            Your Cart
            <span className="font-body text-white/60 text-lg ml-3">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
          </h1>
          <nav className="mt-4 flex items-center gap-2 text-xs font-body text-white/60">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-white">Cart</span>
          </nav>
        </div>
      </section>

      <div className="inner py-8">
        <div className="flex flex-col lg:flex-row gap-7 items-start">

          {/* Cart Items */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Free delivery progress */}
            {totalPrice < FREE_DELIVERY_THRESHOLD && (
              <div className="bg-brand-yellow/20 border border-brand-yellow rounded-xl px-5 py-3.5">
                <p className="font-body text-sm text-brand-teal-dark">
                  Add{' '}
                  <span className="font-semibold">Rs. {(FREE_DELIVERY_THRESHOLD - totalPrice).toLocaleString()}</span>
                  {' '}more for <span className="font-semibold text-brand-green">FREE delivery!</span>
                </p>
                <div className="mt-2 h-2 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-green rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totalPrice / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {totalPrice >= FREE_DELIVERY_THRESHOLD && (
              <div className="bg-brand-green/10 border border-brand-green rounded-xl px-5 py-3.5">
                <p className="font-body text-sm text-brand-green font-semibold">
                  🎉 You qualify for FREE delivery!
                </p>
              </div>
            )}

            {/* Items list */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-display text-lg text-brand-teal-dark">Cart Items</h2>
                <button
                  onClick={clearCart}
                  className="text-xs font-heading font-semibold text-red-400 hover:text-red-600 transition-colors underline underline-offset-2">
                  Clear All
                </button>
              </div>

              <ul className="divide-y divide-gray-100">
                {items.map(item => (
                  <li key={item.id} className="flex gap-4 p-4 sm:p-5">
                    {/* Image */}
                    <Link href={`/products/${item.id}`} className="flex-shrink-0">
                      <div className="relative w-[90px] h-[90px] rounded-xl overflow-hidden bg-brand-green-light">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-brand-green mb-0.5">
                        {item.category}
                      </p>
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-heading font-semibold text-[0.95rem] text-[#0f1f28] leading-snug
                                       hover:text-brand-teal transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
                        {/* Price */}
                        <div>
                          <span className="font-display text-[1.1rem] text-brand-teal-dark">
                            Rs. {(item.price * item.qty).toLocaleString()}
                          </span>
                          {item.qty > 1 && (
                            <span className="text-xs text-gray-400 ml-1.5">
                              (Rs. {item.price.toLocaleString()} each)
                            </span>
                          )}
                        </div>

                        {/* Qty controls + remove */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="w-8 h-8 flex items-center justify-center font-bold text-brand-teal
                                         hover:bg-brand-green-light transition-colors text-lg leading-none">
                              −
                            </button>
                            <span className="w-8 text-center font-heading font-semibold text-[0.9rem] text-[#0f1f28]">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="w-8 h-8 flex items-center justify-center font-bold text-brand-teal
                                         hover:bg-brand-green-light transition-colors text-lg leading-none">
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                            aria-label="Remove item">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6"/>
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Continue shopping */}
            <Link href="/products"
              className="inline-flex items-center gap-2 font-heading font-semibold text-sm
                         text-brand-teal hover:text-brand-teal-dark transition-colors">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[340px] flex-shrink-0 sticky top-24">
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h2 className="font-display text-lg text-brand-teal-dark mb-5">Order Summary</h2>

              <div className="space-y-3 font-body text-sm text-[#3d5a65]">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                  <span className="font-semibold text-[#0f1f28]">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-brand-green' : 'text-[#0f1f28]'}`}>
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between">
                  <span className="font-semibold text-[#0f1f28] text-base">Total</span>
                  <span className="font-display text-[1.2rem] text-brand-teal-dark">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment badges */}
              <div className="mt-5 flex items-center gap-2 flex-wrap">
                <span className="text-[0.72rem] font-body text-gray-400">Pay via:</span>
                {['COD', 'Mastercard', 'Visa', 'JazzCash', 'Easypaisa'].map(method => (
                  <span key={method}
                    className="text-[0.72rem] font-heading font-semibold px-2.5 py-0.5 rounded-full
                               bg-brand-green-light text-brand-teal-dark border border-brand-teal/10">
                    {method}
                  </span>
                ))}
              </div>

              <Link href="/checkout"
                className="mt-5 btn-primary w-full text-center block py-3.5 text-base">
                Proceed to Checkout →
              </Link>

              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[0.72rem] font-body text-gray-400">
                <span>🔒 Secure</span>
                <span>🚚 Fast Delivery</span>
                <span>↩️ Easy Returns</span>
              </div>
            </div>

            {/* Promo code (UI only for now) */}
            <div className="mt-4 bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-heading font-semibold text-sm text-[#0f1f28] mb-3">Promo Code</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex-1 border-2 border-gray-200 rounded-full px-4 py-2 text-sm font-body
                             outline-none focus:border-brand-teal transition-colors text-[#0f1f28]"
                />
                <button className="btn-primary text-sm px-5 py-2">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

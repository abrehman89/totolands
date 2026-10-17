'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProductCard from '@/components/home/ProductCard'
import { ProductDetail, ALL_PRODUCTS } from '@/lib/products-data'

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty]                 = useState(1)
  const [wishlisted, setWishlisted]   = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab]     = useState<'description' | 'features' | 'delivery'>('description')

  const related = ALL_PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null

  function handleAddToCart() {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="inner py-3">
          <nav className="flex items-center gap-2 text-xs font-body text-gray-400">
            <Link href="/"         className="hover:text-brand-teal transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-teal transition-colors">Products</Link>
            <span>/</span>
            <span className="text-brand-teal font-semibold truncate max-w-[180px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main product section */}
      <section className="py-10 bg-brand-off-white">
        <div className="inner">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Left: Image Gallery ── */}
            <div className="lg:w-[480px] flex-shrink-0">
              {/* Main image */}
              <div className="bg-white rounded-2xl overflow-hidden relative shadow-card mb-3"
                   style={{ height: 420 }}>
                {discount && (
                  <span className="badge-sale">-{discount}%</span>
                )}
                {product.badge === 'new' && <span className="badge-new">New</span>}
                {product.badge === 'top' && <span className="badge-top">🏆 Top Pick</span>}
                <Image
                  src={product.images[activeImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImage
                        ? 'border-brand-teal shadow-btn'
                        : 'border-transparent hover:border-gray-300'
                    }`}>
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Right: Product Info ── */}
            <div className="flex-1 min-w-0">

              {/* Category + stock */}
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <Link href={`/category/${product.category.toLowerCase().replace(/ /g, '-')}`}
                  className="text-xs font-heading font-semibold uppercase tracking-wider
                             text-brand-green hover:text-brand-green-dark transition-colors">
                  {product.category}
                </Link>
                {product.stock <= 10 ? (
                  <span className="text-xs font-heading font-semibold text-red-500 bg-red-50
                                   px-3 py-1 rounded-full">
                    Only {product.stock} left!
                  </span>
                ) : (
                  <span className="text-xs font-heading font-semibold text-brand-green bg-green-50
                                   px-3 py-1 rounded-full">
                    ✓ In Stock
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="font-display text-[#0f1f28] leading-snug mb-3"
                  style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-brand-yellow-dark text-lg">
                  {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                </span>
                <span className="font-body text-sm text-gray-400">
                  {product.rating}.0 ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 mb-6 pb-6 border-b border-gray-100">
                <span className="font-display text-brand-teal-dark"
                      style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="font-body text-gray-400 line-through text-lg mb-1">
                    Rs. {product.oldPrice.toLocaleString()}
                  </span>
                )}
                {discount && (
                  <span className="font-heading font-bold text-sm text-white bg-red-500
                                   px-2.5 py-1 rounded-full mb-1">
                    Save Rs. {(product.oldPrice! - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Quick info */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { label: 'Age Range',  value: product.ageRange },
                  { label: 'Material',   value: product.material },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-xl px-4 py-3 shadow-card">
                    <p className="text-[0.68rem] font-heading font-semibold uppercase tracking-wider
                                  text-gray-400 mb-0.5">{label}</p>
                    <p className="font-body text-sm text-[#0f1f28] font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              {/* What's in the box */}
              <div className="bg-brand-green-light rounded-xl px-4 py-3 mb-6">
                <p className="text-[0.7rem] font-heading font-semibold uppercase tracking-wider
                              text-brand-green-dark mb-1">📦 What's in the Box</p>
                <p className="font-body text-sm text-[#3d5a65]">{product.inBox}</p>
              </div>

              {/* Qty + Add to Cart */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {/* Quantity */}
                <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 font-heading font-bold text-brand-teal text-lg
                               hover:bg-brand-green-light transition-colors">
                    −
                  </button>
                  <span className="w-10 text-center font-heading font-semibold text-[#0f1f28]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 font-heading font-bold text-brand-teal text-lg
                               hover:bg-brand-green-light transition-colors">
                    +
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 min-w-[160px] font-heading font-bold text-base py-3 rounded-full
                              transition-all shadow-btn flex items-center justify-center gap-2 ${
                    addedToCart
                      ? 'bg-brand-green text-white'
                      : 'bg-brand-teal text-white hover:bg-brand-teal-dark hover:-translate-y-0.5'
                  }`}>
                  {addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center
                             justify-center text-xl hover:border-red-300 hover:bg-red-50
                             transition-all">
                  {wishlisted ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Buy now */}
              <Link
                href="/checkout"
                className="btn-outline w-full flex items-center justify-center mb-6">
                ⚡ Buy Now — Cash on Delivery Available
              </Link>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: '🚚', text: 'Free Delivery over Rs. 2,000' },
                  { icon: '💰', text: 'Cash on Delivery' },
                  { icon: '🔄', text: 'Easy 7-Day Returns' },
                  { icon: '✅', text: '100% Genuine Product' },
                ].map(({ icon, text }) => (
                  <div key={text}
                    className="flex items-center gap-1.5 text-[0.75rem] font-body text-[#3d5a65]
                               bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
                    <span>{icon}</span>{text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tabs Section ── */}
      <section className="bg-white py-10 border-t border-gray-100">
        <div className="inner">
          {/* Tab buttons */}
          <div className="flex gap-1 border-b border-gray-200 mb-7">
            {([
              { key: 'description', label: 'Description' },
              { key: 'features',    label: 'Features' },
              { key: 'delivery',    label: 'Delivery & Returns' },
            ] as const).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`font-heading font-semibold text-sm px-5 py-3 border-b-2 transition-all ${
                  activeTab === key
                    ? 'border-brand-teal text-brand-teal'
                    : 'border-transparent text-gray-400 hover:text-[#0f1f28]'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="max-w-2xl">
            {activeTab === 'description' && (
              <p className="font-body text-[#3d5a65] leading-relaxed text-[0.95rem]">
                {product.description}
              </p>
            )}
            {activeTab === 'features' && (
              <ul className="space-y-3">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-[0.93rem] text-[#3d5a65]">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-teal text-white text-xs
                                     flex items-center justify-center flex-shrink-0 font-bold">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'delivery' && (
              <div className="space-y-4">
                {[
                  { icon: '🚚', title: 'Standard Delivery',   body: 'Rs. 200 flat — delivered in 3–5 working days across Pakistan.' },
                  { icon: '🎁', title: 'Free Delivery',        body: 'Free on all orders above Rs. 2,000.' },
                  { icon: '💰', title: 'Cash on Delivery',     body: 'Pay when you receive — available nationwide.' },
                  { icon: '🔄', title: '7-Day Easy Returns',   body: 'Not satisfied? Return within 7 days for a full refund. Item must be unused and in original packaging.' },
                ].map(({ icon, title, body }) => (
                  <div key={title} className="flex gap-4 p-4 bg-brand-off-white rounded-xl">
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <div>
                      <p className="font-heading font-semibold text-[#0f1f28] text-sm mb-0.5">{title}</p>
                      <p className="font-body text-sm text-[#3d5a65] leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section className="py-12 bg-brand-green-light">
          <div className="inner">
            <div className="flex items-end justify-between mb-7">
              <div>
                <p className="section-eyebrow">🧸 More Like This</p>
                <h2 className="section-title">
                  Related <span className="text-brand-teal">Products</span>
                </h2>
              </div>
              <Link href="/products"
                className="font-heading font-semibold text-sm text-brand-teal
                           hover:text-brand-teal-dark transition-colors hidden sm:block">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

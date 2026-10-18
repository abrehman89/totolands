import type { Metadata } from 'next'
import ProductsGrid from '@/components/products/ProductsGrid'
import { getAllProducts, getCategories } from '@/lib/db-products'

export const metadata: Metadata = {
  title: 'All Products — Totolands',
  description: 'Browse our full range of premium kids toys. Filter by category, age group and price. Fast delivery across Pakistan.',
}

export const revalidate = 60 // re-fetch from DB every 60 seconds

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ])

  return (
    <main>
      {/* Page Header */}
      <section className="bg-brand-teal py-10">
        <div className="inner">
          <p className="section-eyebrow text-brand-yellow">🧸 Shop</p>
          <h1
            className="font-display text-white mt-1"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            All Products
          </h1>
          <p className="font-body text-white/80 mt-2 text-sm">
            Discover {products.length}+ toys for kids of all ages — delivered across Pakistan
          </p>
          <nav className="mt-4 flex items-center gap-2 text-xs font-body text-white/60">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-white">Products</span>
          </nav>
        </div>
      </section>

      <ProductsGrid products={products} categories={categories} />
    </main>
  )
}

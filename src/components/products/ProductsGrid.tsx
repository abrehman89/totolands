'use client'
import { useState, useMemo } from 'react'
import ProductCard from '@/components/home/ProductCard'
import ProductFilters from '@/components/products/ProductFilters'
import { ALL_PRODUCTS, SORT_OPTIONS } from '@/lib/products-data'

const PAGE_SIZE = 8

export default function ProductsGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedAge, setSelectedAge]           = useState('All Ages')
  const [priceRange, setPriceRange]             = useState<[number, number]>([0, 99999])
  const [sort, setSort]                         = useState('featured')
  const [page, setPage]                         = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  function reset() {
    setSelectedCategory('All')
    setSelectedAge('All Ages')
    setPriceRange([0, 99999])
    setSort('featured')
    setPage(1)
  }

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS]

    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category === selectedCategory)
    }
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price);         break
      case 'price-desc': list.sort((a, b) => b.price - a.price);         break
      case 'rating':     list.sort((a, b) => b.rating - a.rating);       break
      case 'newest':     list.sort((a, b) => b.reviews - a.reviews);     break
    }

    return list
  }, [selectedCategory, selectedAge, priceRange, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleFilterChange(fn: () => void) {
    fn()
    setPage(1)
  }

  return (
    <div className="inner py-8">

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center gap-2 bg-brand-teal text-white font-heading font-semibold
                     text-sm px-5 py-2.5 rounded-full shadow-btn">
          ☰ {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="flex gap-7 items-start">

        {/* Sidebar filters */}
        <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
          <ProductFilters
            selectedCategory={selectedCategory}
            selectedAge={selectedAge}
            priceRange={priceRange}
            onCategory={c  => handleFilterChange(() => setSelectedCategory(c))}
            onAge={a       => handleFilterChange(() => setSelectedAge(a))}
            onPrice={r     => handleFilterChange(() => setPriceRange(r))}
            onReset={reset}
            totalResults={filtered.length}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">

          {/* Sort bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6
                          bg-white rounded-xl px-4 py-3 shadow-card">
            <p className="font-body text-sm text-[#3d5a65]">
              Showing <span className="font-semibold text-[#0f1f28]">{filtered.length}</span> products
              {selectedCategory !== 'All' && (
                <> in <span className="font-semibold text-brand-teal">{selectedCategory}</span></>
              )}
            </p>
            <div className="flex items-center gap-2">
              <label className="font-body text-sm text-[#3d5a65] whitespace-nowrap">Sort by:</label>
              <select
                value={sort}
                onChange={e => { setSort(e.target.value); setPage(1) }}
                className="font-body text-sm text-[#0f1f28] border border-gray-200 rounded-lg
                           px-3 py-1.5 outline-none focus:border-brand-teal cursor-pointer bg-white">
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {paginated.length > 0 ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
              {paginated.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-display text-5xl mb-4">🧸</p>
              <h3 className="font-display text-xl text-brand-teal-dark mb-2">No products found</h3>
              <p className="font-body text-sm text-gray-400 mb-5">Try changing your filters</p>
              <button onClick={reset} className="btn-primary text-sm px-6 py-2.5">
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-full border-2 border-gray-200 font-heading font-semibold
                           text-sm text-[#3d5a65] flex items-center justify-center
                           disabled:opacity-40 hover:border-brand-teal hover:text-brand-teal
                           transition-all">
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-full font-heading font-semibold text-sm flex items-center
                              justify-center transition-all ${
                    n === page
                      ? 'bg-brand-teal text-white shadow-btn'
                      : 'border-2 border-gray-200 text-[#3d5a65] hover:border-brand-teal hover:text-brand-teal'
                  }`}>
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-full border-2 border-gray-200 font-heading font-semibold
                           text-sm text-[#3d5a65] flex items-center justify-center
                           disabled:opacity-40 hover:border-brand-teal hover:text-brand-teal
                           transition-all">
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

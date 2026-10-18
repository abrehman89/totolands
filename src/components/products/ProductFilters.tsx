'use client'
import { AGE_GROUPS } from '@/lib/products-data'

interface FiltersProps {
  selectedCategory: string
  selectedAge: string
  priceRange: [number, number]
  categories: string[]
  onCategory: (c: string) => void
  onAge: (a: string) => void
  onPrice: (r: [number, number]) => void
  onReset: () => void
  totalResults: number
  hideCategoryFilter?: boolean
}

export default function ProductFilters({
  selectedCategory, selectedAge, priceRange,
  categories, onCategory, onAge, onPrice, onReset, totalResults,
  hideCategoryFilter = false,
}: FiltersProps) {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl p-5 shadow-card sticky top-24">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg text-brand-teal-dark">Filters</h2>
          <button
            onClick={onReset}
            className="text-xs font-heading font-semibold text-brand-teal hover:text-brand-teal-dark
                       underline underline-offset-2 transition-colors">
            Reset All
          </button>
        </div>

        {/* Results count */}
        <p className="text-xs text-gray-400 font-body mb-5 pb-5 border-b border-gray-100">
          {totalResults} products found
        </p>

        {/* Category */}
        {!hideCategoryFilter && (
          <div className="mb-6">
            <h3 className="font-heading font-semibold text-[0.85rem] text-[#0f1f28] uppercase
                           tracking-wider mb-3">
              Category
            </h3>
            <ul className="space-y-1">
              {categories.map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => onCategory(cat)}
                    className={`w-full text-left text-[0.87rem] px-3 py-1.5 rounded-lg font-body
                                transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-teal text-white font-semibold'
                        : 'text-[#3d5a65] hover:bg-brand-green-light hover:text-brand-teal-dark'
                    }`}>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Age Group */}
        <div className="mb-6 pt-5 border-t border-gray-100">
          <h3 className="font-heading font-semibold text-[0.85rem] text-[#0f1f28] uppercase
                         tracking-wider mb-3">
            Age Group
          </h3>
          <div className="flex flex-wrap gap-2">
            {AGE_GROUPS.map(age => (
              <button
                key={age}
                onClick={() => onAge(age)}
                className={`text-[0.78rem] px-3 py-1 rounded-full font-heading font-semibold
                            border transition-all ${
                  selectedAge === age
                    ? 'bg-brand-yellow border-brand-yellow-dark text-brand-teal-dark'
                    : 'border-gray-200 text-[#3d5a65] hover:border-brand-teal hover:text-brand-teal'
                }`}>
                {age}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="pt-5 border-t border-gray-100">
          <h3 className="font-heading font-semibold text-[0.85rem] text-[#0f1f28] uppercase
                         tracking-wider mb-3">
            Price Range
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Under Rs. 1,500',       range: [0, 1500]  as [number,number] },
              { label: 'Rs. 1,500 – 3,000',     range: [1500, 3000] as [number,number] },
              { label: 'Rs. 3,000 – 5,000',     range: [3000, 5000] as [number,number] },
              { label: 'Above Rs. 5,000',        range: [5000, 99999] as [number,number] },
            ].map(({ label, range }) => {
              const active = priceRange[0] === range[0] && priceRange[1] === range[1]
              return (
                <button
                  key={label}
                  onClick={() => onPrice(active ? [0, 99999] : range)}
                  className={`w-full text-left flex items-center gap-2.5 text-[0.87rem]
                              font-body transition-colors ${
                    active ? 'text-brand-teal font-semibold' : 'text-[#3d5a65] hover:text-brand-teal'
                  }`}>
                  <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center
                                    justify-center transition-all ${
                    active ? 'bg-brand-teal border-brand-teal' : 'border-gray-300'
                  }`}>
                    {active && <span className="text-white text-[10px] leading-none">✓</span>}
                  </span>
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}

import { notFound }    from 'next/navigation'
import type { Metadata } from 'next'
import CategoryGrid      from '@/components/products/CategoryGrid'

// Map URL slug → display name
const SLUG_TO_CATEGORY: Record<string, string> = {
  'cars':            'Cars & Vehicles',
  'stuffed-animals': 'Stuffed Animals',
  'building-blocks': 'Building Blocks',
  'board-games':     'Board Games',
  'arts-crafts':     'Arts & Crafts',
  'action-figures':  'Action Figures',
  'outdoor':         'Outdoor Play',
  'gift-sets':       'Gift Sets',
  'puzzles':         'Puzzles',
  'educational':     'Educational',
  'pretend-play':    'Pretend Play',
  'dolls':           'Dolls',
}

const CATEGORY_EMOJI: Record<string, string> = {
  'Cars & Vehicles': '🚗',
  'Stuffed Animals': '🧸',
  'Building Blocks': '🧱',
  'Board Games':     '🎮',
  'Arts & Crafts':   '🎨',
  'Action Figures':  '🤖',
  'Outdoor Play':    '🎠',
  'Gift Sets':       '🎁',
  'Puzzles':         '🧩',
  'Educational':     '📚',
  'Pretend Play':    '🎭',
  'Dolls':           '🪆',
}

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return Object.keys(SLUG_TO_CATEGORY).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = SLUG_TO_CATEGORY[params.slug]
  if (!name) return { title: 'Category Not Found — Totolands' }
  return {
    title: `${name} — Totolands`,
    description: `Shop the best ${name} toys for kids in Pakistan. Fast delivery, easy returns, Cash on Delivery available.`,
  }
}

export default function CategoryPage({ params }: Props) {
  const categoryName = SLUG_TO_CATEGORY[params.slug]
  if (!categoryName) notFound()

  const emoji = CATEGORY_EMOJI[categoryName] ?? '🧸'

  return (
    <main>
      {/* Page Header */}
      <section className="bg-brand-teal py-10">
        <div className="inner">
          <p className="section-eyebrow text-brand-yellow">{emoji} Category</p>
          <h1
            className="font-display text-white mt-1"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            {categoryName}
          </h1>
          <p className="font-body text-white/80 mt-2 text-sm">
            Browse our full range of {categoryName} toys — delivered across Pakistan
          </p>

          {/* Breadcrumb */}
          <nav className="mt-4 flex items-center gap-2 text-xs font-body text-white/60">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-white transition-colors">Products</a>
            <span>/</span>
            <span className="text-white">{categoryName}</span>
          </nav>
        </div>
      </section>

      {/* Other Categories Quick Nav */}
      <section className="bg-brand-green-light border-b border-brand-teal/10">
        <div className="inner py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {Object.entries(SLUG_TO_CATEGORY).map(([slug, name]) => {
              const active = slug === params.slug
              return (
                <a
                  key={slug}
                  href={`/category/${slug}`}
                  className={`text-[0.8rem] px-4 py-1.5 rounded-full font-heading font-semibold
                              whitespace-nowrap transition-all ${
                    active
                      ? 'bg-brand-teal text-white shadow-btn'
                      : 'bg-white text-brand-teal-dark border border-brand-teal/20 hover:bg-brand-teal hover:text-white'
                  }`}>
                  {CATEGORY_EMOJI[name]} {name}
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <CategoryGrid categoryName={categoryName} />
    </main>
  )
}

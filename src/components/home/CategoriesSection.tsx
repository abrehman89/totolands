'use client'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  { name: 'Cars & Vehicles', count: 124, slug: 'cars',            img: '/images/cat-cars.jpg',   accent: '#FF6348', light: '#FFF0EC' },
  { name: 'Stuffed Animals', count: 98,  slug: 'stuffed-animals', img: '/images/cat-teddy.jpg',  accent: '#E91E8C', light: '#FFE8F4' },
  { name: 'Building Blocks', count: 76,  slug: 'building-blocks', img: '/images/cat-blocks.jpg', accent: '#2E6B7A', light: '#E4F3F7' },
  { name: 'Board Games',     count: 55,  slug: 'board-games',     img: '/images/cat-games.jpg',  accent: '#764ba2', light: '#F3EAFA' },
  { name: 'Arts & Crafts',   count: 87,  slug: 'arts-crafts',     img: '/images/cat-arts.jpg',   accent: '#F5A623', light: '#FFF8EC' },
  { name: 'Action Figures',  count: 143, slug: 'action-figures',  img: '/images/cat-action.jpg', accent: '#6AAF3D', light: '#EEF7E6' },
]

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-brand-green-light">
      <div className="inner">
        <div className="text-center mb-12">
          <p className="section-eyebrow">✨ Explore</p>
          <h2 className="section-title">
            Shop by <span className="text-brand-teal">Category</span>
          </h2>
          <p className="mt-3 text-[#3d5a65] font-body text-base">Every toy type your little one could dream of</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(({ name, count, slug, img, accent, light }) => (
            <Link key={slug} href={`/category/${slug}`}
              className="bg-white rounded-[1.4rem] overflow-hidden block no-underline group
                         transition-all duration-200 hover:-translate-y-2"
              style={{ boxShadow: '0 4px 18px rgba(46,107,122,0.1)', border: `2.5px solid transparent` }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
            >
              {/* Color top stripe */}
              <div className="h-[6px] w-full" style={{ background: accent }} />

              {/* Image */}
              <div className="h-[100px] overflow-hidden relative">
                <Image src={img} alt={name} fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Text */}
              <div className="py-3 px-2.5 text-center" style={{ background: light }}>
                <div className="font-heading font-bold text-[0.8rem] text-brand-teal-dark leading-tight">{name}</div>
                <div className="text-[0.68rem] font-body mt-0.5" style={{ color: accent }}>{count} items</div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link href="/products"
            className="inline-flex items-center gap-2 font-heading font-bold text-sm text-brand-teal
                       hover:text-brand-teal-dark transition-colors">
            View All Products
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

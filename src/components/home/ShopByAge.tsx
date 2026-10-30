import Image from 'next/image'
import Link from 'next/link'

const ages = [
  { range: '0 – 2 Years',  emoji: '👶', slug: '0-2',  desc: 'Soft, safe & sensory toys for babies',        img: '/images/age-0-2.jpg',  accent: '#FF6348', light: '#FFF0EC' },
  { range: '3 – 5 Years',  emoji: '🧒', slug: '3-5',  desc: 'Creative play, puzzles & pretend-play',       img: '/images/age-3-5.jpg',  accent: '#E91E8C', light: '#FFE8F4' },
  { range: '6 – 8 Years',  emoji: '👦', slug: '6-8',  desc: 'Building sets, science kits & board games',   img: '/images/age-6-8.jpg',  accent: '#2E6B7A', light: '#E4F3F7' },
  { range: '9 – 12 Years', emoji: '🧑', slug: '9-12', desc: 'STEM toys, strategy & remote control',        img: '/images/age-9-12.jpg', accent: '#764ba2', light: '#F3EAFA' },
]

export default function ShopByAge() {
  return (
    <section className="py-16 bg-brand-green-light">
      <div className="inner">
        <div className="text-center mb-12">
          <p className="section-eyebrow">👶 Age Guide</p>
          <h2 className="section-title">
            Shop by <span className="text-brand-teal">Age</span>
          </h2>
          <p className="mt-3 text-[#3d5a65] font-body text-base">Age-appropriate toys for every stage of childhood</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {ages.map(({ range, slug, desc, img, accent, light, emoji }) => (
            <Link key={slug} href={`/age/${slug}`}
              className="bg-white rounded-[1.4rem] overflow-hidden block no-underline group
                         transition-all duration-200 hover:-translate-y-2"
              style={{ boxShadow: '0 4px 18px rgba(46,107,122,0.1)' }}>

              {/* Accent top bar */}
              <div className="h-[6px]" style={{ background: accent }} />

              {/* Image */}
              <div className="h-[148px] relative overflow-hidden">
                <Image src={img} alt={`Toys for ${range}`} fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.08]" />
                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Text */}
              <div className="p-4 text-center" style={{ background: light }}>
                <div className="text-xl mb-1">{emoji}</div>
                <div className="font-heading font-extrabold text-[1rem] text-brand-teal-dark">{range}</div>
                <div className="font-body text-[0.76rem] text-[#3d5a65] leading-snug mt-1">{desc}</div>
                <span className="inline-block mt-3 font-heading font-bold text-xs px-3 py-1 rounded-full text-white"
                  style={{ background: accent }}>
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

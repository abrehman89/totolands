import Image from 'next/image'
import Link from 'next/link'

const ages = [
  { range: '0 – 2 Years', emoji: '👶', slug: '0-2', desc: 'Soft, safe & sensory toys for babies', img: '/images/age-0-2.jpg' },
  { range: '3 – 5 Years', emoji: '🧒', slug: '3-5', desc: 'Creative play, puzzles & pretend-play', img: '/images/age-3-5.jpg' },
  { range: '6 – 8 Years', emoji: '👦', slug: '6-8', desc: 'Building sets, science kits & games',  img: '/images/age-6-8.jpg' },
  { range: '9 – 12 Years',emoji: '🧑', slug: '9-12',desc: 'STEM toys, strategy & remote control', img: '/images/age-9-12.jpg' },
]

export default function ShopByAge() {
  return (
    <section className="py-16 bg-brand-green-light">
      <div className="inner">
        <div className="text-center mb-11">
          <p className="section-eyebrow">👶 Age Guide</p>
          <h2 className="section-title">
            Shop by <span className="text-brand-teal">Age</span>
          </h2>
          <p className="mt-2.5 text-[#3d5a65] text-base">Age-appropriate toys for every stage of childhood</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ages.map(({ range, slug, desc, img }) => (
            <Link key={slug} href={`/age/${slug}`}
              className="bg-white rounded-[1.25rem] overflow-hidden card-hover
                         border-[2.5px] border-transparent hover:border-brand-teal block no-underline group">
              <div className="h-[155px] relative overflow-hidden">
                <Image src={img} alt={`Toys for ${range}`} fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.07]" />
              </div>
              <div className="p-4 text-center">
                <div className="font-display text-[1.05rem] text-brand-teal-dark mb-1">{range}</div>
                <div className="text-[0.78rem] text-[#3d5a65] leading-snug">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

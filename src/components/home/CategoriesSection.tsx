import Image from 'next/image'
import Link from 'next/link'

const categories = [
  { name: 'Cars & Vehicles', count: 124, slug: 'cars',           img: '/images/cat-cars.jpg' },
  { name: 'Stuffed Animals', count: 98,  slug: 'stuffed-animals',img: '/images/cat-teddy.jpg' },
  { name: 'Building Blocks', count: 76,  slug: 'building-blocks',img: '/images/cat-blocks.jpg' },
  { name: 'Board Games',     count: 55,  slug: 'board-games',    img: '/images/cat-games.jpg' },
  { name: 'Arts & Crafts',   count: 87,  slug: 'arts-crafts',    img: '/images/cat-arts.jpg' },
  { name: 'Action Figures',  count: 143, slug: 'action-figures', img: '/images/cat-action.jpg' },
]

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-brand-green-light">
      <div className="inner">
        <div className="text-center mb-11">
          <p className="section-eyebrow">✨ Explore</p>
          <h2 className="section-title">
            Shop by <span className="text-brand-teal">Category</span>
          </h2>
          <p className="mt-2.5 text-[#3d5a65] text-base">Every toy type your little one could dream of</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(({ name, count, slug, img }) => (
            <Link key={slug} href={`/category/${slug}`}
              className="bg-white rounded-[1.25rem] overflow-hidden card-hover
                         border-2 border-transparent hover:border-brand-teal block no-underline group">
              <div className="h-[110px] overflow-hidden relative">
                <Image src={img} alt={name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="py-3 px-2.5 text-center">
                <div className="font-heading font-semibold text-[0.82rem] text-brand-teal-dark leading-tight">{name}</div>
                <div className="text-[0.7rem] text-gray-400 mt-0.5">{count} items</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

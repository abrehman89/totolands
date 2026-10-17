import Image from 'next/image'
import Link from 'next/link'

const arrivals = [
  { id: 'princess-doll',  name: 'Princess Fashion Doll — Deluxe Set', price: 2100, img: '/images/arr-doll.jpg' },
  { id: 'sports-playset', name: 'Outdoor Sports Playset for Kids',     price: 3800, img: '/images/arr-outdoor.jpg' },
  { id: 'car-track',      name: 'Mini Racing Car Track — 60 Piece Set',price: 2750, img: '/images/arr-car-track.jpg' },
  { id: 'puzzle-board',   name: 'Magnetic Puzzle Board — 100 Pieces',  price: 1650, img: '/images/arr-puzzle.jpg' },
]

export default function NewArrivals() {
  return (
    <section className="py-16 bg-brand-off-white">
      <div className="inner">
        <div className="text-center mb-11">
          <p className="section-eyebrow">✨ Just In</p>
          <h2 className="section-title">
            New <span className="text-brand-teal">Arrivals</span>
          </h2>
          <p className="mt-2.5 text-[#3d5a65] text-base">Fresh stock every week — be first to grab the newest toys</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {arrivals.map(({ id, name, price, img }) => (
            <Link key={id} href={`/products/${id}`}
              className="bg-white rounded-[1.25rem] overflow-hidden card-hover
                         border-2 border-transparent hover:border-brand-teal block no-underline group">
              <div className="h-[195px] relative overflow-hidden">
                <Image src={img} alt={name} fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.06]" />
              </div>
              <div className="p-4">
                <span className="inline-block bg-brand-green-light text-brand-green-dark text-[0.68rem]
                                 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2">
                  New
                </span>
                <h3 className="font-heading font-semibold text-[0.95rem] text-[#0f1f28] leading-snug mb-2.5
                               group-hover:text-brand-teal transition-colors">
                  {name}
                </h3>
                <p className="font-display text-[1.1rem] text-brand-teal-dark">
                  Rs. {price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

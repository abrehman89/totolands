import Image from 'next/image'
import Link from 'next/link'

const banners = [
  { src: '/images/toto-banner-1.webp', href: '/products', alt: 'Totolands Banner 1' },
  { src: '/images/toto-banner-2.webp', href: '/products', alt: 'Totolands Banner 2' },
  { src: '/images/toto-banner-3.webp', href: '/products', alt: 'Totolands Banner 3' },
]

export default function PromoBanners() {
  return (
    <section className="py-8 bg-white">
      <div className="inner grid grid-cols-1 md:grid-cols-3 gap-5">
        {banners.map((b) => (
          <Link key={b.src} href={b.href}
            className="relative block overflow-hidden rounded-3xl shadow-md hover:shadow-xl
                       transition-all duration-300 hover:-translate-y-1 group aspect-[4/3]">
            <Image
              src={b.src}
              alt={b.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}

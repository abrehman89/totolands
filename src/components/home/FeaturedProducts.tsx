import ProductCard, { Product } from './ProductCard'

const featured: Product[] = [
  {
    id: 'rc-sports-car',
    name: 'Remote Control Sports Car — Red Edition',
    category: 'Cars & Vehicles',
    price: 2499,
    oldPrice: 3100,
    rating: 5,
    reviews: 128,
    image: '/images/prod-rc-car.jpg',
    badge: 'sale',
  },
  {
    id: 'giant-teddy',
    name: 'Giant Teddy Bear — Premium Soft Plush',
    category: 'Stuffed Animals',
    price: 1850,
    rating: 5,
    reviews: 214,
    image: '/images/prod-teddy.jpg',
    badge: 'new',
  },
  {
    id: 'city-builder',
    name: 'Mega City Builder Set — 500 Pieces',
    category: 'Building Blocks',
    price: 3200,
    rating: 4,
    reviews: 89,
    image: '/images/prod-blocks.jpg',
    badge: 'top',
  },
  {
    id: 'art-kit',
    name: 'Colourful Paint & Create Art Kit',
    category: 'Arts & Crafts',
    price: 1199,
    oldPrice: 1400,
    rating: 5,
    reviews: 176,
    image: '/images/prod-arts.jpg',
    badge: 'sale',
  },
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-white" id="featured">
      <div className="inner">
        <div className="text-center mb-11">
          <p className="section-eyebrow">🔥 Bestsellers</p>
          <h2 className="section-title">
            Featured <span className="text-brand-teal">Products</span>
          </h2>
          <p className="mt-2.5 text-[#3d5a65] text-base">
            Handpicked favourites loved by thousands of kids in Pakistan
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

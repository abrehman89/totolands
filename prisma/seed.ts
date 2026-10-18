// Seed script — run with: npx prisma db seed
// Populates Categories and Products from the existing mock data

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const CATEGORIES = [
  { name: 'Remote Control',  slug: 'remote-control',  image: '/images/cat-cars.jpg' },
  { name: 'Soft Toys',       slug: 'soft-toys',        image: '/images/cat-teddy.jpg' },
  { name: 'Building Blocks', slug: 'building-blocks',  image: '/images/cat-blocks.jpg' },
  { name: 'Arts & Crafts',   slug: 'arts-crafts',      image: '/images/cat-arts.jpg' },
  { name: 'Dolls',           slug: 'dolls',            image: '/images/arr-doll.jpg' },
  { name: 'Outdoor',         slug: 'outdoor',          image: '/images/arr-outdoor.jpg' },
  { name: 'Puzzles',         slug: 'puzzles',          image: '/images/arr-puzzle.jpg' },
  { name: 'Pretend Play',    slug: 'pretend-play',     image: '/images/cat-games.jpg' },
  { name: 'Educational',     slug: 'educational',      image: '/images/cat-blocks.jpg' },
  { name: 'Board Games',     slug: 'board-games',      image: '/images/cat-games.jpg' },
  { name: 'Action Figures',  slug: 'action-figures',   image: '/images/cat-action.jpg' },
]

const PRODUCTS = [
  {
    name: 'RC Sports Racing Car — Full Function',
    slug: 'rc-sports-car',
    categorySlug: 'remote-control',
    price: 3200, oldPrice: 4000,
    rating: 5, reviews: 128,
    image: '/images/prod-rc-car.jpg',
    images: ['/images/prod-rc-car.jpg', '/images/arr-car-track.jpg', '/images/cat-cars.jpg'],
    badge: 'sale' as const, badgeText: '-20%',
    ageRange: '6–12 Years', material: 'ABS Plastic',
    inBox: 'Car × 1, Remote × 1, USB Charger × 1, Manual × 1',
    stock: 18,
    description: 'Experience the thrill of high-speed racing with our Full-Function RC Sports Car! Designed for kids aged 6 and above, this car features a powerful motor, realistic headlights, and responsive controls.',
    features: ['Full-function remote control — forward, backward, left, right', 'Built-in LED headlights for night racing', 'USB rechargeable battery — 60 min charge = 40 min play', 'Speed up to 12 km/h', 'Shock-absorbent tyres for smooth turns', 'Range: up to 25 metres'],
  },
  {
    name: 'Giant Soft Teddy Bear — 3 Feet',
    slug: 'giant-teddy-bear',
    categorySlug: 'soft-toys',
    price: 2800,
    rating: 4, reviews: 96,
    image: '/images/prod-teddy.jpg',
    images: ['/images/prod-teddy.jpg', '/images/cat-teddy.jpg', '/images/arr-doll.jpg'],
    badge: 'new' as const,
    ageRange: '0–12 Years', material: 'Premium PP Cotton, Soft Plush',
    inBox: 'Teddy Bear × 1',
    stock: 34,
    description: 'Cuddle up with our premium Giant Teddy Bear! Standing at 3 feet tall, this adorable bear is made from ultra-soft plush material filled with hypoallergenic PP cotton.',
    features: ['Extra soft premium plush exterior', 'Hypoallergenic PP cotton stuffing — safe for babies', 'Embroidered eyes — no loose parts', 'Machine washable', 'Sits upright on its own', 'Available in Brown, Pink, and White'],
  },
  {
    name: 'City Builder Mega Block Set — 520 Pieces',
    slug: 'city-builder-lego',
    categorySlug: 'building-blocks',
    price: 4500,
    rating: 5, reviews: 214,
    image: '/images/prod-blocks.jpg',
    images: ['/images/prod-blocks.jpg', '/images/cat-blocks.jpg', '/images/prod-rc-car.jpg'],
    badge: 'top' as const,
    ageRange: '5–12 Years', material: 'ABS Plastic (non-toxic)',
    inBox: 'Blocks × 520, Baseplates × 2, Guide Book × 1, Storage Bag × 1',
    stock: 11,
    description: 'Build an entire city from scratch with our 520-piece Mega Block Set! This creative building set includes roads, buildings, vehicles, and mini figures.',
    features: ['520 colourful building pieces', 'Includes road plates, buildings, trees & mini figures', 'Compatible with major block brands', 'Non-toxic, BPA-free ABS plastic', 'Develops creativity, motor skills & spatial thinking', 'Full-colour illustrated guide book included'],
  },
  {
    name: 'Creative Art & Craft Kit for Kids',
    slug: 'art-craft-kit',
    categorySlug: 'arts-crafts',
    price: 1700, oldPrice: 2000,
    rating: 4, reviews: 73,
    image: '/images/prod-arts.jpg',
    images: ['/images/prod-arts.jpg', '/images/cat-arts.jpg', '/images/arr-doll.jpg'],
    badge: 'sale' as const, badgeText: '-15%',
    ageRange: '4–10 Years', material: 'Non-toxic materials',
    inBox: 'Paints × 12, Brushes × 6, Canvas × 5, Crayons × 24, Glitter × 4, Stencils × 10',
    stock: 25,
    description: 'Unleash your child\'s inner artist with our all-in-one Creative Art & Craft Kit! Packed with 60+ art supplies, this kit keeps kids engaged for hours.',
    features: ['60+ art supplies in one box', '12 washable paints + 6 professional brushes', '24 jumbo crayons', '5 blank canvas boards', '10 reusable stencils in different shapes', 'All non-toxic and child-safe materials'],
  },
  {
    name: 'Princess Fashion Doll — Deluxe Set',
    slug: 'princess-doll',
    categorySlug: 'dolls',
    price: 2100,
    rating: 5, reviews: 88,
    image: '/images/arr-doll.jpg',
    images: ['/images/arr-doll.jpg', '/images/cat-teddy.jpg', '/images/prod-arts.jpg'],
    badge: 'new' as const,
    ageRange: '3–10 Years', material: 'Safe plastic, fabric',
    inBox: 'Doll × 1, Outfits × 5, Accessories × 12, Comb × 1, Shoe Set × 3',
    stock: 20,
    description: 'Meet your little one\'s new best friend! This Deluxe Princess Fashion Doll comes with 5 stunning outfits and 12 accessories.',
    features: ['Beautiful doll with long silky styleable hair', '5 complete outfit sets included', '12 accessories — bags, jewellery, tiaras', '3 pairs of shoes', 'Movable arms, legs and head', 'Safe, non-toxic materials — CE certified'],
  },
  {
    name: 'Outdoor Sports Playset for Kids',
    slug: 'sports-playset',
    categorySlug: 'outdoor',
    price: 3800,
    rating: 4, reviews: 61,
    image: '/images/arr-outdoor.jpg',
    images: ['/images/arr-outdoor.jpg', '/images/arr-car-track.jpg', '/images/cat-games.jpg'],
    ageRange: '4–12 Years', material: 'Durable plastic & foam',
    inBox: 'Cricket Bat × 1, Ball × 2, Rackets × 2, Football × 1, Jump Rope × 1',
    stock: 8,
    description: 'Keep kids active and outdoors with our all-in-one Sports Playset! This set includes everything for a full day of outdoor fun.',
    features: ['Cricket bat + 2 balls', '2 badminton rackets with shuttlecock', 'Size 3 foam football', 'Jump rope with wooden handles', 'Lightweight & easy for kids to carry', 'Durable enough for outdoor play'],
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Upsert categories
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where:  { slug: cat.slug },
      update: { name: cat.name, image: cat.image },
      create: cat,
    })
  }
  console.log(`✅ ${CATEGORIES.length} categories seeded`)

  // Upsert products
  for (const p of PRODUCTS) {
    const { categorySlug, ...data } = p
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } })
    if (!category) { console.warn(`⚠️  Category not found: ${categorySlug}`); continue }

    await prisma.product.upsert({
      where:  { slug: data.slug },
      update: { ...data, categoryId: category.id },
      create: { ...data, categoryId: category.id },
    })
  }
  console.log(`✅ ${PRODUCTS.length} products seeded`)

  console.log('🎉 Seed complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

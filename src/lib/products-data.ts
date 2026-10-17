import { Product } from '@/components/home/ProductCard'

export const ALL_PRODUCTS: Product[] = [
  { id: 'rc-sports-car',      name: 'RC Sports Racing Car — Full Function',      category: 'Remote Control', price: 3200, oldPrice: 4000, rating: 5, reviews: 128, image: '/images/prod-rc-car.jpg',  badge: 'sale', badgeText: '-20%' },
  { id: 'giant-teddy-bear',   name: 'Giant Soft Teddy Bear — 3 Feet',            category: 'Soft Toys',      price: 2800, rating: 4,     reviews: 96,  image: '/images/prod-teddy.jpg',  badge: 'new' },
  { id: 'city-builder-lego',  name: 'City Builder Mega Block Set — 520 Pieces',  category: 'Building Blocks',price: 4500, rating: 5,     reviews: 214, image: '/images/prod-blocks.jpg', badge: 'top' },
  { id: 'art-craft-kit',      name: 'Creative Art & Craft Kit for Kids',          category: 'Arts & Crafts',  price: 1700, oldPrice: 2000, rating: 4,  reviews: 73,  image: '/images/prod-arts.jpg',   badge: 'sale', badgeText: '-15%' },
  { id: 'princess-doll',      name: 'Princess Fashion Doll — Deluxe Set',        category: 'Dolls',          price: 2100, rating: 5,     reviews: 88,  image: '/images/arr-doll.jpg',    badge: 'new' },
  { id: 'sports-playset',     name: 'Outdoor Sports Playset for Kids',            category: 'Outdoor',        price: 3800, rating: 4,     reviews: 61,  image: '/images/arr-outdoor.jpg' },
  { id: 'car-track-set',      name: 'Mini Racing Car Track — 60 Piece Set',       category: 'Remote Control', price: 2750, rating: 5,     reviews: 104, image: '/images/arr-car-track.jpg', badge: 'top' },
  { id: 'magnetic-puzzle',    name: 'Magnetic Puzzle Board — 100 Pieces',         category: 'Puzzles',        price: 1650, rating: 4,     reviews: 55,  image: '/images/arr-puzzle.jpg' },
  { id: 'kitchen-playset',    name: 'My Little Kitchen Pretend Play Set',         category: 'Pretend Play',   price: 2950, rating: 5,     reviews: 142, image: '/images/cat-teddy.jpg',  badge: 'new' },
  { id: 'science-kit',        name: 'Science Experiment Kit — 50 Activities',     category: 'Educational',    price: 3100, oldPrice: 3800, rating: 5,  reviews: 99,  image: '/images/cat-blocks.jpg', badge: 'sale', badgeText: '-18%' },
  { id: 'board-game',         name: 'Family Fun Board Game — 2 to 6 Players',     category: 'Board Games',    price: 1900, rating: 4,     reviews: 67,  image: '/images/cat-games.jpg' },
  { id: 'action-figure-set',  name: 'Super Hero Action Figure Set — Pack of 6',   category: 'Action Figures', price: 2400, rating: 4,     reviews: 83,  image: '/images/cat-action.jpg' },
]

export const CATEGORIES = [
  'All',
  'Remote Control',
  'Soft Toys',
  'Building Blocks',
  'Arts & Crafts',
  'Dolls',
  'Outdoor',
  'Puzzles',
  'Pretend Play',
  'Educational',
  'Board Games',
  'Action Figures',
]

export const AGE_GROUPS = ['All Ages', '0-2 Years', '3-5 Years', '6-8 Years', '9-12 Years']

export const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'newest',     label: 'Newest First' },
]

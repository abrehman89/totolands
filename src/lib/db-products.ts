import { prisma } from '@/lib/prisma'
import { ProductDetail } from '@/lib/products-data'

// Map a Prisma Product row → ProductDetail shape used by UI components
// NOTE: id is set to slug (for URL routing). dbId carries the real cuid for DB writes.
function mapProduct(p: any): ProductDetail {
  return {
    id:          p.slug,
    dbId:        p.id,
    name:        p.name,
    category:    p.category?.name ?? '',
    price:       p.price,
    oldPrice:    p.oldPrice ?? undefined,
    rating:      p.rating,
    reviews:     p.reviews,
    image:       p.image,
    badge:       p.badge ?? undefined,
    badgeText:   p.badgeText ?? undefined,
    description: p.description,
    features:    p.features,
    ageRange:    p.ageRange ?? '',
    material:    p.material ?? '',
    inBox:       p.inBox ?? '',
    stock:       p.stock,
    images:      p.images.length > 0 ? p.images : [p.image],
  }
}

export async function getAllProducts(): Promise<ProductDetail[]> {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
  return products.map(mapProduct)
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
  if (!product) return null
  return mapProduct(product)
}

export async function getProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({ select: { slug: true } })
  return products.map(p => p.slug)
}

export async function getCategories(): Promise<string[]> {
  const cats = await prisma.category.findMany({ orderBy: { name: 'asc' } })
  return cats.map(c => c.name)
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name:        { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { category: { name: { contains: q, mode: 'insensitive' } } },
      ],
    },
    select: {
      id:       true,
      name:     true,
      slug:     true,
      image:    true,
      price:    true,
      oldPrice: true,
      badge:    true,
      category: { select: { name: true } },
    },
    orderBy: { reviews: 'desc' },
    take: 7,
  })

  const results = products.map(p => ({
    id:           p.id,
    name:         p.name,
    slug:         p.slug,
    image:        p.image,
    price:        p.price,
    oldPrice:     p.oldPrice,
    badge:        p.badge,
    categoryName: p.category.name,
  }))

  return NextResponse.json({ results })
}

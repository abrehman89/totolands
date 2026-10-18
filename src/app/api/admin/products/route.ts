import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

export async function POST(req: NextRequest) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const {
      name, categoryId, ageRange, description, features,
      price, oldPrice, stock, badge, badgeText,
      material, inBox, image, images,
    } = body

    if (!name || !categoryId || !description || !price || !stock) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = slugify(name)

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        categoryId,
        ageRange:    ageRange    || null,
        description,
        features:    features    || [],
        price:       Number(price),
        oldPrice:    oldPrice ? Number(oldPrice) : null,
        stock:       Number(stock),
        badge:       badge       || null,
        badgeText:   badgeText   || null,
        material:    material    || null,
        inBox:       inBox       || null,
        image:       image       || '/images/prod-rc-car.jpg',
        images:      images      || [],
        rating:      0,
        reviews:     0,
      },
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/admin/products error:', err)
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A product with that name already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

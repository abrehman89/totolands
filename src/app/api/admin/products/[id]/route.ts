import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'ADMIN') return null
  return session
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
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
        image:       image       || undefined,
        images:      images      || undefined,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (err: any) {
    console.error('PATCH /api/admin/products/[id] error:', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    await prisma.product.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/admin/products/[id] error:', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}

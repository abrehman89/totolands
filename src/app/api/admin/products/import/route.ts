import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

interface ImportRow {
  name: string
  slug?: string
  categorySlug: string
  description?: string
  price: string
  oldPrice?: string
  stock: string
  ageRange?: string
  material?: string
  inBox?: string
  badge?: string
  badgeText?: string
  image: string
  images?: string
  features?: string
}

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const rows: ImportRow[] = body.rows

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'No rows provided' }, { status: 400 })
  }

  let created = 0
  const errors: string[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const label = `Row ${i + 2}`

    try {
      if (!row.name?.trim())         { errors.push(`${label}: "name" is required`);         continue }
      if (!row.categorySlug?.trim()) { errors.push(`${label}: "categorySlug" is required`); continue }
      if (!row.image?.trim())        { errors.push(`${label}: "image" URL is required`);    continue }

      const price = parseInt(row.price)
      if (isNaN(price) || price <= 0) { errors.push(`${label}: invalid "price"`); continue }

      const stock = parseInt(row.stock)
      if (isNaN(stock) || stock < 0)  { errors.push(`${label}: invalid "stock"`); continue }

      const category = await prisma.category.findUnique({
        where: { slug: row.categorySlug.trim().toLowerCase() },
      })
      if (!category) {
        errors.push(`${label}: category slug "${row.categorySlug}" not found`)
        continue
      }

      // Unique slug
      const baseSlug = row.slug?.trim() ? toSlug(row.slug) : toSlug(row.name)
      const conflict = await prisma.product.findUnique({ where: { slug: baseSlug } })
      const slug = conflict ? `${baseSlug}-${Date.now()}` : baseSlug

      const features = row.features
        ? row.features.split('|').map(f => f.trim()).filter(Boolean)
        : []
      const images = row.images
        ? row.images.split('|').map(u => u.trim()).filter(Boolean)
        : []

      const VALID_BADGES = ['sale', 'new', 'top'] as const
      type BadgeType = typeof VALID_BADGES[number]
      const badgeRaw = row.badge?.trim().toLowerCase()
      const badge = VALID_BADGES.includes(badgeRaw as BadgeType)
        ? (badgeRaw as BadgeType)
        : undefined

      const oldPriceVal = row.oldPrice ? parseInt(row.oldPrice) : undefined

      await prisma.product.create({
        data: {
          name:        row.name.trim(),
          slug,
          description: row.description?.trim() || '',
          features,
          price,
          oldPrice:    oldPriceVal && !isNaN(oldPriceVal) ? oldPriceVal : undefined,
          stock,
          ageRange:    row.ageRange?.trim()   || undefined,
          material:    row.material?.trim()   || undefined,
          inBox:       row.inBox?.trim()      || undefined,
          badge,
          badgeText:   row.badgeText?.trim()  || undefined,
          image:       row.image.trim(),
          images,
          categoryId:  category.id,
          rating:      0,
          reviews:     0,
        },
      })

      created++
    } catch (err: any) {
      errors.push(`${label} (${row.name ?? ''}): ${err?.message ?? 'Unknown error'}`)
    }
  }

  return NextResponse.json({ created, errors })
}

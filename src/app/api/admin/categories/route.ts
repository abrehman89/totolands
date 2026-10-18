import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

    const { name, image } = await req.json()
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const slug = slugify(name.trim())
    const category = await prisma.category.create({
      data: { name: name.trim(), slug, image: image || '' },
    })

    return NextResponse.json({ success: true, category }, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/admin/categories error:', err)
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

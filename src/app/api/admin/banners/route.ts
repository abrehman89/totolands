import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const { title, subtitle, image, link, active } = await req.json()
    if (!title?.trim() || !image?.trim()) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 })
    }

    const count = await prisma.banner.count()
    const banner = await prisma.banner.create({
      data: {
        title: title.trim(),
        subtitle: subtitle?.trim() || '',
        image: image.trim(),
        link: link?.trim() || '/products',
        active: active ?? true,
        order: count,
      },
    })

    return NextResponse.json({ success: true, banner }, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/admin/banners error:', err)
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 })
  }
}

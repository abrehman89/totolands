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

    const data = await req.json()
    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        ...(data.title    !== undefined && { title:    data.title }),
        ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
        ...(data.image    !== undefined && { image:    data.image }),
        ...(data.link     !== undefined && { link:     data.link }),
        ...(data.active   !== undefined && { active:   data.active }),
      },
    })

    return NextResponse.json({ success: true, banner })
  } catch (err: any) {
    console.error('PATCH /api/admin/banners/[id] error:', err)
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!await requireAdmin()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    await prisma.banner.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/admin/banners/[id] error:', err)
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 })
  }
}

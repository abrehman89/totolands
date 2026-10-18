import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

    const { status } = await req.json()
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json({ success: true, order })
  } catch (err: any) {
    console.error('PATCH /api/admin/orders/[id] error:', err)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

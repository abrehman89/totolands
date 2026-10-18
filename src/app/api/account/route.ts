import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const { name, phone } = await req.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name:  name.trim(),
        phone: phone?.trim() || null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('PATCH /api/account error:', err)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

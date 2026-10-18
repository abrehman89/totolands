import { NextRequest, NextResponse } from 'next/server'
import { prisma }                    from '@/lib/prisma'
import { buildPayFastParams, getPayFastUrl } from '@/lib/payfast'

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json()
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, total: true, fullName: true, email: true, paymentMethod: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    if (order.paymentMethod !== 'PayFast') {
      return NextResponse.json({ error: 'Not a PayFast order' }, { status: 400 })
    }

    const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

    const params = buildPayFastParams({
      orderId:   order.id,
      amount:    order.total,
      itemName:  `Totolands Order #${order.id.slice(-8).toUpperCase()}`,
      email:     order.email   ?? undefined,
      fullName:  order.fullName,
      returnUrl: `${base}/payment-success?orderId=${order.id}`,
      cancelUrl: `${base}/payment-cancel?orderId=${order.id}`,
      notifyUrl: `${base}/api/payfast/notify`,
    })

    return NextResponse.json({ params, url: getPayFastUrl() })
  } catch (err: any) {
    console.error('POST /api/payfast/initiate error:', err)
    return NextResponse.json({ error: 'Failed to initiate PayFast' }, { status: 500 })
  }
}

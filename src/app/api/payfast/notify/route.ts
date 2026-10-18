import { NextRequest, NextResponse } from 'next/server'
import { prisma }            from '@/lib/prisma'
import { generateSignature } from '@/lib/payfast'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const text   = await req.text()
    const params = Object.fromEntries(new URLSearchParams(text))

    const {
      signature: receivedSig,
      payment_status,
      m_payment_id: orderId,
      amount_gross: amountGross,
      ...rest
    } = params

    // ── 1. Verify signature ────────────────────────────────────────────────
    // Re-build params without signature for hashing (preserve original order)
    const forSig: Record<string, string> = {}
    const allParsed = new URLSearchParams(text)
    allParsed.forEach((v, k) => {
      if (k !== 'signature') forSig[k] = v
    })
    const expectedSig = generateSignature(forSig)

    if (expectedSig !== receivedSig) {
      console.error('PayFast IPN: signature mismatch', { expected: expectedSig, received: receivedSig })
      return new NextResponse('Invalid signature', { status: 400 })
    }

    // ── 2. Find order ──────────────────────────────────────────────────────
    if (!orderId) return new NextResponse('Missing order id', { status: 400 })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, total: true, status: true },
    })

    if (!order) {
      console.error('PayFast IPN: order not found', orderId)
      return new NextResponse('Order not found', { status: 404 })
    }

    // ── 3. Verify amount (within ±1 Rs tolerance for floating point) ───────
    const paidAmount = parseFloat(amountGross ?? '0')
    if (Math.abs(paidAmount - order.total) > 1) {
      console.error('PayFast IPN: amount mismatch', { paid: paidAmount, expected: order.total })
      return new NextResponse('Amount mismatch', { status: 400 })
    }

    // ── 4. Update order status ─────────────────────────────────────────────
    if (payment_status === 'COMPLETE') {
      await prisma.order.update({
        where: { id: orderId },
        data:  { status: 'Confirmed' },
      })
    } else if (payment_status === 'FAILED' || payment_status === 'CANCELLED') {
      await prisma.order.update({
        where: { id: orderId },
        data:  { status: 'Cancelled' },
      })
    }

    return new NextResponse('OK', { status: 200 })
  } catch (err: any) {
    console.error('POST /api/payfast/notify error:', err)
    return new NextResponse('Server error', { status: 500 })
  }
}

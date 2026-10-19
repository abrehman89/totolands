import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Payment Cancelled — Totolands' }

interface Props { searchParams: { orderId?: string } }

export default async function PaymentCancelPage({ searchParams }: Props) {
  // Mark order as Cancelled if it exists and is still Pending
  if (searchParams.orderId) {
    try {
      await prisma.order.updateMany({
        where: { id: searchParams.orderId, status: 'Pending' },
        data:  { status: 'Cancelled' },
      })
    } catch {}
  }

  return (
    <main className="min-h-[calc(100vh-144px)] bg-brand-off-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center">

        <div className="bg-white rounded-3xl shadow-card px-8 py-12">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
            😕
          </div>
          <h1 className="font-display text-2xl text-brand-teal-dark mb-2">Payment Cancelled</h1>
          <p className="font-body text-gray-500 mb-8">
            No worries — your order was not charged. You can try again or choose Cash on Delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/checkout" className="btn-primary px-7 py-3">Try Again</Link>
            <Link href="/cart"     className="btn-outline px-7 py-3">Back to Cart</Link>
          </div>
        </div>

      </div>
    </main>
  )
}

import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'Payment Successful — Totolands' }

interface Props { searchParams: { orderId?: string } }

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const order = searchParams.orderId
    ? await prisma.order.findUnique({
        where: { id: searchParams.orderId },
        select: { id: true, fullName: true, total: true, city: true, address: true, phone: true },
      })
    : null

  return (
    <main className="min-h-[calc(100vh-144px)] bg-brand-off-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg text-center">

        <div className="bg-white rounded-3xl shadow-card px-8 py-12">
          <div className="w-20 h-20 bg-brand-green/15 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
            🎉
          </div>
          <h1 className="font-display text-2xl text-brand-teal-dark mb-2">Payment Successful!</h1>

          {order ? (
            <>
              <p className="font-body text-[#3d5a65] mb-2">
                Thank you, <span className="font-semibold text-[#0f1f28]">{order.fullName}</span>!
              </p>
              <p className="font-body text-sm text-gray-400 mb-6">
                Order <span className="font-semibold text-brand-teal">#{order.id.slice(-8).toUpperCase()}</span> has been confirmed.
              </p>
              <div className="bg-brand-green-light rounded-xl px-6 py-4 mb-7 text-left space-y-1.5">
                <p className="font-body text-sm text-[#3d5a65]">
                  📦 Delivering to: <span className="font-semibold text-[#0f1f28]">{order.address}, {order.city}</span>
                </p>
                <p className="font-body text-sm text-[#3d5a65]">
                  📞 Contact: <span className="font-semibold text-[#0f1f28]">{order.phone}</span>
                </p>
                <p className="font-body text-sm text-[#3d5a65]">
                  💰 Paid: <span className="font-semibold text-brand-teal-dark">Rs. {order.total.toLocaleString()}</span>
                </p>
                <p className="font-body text-sm text-[#3d5a65]">
                  🚚 Estimated delivery: <span className="font-semibold text-[#0f1f28]">2–4 business days</span>
                </p>
              </div>
            </>
          ) : (
            <p className="font-body text-gray-400 mb-6">Your payment has been processed successfully.</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/orders"   className="btn-primary px-7 py-3">View My Orders</Link>
            <Link href="/products" className="btn-outline px-7 py-3">Continue Shopping</Link>
          </div>
        </div>

      </div>
    </main>
  )
}

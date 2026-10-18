import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'My Orders — Totolands' }

function statusColor(status: string) {
  switch (status) {
    case 'Pending':   return 'bg-yellow-100 text-yellow-800'
    case 'Confirmed': return 'bg-blue-100 text-blue-800'
    case 'Shipped':   return 'bg-purple-100 text-purple-800'
    case 'Delivered': return 'bg-green-100 text-green-800'
    case 'Cancelled': return 'bg-red-100 text-red-800'
    default:          return 'bg-gray-100 text-gray-700'
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/login?next=/orders')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="min-h-[calc(100vh-144px)] bg-brand-off-white py-10">
      <div className="inner">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-brand-teal-dark mb-1">My Orders</h1>
          <p className="font-body text-gray-500">Track and view your past orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-card p-16 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="font-display text-xl text-brand-teal-dark mb-2">No orders yet</h2>
            <p className="font-body text-gray-400 mb-6">Start shopping and your orders will appear here.</p>
            <Link href="/products" className="btn-primary px-6 py-3">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl shadow-card overflow-hidden">

                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
                  <div>
                    <p className="font-body text-xs text-gray-400 mb-0.5">Order ID</p>
                    <p className="font-heading text-sm text-brand-teal-dark font-semibold">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-gray-400 mb-0.5">Date</p>
                    <p className="font-body text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-gray-400 mb-0.5">Payment</p>
                    <p className="font-body text-sm text-gray-700">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-gray-400 mb-0.5">Total</p>
                    <p className="font-heading text-sm font-semibold text-brand-teal-dark">
                      Rs. {order.total.toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm text-gray-800 truncate">{item.name}</p>
                          <p className="font-body text-xs text-gray-400">Qty: {item.qty}</p>
                        </div>
                        <p className="font-heading text-sm font-semibold text-gray-700 flex-shrink-0">
                          Rs. {(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Delivery address */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="font-body text-xs text-gray-400">
                      Deliver to: <span className="text-gray-600">{order.fullName} · {order.address}, {order.city}</span>
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/products" className="font-body text-sm text-brand-teal hover:text-brand-teal-dark transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}

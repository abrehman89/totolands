import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminHeader from '@/components/admin/AdminHeader'
import OrderStatusManager from '@/components/admin/OrderStatusManager'

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Order #${params.id.slice(-8).toUpperCase()}` }
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  })

  if (!order) notFound()

  return (
    <div className="p-6 lg:p-8 mt-[56px] lg:mt-0">
      <AdminHeader
        title={`Order #${order.id.slice(-8).toUpperCase()}`}
        subtitle={`Placed on ${new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })} · ${order.items.length} item${order.items.length !== 1 ? 's' : ''}`}
        action={
          <Link href="/admin/orders" className="btn-outline text-sm px-5 py-2.5">
            ← All Orders
          </Link>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Customer info */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-display text-lg text-brand-teal-dark mb-4">Customer</h2>
            <div className="grid grid-cols-2 gap-3 font-body text-sm">
              {([
                ['Name',     order.fullName],
                ['Phone',    order.phone],
                ['Email',    order.email ?? '—'],
                ['City',     order.city],
                ['Address',  order.address],
                ['Province', order.province ?? '—'],
                ['Payment',  order.paymentMethod],
                ['Notes',    order.notes ?? '—'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-heading font-semibold mb-0.5">{k}</p>
                  <p className="text-[#0f1f28] font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-display text-lg text-brand-teal-dark mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-green-light flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-sm text-[#0f1f28]">{item.name}</p>
                      <p className="font-body text-xs text-gray-400">Qty × {item.qty}</p>
                    </div>
                  </div>
                  <p className="font-display text-sm text-brand-teal-dark">
                    Rs. {(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
              <div className="flex justify-between font-body text-sm text-[#3d5a65]">
                <span>Subtotal</span>
                <span>Rs. {(order.total - order.deliveryFee).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-[#3d5a65]">
                <span>Delivery</span>
                <span>{order.deliveryFee === 0 ? 'Free' : `Rs. ${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-heading font-semibold text-base text-[#0f1f28] pt-1">
                <span>Total</span>
                <span className="font-display text-lg text-brand-teal-dark">Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — status manager */}
        <div>
          <OrderStatusManager orderId={order.id} currentStatus={order.status as any} />
        </div>
      </div>
    </div>
  )
}

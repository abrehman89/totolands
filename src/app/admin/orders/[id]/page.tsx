import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ADMIN_ORDERS, STATUS_COLORS } from '@/lib/admin-data'
import AdminHeader from '@/components/admin/AdminHeader'
import OrderStatusManager from '@/components/admin/OrderStatusManager'

interface Props { params: { id: string } }

export function generateStaticParams() {
  return ADMIN_ORDERS.map(o => ({ id: o.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Order ${params.id}` }
}

export default function AdminOrderDetailPage({ params }: Props) {
  const order = ADMIN_ORDERS.find(o => o.id === params.id)
  if (!order) notFound()

  return (
    <div className="p-6 lg:p-8 mt-[56px] lg:mt-0">
      <AdminHeader
        title={`Order ${order.id}`}
        subtitle={`Placed on ${order.date} · ${order.items} item${order.items !== 1 ? 's' : ''}`}
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
              {[
                ['Name',    order.customer],
                ['Phone',   order.phone],
                ['City',    order.city],
                ['Payment', order.payment],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-heading font-semibold mb-0.5">{k}</p>
                  <p className="text-[#0f1f28] font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order items (mock) */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-display text-lg text-brand-teal-dark mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {Array.from({ length: order.items }, (_, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-green-light flex items-center justify-center text-lg">🧸</div>
                    <div>
                      <p className="font-heading font-semibold text-sm text-[#0f1f28]">Toy Item {i + 1}</p>
                      <p className="font-body text-xs text-gray-400">Qty × 1</p>
                    </div>
                  </div>
                  <p className="font-display text-sm text-brand-teal-dark">
                    Rs. {Math.round(order.total / order.items).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
              <span className="font-heading font-semibold text-base text-[#0f1f28]">Total</span>
              <span className="font-display text-lg text-brand-teal-dark">Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right — status manager */}
        <div>
          <OrderStatusManager orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
import AdminHeader from '@/components/admin/AdminHeader'

export const metadata: Metadata = { title: 'Orders' }
export const revalidate = 30

const STATUS_COLORS: Record<string, string> = {
  Pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped:   'bg-purple-100 text-purple-700 border-purple-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { items: true } } },
  })

  const statusCounts = {
    Pending:   orders.filter(o => o.status === 'Pending').length,
    Confirmed: orders.filter(o => o.status === 'Confirmed').length,
    Shipped:   orders.filter(o => o.status === 'Shipped').length,
    Delivered: orders.filter(o => o.status === 'Delivered').length,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length,
  }

  return (
    <div className="p-6 lg:p-8 mt-[56px] lg:mt-0">
      <AdminHeader title="Orders" subtitle={`${orders.length} total orders`} />

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => (
          <div key={status} className="bg-white rounded-xl shadow-card px-4 py-3 text-center">
            <p className="font-display text-xl text-brand-teal-dark">{count}</p>
            <span className={`text-[0.72rem] font-heading font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}>
              {status}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f8fa] border-b border-gray-100">
                {['Order ID', 'Customer', 'City', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-heading font-semibold text-[0.75rem]
                                         text-[#3d5a65] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-[#f9fbfc] transition-colors">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/orders/${order.id}`}
                      className="font-heading font-semibold text-sm text-brand-teal hover:underline">
                      #{order.id.slice(-8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 font-body text-sm text-[#0f1f28] whitespace-nowrap">{order.fullName}</td>
                  <td className="px-5 py-3.5 font-body text-sm text-[#3d5a65] whitespace-nowrap">{order.city}</td>
                  <td className="px-5 py-3.5 font-body text-sm text-[#0f1f28] text-center">{order._count.items}</td>
                  <td className="px-5 py-3.5 font-display text-sm text-brand-teal-dark whitespace-nowrap">
                    Rs. {order.total.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[0.72rem] font-heading font-semibold px-2.5 py-0.5 rounded-full border ${
                      order.paymentMethod === 'COD' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                    }`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[0.72rem] font-heading font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[order.status] ?? ''}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-body text-xs text-[#3d5a65] whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/orders/${order.id}`}
                      className="text-xs font-heading font-semibold text-brand-teal bg-brand-green-light
                                 px-3 py-1.5 rounded-lg hover:bg-brand-teal hover:text-white transition-all">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

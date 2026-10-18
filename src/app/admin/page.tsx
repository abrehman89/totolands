import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AdminHeader from '@/components/admin/AdminHeader'

export const metadata: Metadata = { title: 'Overview' }
export const revalidate = 30

const STATUS_COLORS: Record<string, string> = {
  Pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped:   'bg-purple-100 text-purple-700 border-purple-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
}

export default async function AdminOverviewPage() {
  const [
    ordersAgg,
    orderCount,
    customerCount,
    productCount,
    pendingCount,
    lowStockCount,
    recentOrders,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'Cancelled' } },
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'Pending' } }),
    prisma.product.count({ where: { stock: { lte: 10 } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, fullName: true, total: true,
        paymentMethod: true, status: true, createdAt: true,
      },
    }),
  ])

  const totalRevenue = ordersAgg._sum.total ?? 0

  const STATS = [
    { label: 'Total Revenue',   value: `Rs. ${totalRevenue.toLocaleString()}`, icon: '💰', color: 'bg-brand-teal',   text: 'text-white' },
    { label: 'Total Orders',    value: orderCount,                             icon: '📦', color: 'bg-brand-yellow', text: 'text-brand-teal-dark' },
    { label: 'Customers',       value: customerCount,                          icon: '👥', color: 'bg-brand-green',  text: 'text-white' },
    { label: 'Products',        value: productCount,                           icon: '🧸', color: 'bg-white',        text: 'text-brand-teal-dark' },
    { label: 'Pending Orders',  value: pendingCount,                           icon: '⏳', color: 'bg-white',        text: 'text-brand-teal-dark' },
    { label: 'Low Stock Items', value: lowStockCount,                          icon: '⚠️', color: 'bg-white',        text: 'text-brand-teal-dark' },
  ]

  return (
    <div className="p-6 lg:p-8 pt-6 lg:pt-8 mt-[56px] lg:mt-0">
      <AdminHeader
        title="Dashboard Overview"
        subtitle={`Today — ${new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STATS.map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5 shadow-card`}>
            <p className="text-2xl mb-2">{s.icon}</p>
            <p className={`font-display text-2xl ${s.text}`}>{s.value}</p>
            <p className={`font-body text-xs mt-0.5 ${s.text} opacity-75`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-display text-lg text-brand-teal-dark">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-heading font-semibold text-brand-teal
                                                   hover:text-brand-teal-dark underline underline-offset-2">
              View All →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="px-6 py-8 font-body text-sm text-gray-400 text-center">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f5f8fa]">
                    {['Order ID', 'Customer', 'Total', 'Payment', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-heading font-semibold text-[0.75rem]
                                             text-[#3d5a65] uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#f9fbfc] transition-colors">
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/orders/${order.id}`}
                          className="font-heading font-semibold text-sm text-brand-teal hover:underline">
                          #{order.id.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 font-body text-sm text-[#0f1f28] whitespace-nowrap">{order.fullName}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-display text-lg text-brand-teal-dark mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Add New Product',   href: '/admin/products/new',  icon: '➕' },
                { label: 'View All Orders',   href: '/admin/orders',        icon: '📦' },
                { label: 'Manage Banners',    href: '/admin/banners',       icon: '🖼️' },
                { label: 'Manage Categories', href: '/admin/categories',    icon: '🗂️' },
                { label: 'View Customers',    href: '/admin/customers',     icon: '👥' },
              ].map(({ label, href, icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#f5f8fa]
                             hover:bg-brand-green-light hover:text-brand-teal-dark transition-all
                             font-heading font-semibold text-sm text-[#3d5a65]">
                  <span>{icon}</span>{label}
                </Link>
              ))}
            </div>
          </div>

          {lowStockCount > 0 && (
            <div className="bg-brand-yellow/20 border border-brand-yellow/50 rounded-2xl p-5">
              <p className="font-heading font-semibold text-sm text-brand-teal-dark mb-1">⚠️ Low Stock Alert</p>
              <p className="font-body text-xs text-[#3d5a65] mb-3">
                {lowStockCount} product{lowStockCount > 1 ? 's' : ''} running low on stock.
              </p>
              <Link href="/admin/products" className="text-xs font-heading font-semibold text-brand-teal hover:underline underline-offset-2">
                Review Products →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

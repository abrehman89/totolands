import type { Metadata } from 'next'
import { ADMIN_CUSTOMERS } from '@/lib/admin-data'
import AdminHeader from '@/components/admin/AdminHeader'

export const metadata: Metadata = { title: 'Customers' }

export default function AdminCustomersPage() {
  const totalSpent = ADMIN_CUSTOMERS.reduce((s, c) => s + c.spent, 0)
  const totalOrders = ADMIN_CUSTOMERS.reduce((s, c) => s + c.orders, 0)

  return (
    <div className="p-6 lg:p-8 mt-[56px] lg:mt-0">
      <AdminHeader title="Customers" subtitle={`${ADMIN_CUSTOMERS.length} registered customers`} />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Customers', value: ADMIN_CUSTOMERS.length, icon: '👥' },
          { label: 'Total Orders',    value: totalOrders,           icon: '📦' },
          { label: 'Total Revenue',   value: `Rs. ${totalSpent.toLocaleString()}`, icon: '💰' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-card px-5 py-4">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="font-display text-xl text-brand-teal-dark">{s.value}</p>
            <p className="font-body text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f8fa] border-b border-gray-100">
                {['Customer','Email','Phone','City','Orders','Total Spent','Joined'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-heading font-semibold text-[0.75rem]
                                         text-[#3d5a65] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ADMIN_CUSTOMERS.map(c => (
                <tr key={c.id} className="hover:bg-[#f9fbfc] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center
                                      font-heading font-bold text-white text-sm flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-heading font-semibold text-sm text-[#0f1f28] whitespace-nowrap">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-body text-sm text-[#3d5a65]">{c.email}</td>
                  <td className="px-5 py-3.5 font-body text-sm text-[#3d5a65] whitespace-nowrap">{c.phone}</td>
                  <td className="px-5 py-3.5 font-body text-sm text-[#3d5a65] whitespace-nowrap">{c.city}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="font-heading font-semibold text-sm text-brand-teal">{c.orders}</span>
                  </td>
                  <td className="px-5 py-3.5 font-display text-sm text-brand-teal-dark whitespace-nowrap">
                    Rs. {c.spent.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 font-body text-xs text-[#3d5a65] whitespace-nowrap">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

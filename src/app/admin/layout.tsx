import type { Metadata } from 'next'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  title: { template: '%s — Totolands Admin', default: 'Admin Dashboard — Totolands' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f4f6] flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        {children}
      </div>
    </div>
  )
}

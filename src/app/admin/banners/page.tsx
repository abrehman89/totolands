import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminBannersClient from '@/components/admin/AdminBannersClient'

export const metadata: Metadata = { title: 'Banners' }
export const revalidate = 30

export default async function AdminBannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } })

  return (
    <div className="p-6 lg:p-8 mt-[56px] lg:mt-0">
      <AdminHeader title="Banners" subtitle="Manage homepage hero banners" />
      <AdminBannersClient initialBanners={banners.map(b => ({
        id:       b.id,
        title:    b.title,
        subtitle: b.subtitle ?? '',
        image:    b.image,
        link:     b.link,
        active:   b.active,
      }))} />
    </div>
  )
}

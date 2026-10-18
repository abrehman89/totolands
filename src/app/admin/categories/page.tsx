import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminCategoriesClient from '@/components/admin/AdminCategoriesClient'

export const metadata: Metadata = { title: 'Categories' }
export const revalidate = 30

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return (
    <div className="p-6 lg:p-8 mt-[56px] lg:mt-0">
      <AdminHeader
        title="Categories"
        subtitle={`${categories.length} categories`}
      />
      <AdminCategoriesClient categories={categories.map(c => ({
        id:    c.id,
        name:  c.name,
        slug:  c.slug,
        count: c._count.products,
      }))} />
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import AdminProductForm from '@/components/admin/AdminProductForm'
import AdminHeader from '@/components/admin/AdminHeader'

export const metadata: Metadata = { title: 'Edit Product' }

interface Props { searchParams: { id?: string } }

export default async function AdminEditProductPage({ searchParams }: Props) {
  if (!searchParams.id) notFound()

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: searchParams.id },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
  ])

  if (!product) notFound()

  const initial = {
    name:        product.name,
    categoryId:  product.categoryId,
    ageRange:    product.ageRange    ?? '',
    description: product.description,
    features:    product.features.join('\n'),
    price:       String(product.price),
    oldPrice:    product.oldPrice ? String(product.oldPrice) : '',
    stock:       String(product.stock),
    badge:       product.badge       ?? '',
    badgeText:   product.badgeText   ?? '',
    material:    product.material    ?? '',
    inBox:       product.inBox       ?? '',
    image:       product.image,
  }

  return (
    <div className="p-6 lg:p-8 mt-[56px] lg:mt-0">
      <AdminHeader
        title="Edit Product"
        subtitle={`Editing: ${product.name}`}
        action={
          <Link href="/admin/products" className="btn-outline text-sm px-5 py-2.5">
            ← Back to Products
          </Link>
        }
      />
      <AdminProductForm isEdit productId={product.id} initial={initial} categories={categories} />
    </div>
  )
}

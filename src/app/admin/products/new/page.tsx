import type { Metadata } from 'next'
import Link from 'next/link'
import AdminProductForm from '@/components/admin/AdminProductForm'
import AdminHeader from '@/components/admin/AdminHeader'

export const metadata: Metadata = { title: 'Add Product' }

export default function AdminNewProductPage() {
  return (
    <div className="p-6 lg:p-8 mt-[56px] lg:mt-0">
      <AdminHeader
        title="Add New Product"
        subtitle="Fill in the details below to add a product to the store"
        action={
          <Link href="/admin/products" className="btn-outline text-sm px-5 py-2.5">
            ← Back to Products
          </Link>
        }
      />
      <AdminProductForm />
    </div>
  )
}

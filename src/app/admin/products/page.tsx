import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import AdminHeader from '@/components/admin/AdminHeader'
import ProductImportExport, { type ExportProduct } from '@/components/admin/ProductImportExport'

export const metadata: Metadata = { title: 'Products' }

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  const exportProducts: ExportProduct[] = products.map(p => ({
    name:         p.name,
    slug:         p.slug,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
    description:  p.description,
    price:        p.price,
    oldPrice:     p.oldPrice,
    stock:        p.stock,
    ageRange:     p.ageRange,
    material:     p.material,
    inBox:        p.inBox,
    badge:        p.badge,
    badgeText:    p.badgeText,
    image:        p.image,
    images:       p.images,
    features:     p.features,
  }))

  return (
    <div className="p-6 lg:p-8 mt-[56px] lg:mt-0">
      <AdminHeader
        title="Products"
        subtitle={`${products.length} total products`}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <ProductImportExport products={exportProducts} />
            <Link href="/admin/products/new" className="btn-primary text-sm px-5 py-2.5">
              + Add Product
            </Link>
          </div>
        }
      />

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f5f8fa] border-b border-gray-100">
                {['Product', 'Category', 'Price', 'Stock', 'Badge', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 font-heading font-semibold text-[0.75rem]
                                         text-[#3d5a65] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-[#f9fbfc] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-green-light flex-shrink-0">
                        <Image src={p.image} alt={p.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-heading font-semibold text-[0.88rem] text-[#0f1f28] leading-snug max-w-[200px] line-clamp-2">
                          {p.name}
                        </p>
                        <p className="font-body text-[0.72rem] text-gray-400 mt-0.5">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-body text-xs bg-brand-green-light text-brand-teal-dark
                                     px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                      {p.category.name}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <p className="font-display text-sm text-brand-teal-dark">Rs. {p.price.toLocaleString()}</p>
                    {p.oldPrice && (
                      <p className="font-body text-xs text-gray-400 line-through">Rs. {p.oldPrice.toLocaleString()}</p>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`font-heading font-semibold text-sm ${p.stock <= 5 ? 'text-red-500' : p.stock <= 10 ? 'text-brand-yellow-dark' : 'text-brand-green'}`}>
                      {p.stock}
                    </span>
                    {p.stock <= 10 && (
                      <span className="ml-1.5 text-[0.65rem] font-body text-orange-500">Low</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {p.badge ? (
                      <span className={`text-[0.72rem] font-heading font-semibold px-2.5 py-0.5 rounded-full border ${
                        p.badge === 'sale' ? 'bg-red-50 text-red-600 border-red-200' :
                        p.badge === 'new'  ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                             'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {p.badgeText ?? p.badge}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/edit?id=${p.id}`}
                        className="text-xs font-heading font-semibold text-brand-teal hover:text-brand-teal-dark
                                   bg-brand-green-light px-3 py-1.5 rounded-lg transition-colors">
                        Edit
                      </Link>
                      <Link href={`/products/${p.slug}`} target="_blank"
                        className="text-xs font-heading font-semibold text-[#3d5a65] hover:text-brand-teal
                                   bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-heading font-semibold text-[#3d5a65]">No products yet</p>
              <p className="font-body text-sm text-gray-400 mt-1">Add your first product or import a CSV file</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

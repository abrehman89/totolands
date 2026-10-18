import { notFound }           from 'next/navigation'
import type { Metadata }        from 'next'
import { getProductBySlug, getProductSlugs, getAllProducts } from '@/lib/db-products'
import ProductDetailClient      from '@/components/products/ProductDetailClient'

interface Props { params: { slug: string } }

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product Not Found — Totolands' }
  return {
    title: `${product.name} — Totolands`,
    description: product.description.slice(0, 155),
  }
}

export default async function ProductPage({ params }: Props) {
  const [product, allProducts] = await Promise.all([
    getProductBySlug(params.slug),
    getAllProducts(),
  ])
  if (!product) notFound()
  return <ProductDetailClient product={product} allProducts={allProducts} />
}

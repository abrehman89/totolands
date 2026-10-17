import { notFound }         from 'next/navigation'
import type { Metadata }      from 'next'
import { ALL_PRODUCTS }       from '@/lib/products-data'
import ProductDetailClient    from '@/components/products/ProductDetailClient'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return ALL_PRODUCTS.map(p => ({ slug: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = ALL_PRODUCTS.find(p => p.id === params.slug)
  if (!product) return { title: 'Product Not Found — Totolands' }
  return {
    title: `${product.name} — Totolands`,
    description: product.description.slice(0, 155),
  }
}

export default function ProductPage({ params }: Props) {
  const product = ALL_PRODUCTS.find(p => p.id === params.slug)
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}

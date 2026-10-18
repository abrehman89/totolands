import type { Metadata } from 'next'
import CartClient from '@/components/cart/CartClient'

export const metadata: Metadata = {
  title: 'Your Cart — Totolands',
  description: 'Review your selected toys and proceed to checkout. Cash on Delivery & card payments available across Pakistan.',
}

export default function CartPage() {
  return <CartClient />
}

import type { Metadata } from 'next'
import CheckoutClient from '@/components/checkout/CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout — Totolands',
  description: 'Complete your order. Cash on Delivery & card payments via PayFast available across Pakistan.',
}

export default function CheckoutPage() {
  return <CheckoutClient />
}

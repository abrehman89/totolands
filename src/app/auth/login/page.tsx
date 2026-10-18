import { Suspense } from 'react'
import type { Metadata } from 'next'
import LoginClient from '@/components/auth/LoginClient'

export const metadata: Metadata = {
  title: 'Login — Totolands',
  description: 'Login to your Totolands account to track orders, manage your wishlist and checkout faster.',
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  )
}

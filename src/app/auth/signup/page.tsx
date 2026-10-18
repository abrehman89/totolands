import type { Metadata } from 'next'
import SignupClient from '@/components/auth/SignupClient'

export const metadata: Metadata = {
  title: 'Create Account — Totolands',
  description: 'Sign up for a free Totolands account. Track orders, save your wishlist and checkout faster.',
}

export default function SignupPage() {
  return <SignupClient />
}

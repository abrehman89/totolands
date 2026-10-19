import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import AccountClient from '@/components/account/AccountClient'

export const metadata = { title: 'My Account — Totolands' }

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/auth/login?next=/account')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  })

  if (!user) redirect('/auth/login')

  const orderCount = await prisma.order.count({ where: { userId: user.id } })

  return <AccountClient user={{ ...user, phone: user.phone ?? '' }} orderCount={orderCount} />
}

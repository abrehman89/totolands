import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

interface Props {
  title: string
  subtitle: string
  children: ReactNode
  footerText: string
  footerLinkLabel: string
  footerLinkHref: string
}

export default function AuthShell({
  title, subtitle, children,
  footerText, footerLinkLabel, footerLinkHref,
}: Props) {
  return (
    <main className="min-h-[calc(100vh-144px)] bg-brand-off-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-[440px]">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/totolands-logo.jpeg"
              alt="Totolands"
              width={140}
              height={63}
              className="h-[63px] w-auto rounded-xl shadow-card"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card px-8 py-9">
          <h1 className="font-display text-2xl text-brand-teal-dark text-center mb-1">{title}</h1>
          <p className="font-body text-sm text-gray-400 text-center mb-7">{subtitle}</p>

          {children}

          <p className="font-body text-sm text-gray-400 text-center mt-6">
            {footerText}{' '}
            <Link href={footerLinkHref}
              className="font-semibold text-brand-teal hover:text-brand-teal-dark transition-colors underline underline-offset-2">
              {footerLinkLabel}
            </Link>
          </p>
        </div>

        {/* Back to shop */}
        <p className="text-center mt-5">
          <Link href="/" className="font-body text-xs text-gray-400 hover:text-brand-teal transition-colors">
            ← Back to Totolands
          </Link>
        </p>
      </div>
    </main>
  )
}

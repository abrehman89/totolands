'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { label: 'Overview',    href: '/admin',            icon: '📊' },
  { label: 'Products',    href: '/admin/products',   icon: '🧸' },
  { label: 'Orders',      href: '/admin/orders',     icon: '📦' },
  { label: 'Customers',   href: '/admin/customers',  icon: '👥' },
  { label: 'Categories',  href: '/admin/categories', icon: '🗂️' },
  { label: 'Banners',     href: '/admin/banners',    icon: '🖼️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const nav = (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      {NAV.map(({ label, href, icon }) => (
        <Link key={href} href={href} onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-heading font-semibold
                      text-[0.9rem] transition-all ${
            isActive(href)
              ? 'bg-brand-teal text-white shadow-btn'
              : 'text-[#3d5a65] hover:bg-white hover:text-brand-teal-dark'
          }`}>
          <span className="text-lg leading-none">{icon}</span>
          {label}
        </Link>
      ))}
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[220px] flex-shrink-0 flex-col bg-[#e8f0f3] border-r border-brand-teal/10 sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-brand-teal/10">
          <Link href="/">
            <Image src="/totolands-logo.jpeg" alt="Totolands" width={110} height={50}
              className="h-[46px] w-auto rounded-lg" />
          </Link>
          <p className="font-body text-[0.7rem] text-[#3d5a65] mt-2 font-semibold uppercase tracking-wider">
            Admin Panel
          </p>
        </div>
        {nav}
        <div className="px-5 py-4 border-t border-brand-teal/10">
          <Link href="/" className="flex items-center gap-2 text-xs font-body text-[#3d5a65]
                                    hover:text-brand-teal transition-colors">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-brand-teal px-4 py-3 flex items-center justify-between shadow-btn">
        <Link href="/admin">
          <Image src="/totolands-logo.jpeg" alt="Totolands" width={90} height={40}
            className="h-[38px] w-auto rounded-lg bg-white/10" />
        </Link>
        <button onClick={() => setOpen(v => !v)}
          className="text-white p-2 rounded-full hover:bg-white/15 transition-colors">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            {open
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-[#e8f0f3] flex flex-col pt-[60px] shadow-[4px_0_24px_rgba(0,0,0,0.12)]">
            {nav}
            <div className="px-5 py-4 border-t border-brand-teal/10">
              <Link href="/" onClick={() => setOpen(false)}
                className="text-xs font-body text-[#3d5a65] hover:text-brand-teal transition-colors">
                ← Back to Store
              </Link>
            </div>
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}

'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/lib/cart-context'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { data: session } = useSession()

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-brand-teal sticky top-0 z-50 shadow-[0_2px_16px_rgba(30,79,90,0.35)]">
        <div className="inner flex items-center gap-4 h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/totolands-logo.jpeg"
              alt="Totolands"
              width={120}
              height={54}
              className="h-[54px] w-auto object-contain rounded-lg bg-white/10"
              priority
            />
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-[440px] mx-auto hidden md:block relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none"
              width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search toys, games, gifts…"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/20 text-white placeholder-white/65
                         font-body text-sm outline-none border-none focus:bg-white/28 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            {/* Wishlist */}
            <button className="relative text-white p-2 rounded-full hover:bg-white/15 transition-colors" aria-label="Wishlist">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span className="absolute top-1 right-1 bg-brand-yellow text-brand-teal-dark text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative text-white p-2 rounded-full hover:bg-white/15 transition-colors" aria-label="Cart">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-brand-yellow text-brand-teal-dark text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {session ? (
              <div className="hidden sm:flex items-center gap-2 ml-1">
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin"
                    className="text-white/80 font-heading font-semibold text-xs px-3 py-1.5
                               rounded-full hover:bg-white/15 transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/orders"
                  className="text-white/80 font-heading font-semibold text-xs px-3 py-1.5
                             rounded-full hover:bg-white/15 transition-colors">
                  Orders
                </Link>
                <Link href="/account"
                  className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5 hover:bg-white/25 transition-colors">
                  <span className="font-heading font-semibold text-white text-xs">
                    {session.user.name?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-white/70 font-heading font-semibold text-xs hover:text-white
                             transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/login"
                className="hidden sm:block bg-brand-yellow text-brand-teal-dark font-heading font-semibold
                           text-sm px-4 py-2 rounded-full ml-1 hover:bg-brand-yellow-dark transition-all
                           hover:-translate-y-px">
                Login / Sign Up
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button className="md:hidden text-white p-2 rounded-full hover:bg-white/15 ml-1"
              onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile search + menu */}
      {menuOpen && (
        <div className="bg-brand-teal-dark px-4 py-3 flex flex-col gap-3 md:hidden">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none"
              width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search toys…"
              className="w-full pl-9 pr-4 py-2 rounded-full bg-white/15 text-white placeholder-white/60 text-sm outline-none"/>
          </div>
          {session ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Link href="/orders" onClick={() => setMenuOpen(false)}
                  className="flex-1 bg-white/15 text-white font-heading font-semibold text-sm px-4 py-2 rounded-full text-center">
                  My Orders
                </Link>
                <Link href="/account" onClick={() => setMenuOpen(false)}
                  className="flex-1 bg-white/15 text-white font-heading font-semibold text-sm px-4 py-2 rounded-full text-center">
                  Account
                </Link>
              </div>
              <button onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-white/20 text-white font-heading font-semibold text-sm px-4 py-2 rounded-full text-center">
                Logout ({session.user.name?.split(' ')[0]})
              </button>
            </div>
          ) : (
            <Link href="/auth/login"
              className="bg-brand-yellow text-brand-teal-dark font-heading font-semibold text-sm px-4 py-2 rounded-full text-center">
              Login / Sign Up
            </Link>
          )}
        </div>
      )}

      {/* Category Bar */}
      <div className="bg-brand-teal-dark overflow-x-auto scrollbar-hide">
        <div className="inner flex gap-0.5 items-center min-w-max md:min-w-0">
          {[
            { label: '🏠 All', href: '/', active: true },
            { label: '🚗 Cars & Vehicles', href: '/category/cars' },
            { label: '🧸 Stuffed Animals', href: '/category/stuffed-animals' },
            { label: '🧱 Building Blocks', href: '/category/building-blocks' },
            { label: '🎮 Board Games', href: '/category/board-games' },
            { label: '🎨 Arts & Crafts', href: '/category/arts-crafts' },
            { label: '🤖 Action Figures', href: '/category/action-figures' },
            { label: '🎠 Outdoor Play', href: '/category/outdoor' },
            { label: '🎁 Gift Sets', href: '/category/gift-sets' },
          ].map(({ label, href, active }) => (
            <Link key={href} href={href}
              className={`font-heading font-medium text-sm px-3.5 py-2.5 whitespace-nowrap no-underline
                          border-b-2 transition-colors duration-150
                          ${active
                            ? 'text-brand-yellow border-brand-yellow'
                            : 'text-white/80 border-transparent hover:text-brand-yellow hover:border-brand-yellow'
                          }`}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

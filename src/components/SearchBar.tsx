'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id:           string
  name:         string
  slug:         string
  image:        string
  price:        number
  oldPrice:     number | null
  badge:        string | null
  categoryName: string
}

interface Props {
  variant?: 'navbar' | 'mobile'
}

export default function SearchBar({ variant = 'navbar' }: Props) {
  const router   = useRouter()
  const wrapRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [query,    setQuery]    = useState('')
  const [results,  setResults]  = useState<SearchResult[]>([])
  const [loading,  setLoading]  = useState(false)
  const [open,     setOpen]     = useState(false)
  const [active,   setActive]   = useState(-1)   // keyboard highlighted index

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // Debounced search
  const search = useCallback((q: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (q.length < 2) { setResults([]); setOpen(false); setLoading(false); return }

    setLoading(true)
    timerRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setResults(data.results ?? [])
        setOpen(true)
        setActive(-1)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 280)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setQuery(val)
    search(val)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return
    const total = results.length + 1 // +1 for "View all" row
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(a => Math.min(a + 1, total - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(a => Math.max(a - 1, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (active >= 0 && active < results.length) {
        const r = results[active]
        navigate(`/products/${r.slug}`)
      } else {
        navigate(`/products?q=${encodeURIComponent(query)}`)
      }
    }
  }

  function navigate(href: string) {
    setOpen(false)
    setQuery('')
    setResults([])
    router.push(href)
  }

  const isNavbar = variant === 'navbar'

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* Input */}
      <div className="relative">
        <svg className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none
                        ${isNavbar ? 'text-white/70' : 'text-white/70'}`}
          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setOpen(true) }}
          placeholder={isNavbar ? 'Search toys, games, gifts…' : 'Search toys…'}
          autoComplete="off"
          className={
            isNavbar
              ? 'w-full pl-10 pr-8 py-2.5 rounded-full bg-white/20 text-white placeholder-white/65 font-body text-sm outline-none border-none focus:bg-white/28 transition-colors'
              : 'w-full pl-9 pr-4 py-2 rounded-full bg-white/15 text-white placeholder-white/60 text-sm outline-none'
          }
        />

        {/* Loading spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Clear button */}
        {query && !loading && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false); inputRef.current?.focus() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors text-sm leading-none">
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (query.length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl
                        border border-gray-100 overflow-hidden z-[999]"
          style={{ minWidth: '320px' }}>

          {results.length === 0 && !loading && (
            <div className="px-5 py-6 text-center">
              <p className="text-2xl mb-2">🔍</p>
              <p className="font-heading font-semibold text-sm text-[#3d5a65]">No products found</p>
              <p className="font-body text-xs text-gray-400 mt-1">Try a different keyword</p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <p className="px-4 pt-3 pb-1.5 font-heading font-semibold text-[0.7rem] text-gray-400 uppercase tracking-wider">
                Products
              </p>

              <ul>
                {results.map((r, i) => (
                  <li key={r.id}>
                    <Link
                      href={`/products/${r.slug}`}
                      onClick={() => { setOpen(false); setQuery(''); setResults([]) }}
                      className={`flex items-center gap-3 px-4 py-2.5 hover:bg-brand-green-light transition-colors no-underline
                                  ${active === i ? 'bg-brand-green-light' : ''}`}>
                      {/* Thumbnail */}
                      <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                        <img
                          src={r.image}
                          alt={r.name}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = '/images/prod-blocks.jpg' }}
                        />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-[0.88rem] text-[#0f1f28] truncate leading-tight">
                          {r.name}
                        </p>
                        <p className="font-body text-[0.72rem] text-brand-green mt-0.5 truncate">
                          {r.categoryName}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p className="font-display text-sm text-brand-teal-dark font-semibold">
                          Rs. {r.price.toLocaleString()}
                        </p>
                        {r.oldPrice && (
                          <p className="font-body text-[0.68rem] text-gray-400 line-through">
                            Rs. {r.oldPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* View all */}
              <div className="border-t border-gray-100 px-4 py-2.5">
                <Link
                  href={`/products?q=${encodeURIComponent(query)}`}
                  onClick={() => { setOpen(false); setQuery(''); setResults([]) }}
                  className={`flex items-center justify-between font-heading font-bold text-sm
                              text-brand-teal hover:text-brand-teal-dark transition-colors no-underline
                              ${active === results.length ? 'text-brand-teal-dark' : ''}`}>
                  <span>View all results for &quot;{query}&quot;</span>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

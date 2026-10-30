import Image from 'next/image'
import Link from 'next/link'

const STATS = [
  { num: '1200+', label: 'Products' },
  { num: '50K+',  label: 'Happy Families' },
  { num: 'All PK',label: 'Delivery' },
]

export default function SaleBanner() {
  return (
    <section
      className="overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #1E4F5A 0%, #2E6B7A 50%, #3a8a50 100%)' }}>

      {/* Dot pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

      {/* Glow blobs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F5C842, transparent)' }} />
      <div className="absolute -bottom-16 right-1/3 w-56 h-56 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6AAF3D, transparent)' }} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1fr] min-h-[400px]">

        {/* Left: offer text */}
        <div className="px-10 py-14 flex flex-col justify-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-brand-yellow text-brand-teal-dark font-heading
                           font-extrabold text-xs px-4 py-2 rounded-full mb-5 self-start shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            🎉 This Week Only — Limited Stock!
          </span>

          <h2 className="font-display text-white leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.6rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Up to{' '}
            <span className="text-brand-yellow relative">
              40% Off
              <svg className="absolute -bottom-0.5 left-0 w-full" height="5" viewBox="0 0 80 5" preserveAspectRatio="none">
                <path d="M0,3 Q40,0 80,3" stroke="#F5C842" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </span>
            <br />Premium Toys!
          </h2>

          <p className="text-white/80 font-body text-sm leading-relaxed mb-7 max-w-[240px]">
            New deals added every week — quality you can trust, joy guaranteed.
          </p>

          <Link href="/products" className="btn-white self-start">
            View All Deals
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Center: image */}
        <div className="relative hidden md:block overflow-hidden min-h-[340px]">
          <Image
            src="/images/sale-banner.webp"
            alt="Kids toys on sale"
            fill
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(30,79,90,0.55) 0%, transparent 30%, transparent 70%, rgba(46,138,80,0.55) 100%)' }} />

          {/* Center badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          bg-brand-yellow text-brand-teal-dark rounded-full flex flex-col items-center justify-center
                          shadow-2xl border-4 border-white"
            style={{ width: '110px', height: '110px' }}>
            <span className="font-display leading-none" style={{ fontSize: '2rem', fontWeight: 800 }}>40%</span>
            <span className="font-heading font-bold text-xs uppercase tracking-wider">OFF</span>
          </div>
        </div>

        {/* Right: stats */}
        <div className="px-10 py-14 hidden md:flex flex-col justify-center gap-4">
          {STATS.map(({ num, label }) => (
            <div key={label}
              className="text-center py-4 px-4 rounded-2xl border border-white/15"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
              <div className="font-display text-brand-yellow leading-none" style={{ fontSize: '2rem', fontWeight: 800 }}>{num}</div>
              <div className="text-[0.75rem] text-white/75 font-heading font-semibold uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

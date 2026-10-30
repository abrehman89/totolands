import Image from 'next/image'
import Link from 'next/link'

const TRUST_BADGES = [
  '🚚 Free Delivery',
  '💳 COD Available',
  '⭐ 4.9 / 5 Rated',
  '🔄 Easy Returns',
]

const FLOAT_BADGES = [
  { text: '🎁 Free Gift Wrap',  pos: 'top-6 left-2',       bg: '#6AAF3D', color: '#fff',     delay: '0s' },
  { text: '🚚 Free Delivery',   pos: 'bottom-20 -left-4',  bg: '#2E6B7A', color: '#fff',     delay: '0.9s' },
  { text: '⭐ Top Rated',       pos: 'top-[40%] -right-4', bg: '#F5C842', color: '#1E4F5A',  delay: '1.8s' },
  { text: '🛡️ Safe for Kids',   pos: 'bottom-6 right-2',   bg: '#fff',    color: '#1E4F5A',  delay: '2.7s', border: true },
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(150deg, #fffbe6 0%, #FFF0A0 35%, #F5C842 100%)' }}>

      {/* Dot grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.055]"
        style={{ backgroundImage: `radial-gradient(circle, #1E4F5A 1.2px, transparent 1.2px)`, backgroundSize: '30px 30px' }} />

      {/* Blobs */}
      <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6AAF3D 0%, transparent 70%)' }} />
      <div className="absolute -bottom-20 -left-20 w-[320px] h-[320px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2E6B7A 0%, transparent 70%)' }} />

      <div className="inner grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-14 md:py-20 min-h-[560px] relative z-10">

        {/* Text side */}
        <div>
          {/* Top pill */}
          <div className="inline-flex items-center gap-2 bg-brand-teal-dark text-white font-heading
                          font-bold text-xs px-4 py-2 rounded-full mb-5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse flex-shrink-0" />
            Pakistan&apos;s #1 Kids Toy Shop
          </div>

          {/* Headline */}
          <h1 className="font-display text-brand-teal-dark leading-[1.04] mb-5"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
            }}>
            Where Every<br />
            <span className="text-brand-teal relative inline-block">
              Child&apos;s Dream
              <svg className="absolute -bottom-0.5 left-0 w-full" height="7" viewBox="0 0 200 7" preserveAspectRatio="none">
                <path d="M0,4 Q50,0 100,4 Q150,8 200,4" stroke="#6AAF3D" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
              </svg>
            </span><br />
            Comes True! 🧸
          </h1>

          {/* Subtext */}
          <p className="text-brand-teal-dark/75 font-body text-[1.05rem] mb-8 leading-relaxed max-w-[430px]">
            Premium toys with fast delivery across Pakistan.
            Pay your way — COD, JazzCash, Easypaisa or card.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link href="/products" className="btn-primary">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Shop Now
            </Link>
            <Link href="/category/cars" className="btn-outline">Browse Categories</Link>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-2">
            {TRUST_BADGES.map(b => (
              <span key={b}
                className="bg-white/70 backdrop-blur-sm text-brand-teal-dark font-heading font-semibold
                           text-xs px-3.5 py-1.5 rounded-full border border-white shadow-sm">
                {b}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-7 mt-8">
            {[
              { num: '1200+', label: 'Products' },
              { num: '50K+',  label: 'Happy Kids' },
              { num: '4.9★',  label: 'Rating' },
              { num: 'COD',   label: 'Available' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-display text-brand-teal-dark leading-none" style={{ fontSize: '1.65rem', fontWeight: 800 }}>{num}</div>
                <div className="text-[0.7rem] text-brand-teal font-heading font-semibold uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Image side */}
        <div className="hidden md:flex items-center justify-center relative h-[460px]">
          {/* Main image — slightly tilted card */}
          <div className="w-[350px] h-[380px] rounded-[2rem] overflow-hidden relative border-[5px] border-white"
            style={{ boxShadow: '0 24px 64px rgba(46,107,122,0.3)', transform: 'rotate(2.5deg)' }}>
            <Image src="/images/hero-main.webp" alt="Colourful kids toys" fill className="object-cover" priority />
          </div>

          {/* Second image peeking behind */}
          <div className="absolute left-4 top-10 w-[280px] h-[300px] rounded-[2rem] overflow-hidden border-[4px] border-white/80 -z-[1]"
            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.15)', transform: 'rotate(-4deg)', opacity: 0.7 }}>
            <Image src="/images/hero-peek.webp" alt="" fill className="object-cover" />
          </div>

          {/* Floating badges */}
          {FLOAT_BADGES.map(({ text, pos, bg, color, delay, border }) => (
            <span key={text}
              className={`absolute ${pos} font-heading font-bold text-xs px-3.5 py-2 rounded-2xl
                          whitespace-nowrap shadow-lg z-10`}
              style={{
                background: bg,
                color,
                border: border ? '2px solid #e5e7eb' : 'none',
                animation: `float 3.2s ease-in-out ${delay} infinite`,
              }}>
              {text}
            </span>
          ))}

          {/* Stat bubble */}
          <div className="absolute top-2 right-0 bg-brand-teal text-white rounded-2xl p-4 text-center z-10"
            style={{ boxShadow: '0 8px 32px rgba(46,107,122,0.45)' }}>
            <div className="font-display text-brand-yellow leading-none" style={{ fontSize: '2.1rem', fontWeight: 800 }}>50K+</div>
            <div className="text-[0.68rem] text-white/80 font-heading font-semibold mt-1">Happy Families</div>
          </div>
        </div>

      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ height: '44px', display: 'block' }}>
          <path d="M0,22 C240,44 480,0 720,22 C960,44 1200,0 1440,22 L1440,44 L0,44 Z" fill="#ffffff"/>
        </svg>
      </div>

    </section>
  )
}

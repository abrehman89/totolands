import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-brand-yellow overflow-hidden relative">
      {/* Subtle green radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 68% 50%, rgba(106,175,61,0.18) 0%, transparent 65%)' }} />

      <div className="inner grid grid-cols-1 md:grid-cols-2 items-center gap-12 py-16 min-h-[500px]">

        {/* Text */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-brand-teal text-white font-heading
                           font-semibold text-sm px-4 py-1.5 rounded-full mb-5">
            🌟 Pakistan&apos;s #1 Toy Shop
          </span>

          <h1 className="font-display text-5xl lg:text-6xl text-brand-teal-dark leading-[1.1] mb-5"
            style={{ textWrap: 'balance' }}>
            Your Littles&apos;<br />
            <span className="text-brand-green-dark">Tiny World</span><br />
            Awaits! 🧸
          </h1>

          <p className="text-brand-teal font-medium text-lg mb-8 leading-relaxed max-w-[420px]">
            Premium quality toys, fast delivery across Pakistan, and payment
            options that work for you — COD or card.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Shop Now
            </Link>
            <Link href="/category" className="btn-outline">Browse Categories</Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-7 mt-9">
            {[
              { num: '1200+', label: 'Products' },
              { num: '50K+',  label: 'Happy Kids' },
              { num: '4.9★',  label: 'Rating' },
              { num: 'COD',   label: 'Available' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-display text-[1.7rem] text-brand-teal-dark leading-none">{num}</div>
                <div className="text-[0.72rem] text-brand-teal font-semibold uppercase tracking-wider mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual — hidden on mobile */}
        <div className="hidden md:flex items-center justify-center relative">
          <div className="w-[380px] h-[380px] rounded-full overflow-hidden flex-shrink-0 relative
                          border-[6px] border-white/70"
            style={{ boxShadow: '0 16px 48px rgba(46,107,122,0.3)' }}>
            <Image
              src="/images/hero-toys.jpg"
              alt="Colourful kids toys"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Floating badges */}
          {[
            { text: '🎁 Free Gift Wrap', pos: 'top-5 right-2',   bg: 'bg-brand-teal',         color: 'text-white',            delay: '0s' },
            { text: '🚚 Free Delivery',  pos: 'bottom-11 -left-2', bg: 'bg-brand-teal',       color: 'text-white',            delay: '1s' },
            { text: '⭐ Top Rated',      pos: 'top-[44%] -right-4', bg: 'bg-brand-yellow-dark', color: 'text-brand-teal-dark', delay: '2s' },
          ].map(({ text, pos, bg, color, delay }) => (
            <span key={text}
              className={`absolute ${pos} ${bg} ${color} font-heading font-semibold text-sm
                          px-3.5 py-2 rounded-full whitespace-nowrap
                          animate-[float_3s_ease-in-out_infinite]`}
              style={{ animationDelay: delay, boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}>
              {text}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  )
}

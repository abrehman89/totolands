import Image from 'next/image'
import Link from 'next/link'

export default function SaleBanner() {
  return (
    <section
      className="overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #1E4F5A 0%, #2E6B7A 48%, #6AAF3D 100%)' }}>

      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='30' fill='none' stroke='%23fff' stroke-width='0.8'/%3E%3Ccircle cx='40' cy='40' r='15' fill='none' stroke='%23fff' stroke-width='0.8'/%3E%3C/svg%3E")` }} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.15fr_1fr] min-h-[420px]">

        {/* Left — offer text */}
        <div className="px-10 py-14 flex flex-col justify-center">
          <span className="inline-block bg-brand-yellow text-brand-teal-dark font-heading font-bold
                           text-xs px-4 py-1.5 rounded-full mb-4 self-start">
            🎉 Limited Time — This Week Only
          </span>
          <h2 className="font-display text-white leading-[1.15] mb-3"
            style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)', textWrap: 'balance' }}>
            Up to <span className="text-brand-yellow">40% Off</span><br />Premium Toys!
          </h2>
          <p className="text-white/85 text-sm leading-relaxed mb-6">
            New deals added every week. Shop the best brands at prices made for Pakistan
            — quality you can trust, joy guaranteed.
          </p>
          <Link href="/sale" className="btn-white self-start">
            View All Deals
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Center — image */}
        <div className="relative hidden md:block overflow-hidden min-h-[360px]">
          <Image
            src="/images/banner-toys.jpg"
            alt="Attractive kids toys"
            fill
            className="object-cover object-center"
          />
          {/* Edge fades */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(30,79,90,0.45) 0%, transparent 28%, transparent 72%, rgba(106,175,61,0.45) 100%)' }} />
        </div>

        {/* Right — stats */}
        <div className="px-10 py-14 hidden md:flex flex-col justify-center gap-3.5">
          {[
            { num: '1200+', label: 'Products' },
            { num: '50K+',  label: 'Happy Families' },
            { num: 'All PK',label: 'Delivery' },
          ].map(({ num, label }) => (
            <div key={label}
              className="text-center py-4 px-3.5 rounded-[1.25rem] border border-white/15"
              style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)' }}>
              <div className="font-display text-[2rem] text-brand-yellow leading-none">{num}</div>
              <div className="text-[0.76rem] text-white/80 font-semibold uppercase tracking-wider mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const promos = [
  { icon: '🚚', title: 'Free Delivery',  desc: 'On orders above Rs. 1,500 — all across Pakistan' },
  { icon: '💳', title: 'COD & Card',     desc: 'Cash on delivery, JazzCash, Easypaisa & card' },
  { icon: '🔄', title: 'Easy Returns',   desc: '7-day hassle-free returns — no questions asked' },
  { icon: '🎁', title: 'Gift Wrap',      desc: 'Complimentary gift wrap on every order' },
]

export default function PromoStrip() {
  return (
    <section className="py-8 bg-white">
      <div className="inner grid grid-cols-2 lg:grid-cols-4 gap-4">
        {promos.map(({ icon, title, desc }) => (
          <div key={title}
            className="flex items-center gap-4 bg-brand-off-white rounded-2xl px-5 py-4
                       border border-brand-green-light hover:border-brand-teal/40
                       transition-all duration-200 hover:shadow-card cursor-default group">
            <span className="text-[2.2rem] flex-shrink-0 leading-none group-hover:scale-110 transition-transform duration-200">
              {icon}
            </span>
            <div>
              <div className="font-heading font-bold text-[0.95rem] text-brand-teal-dark leading-tight">{title}</div>
              <div className="font-body text-[0.75rem] text-[#5a7a84] leading-snug mt-0.5">{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

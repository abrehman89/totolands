const promos = [
  {
    icon: '🚚',
    title: 'Free Delivery',
    desc: 'On all orders above Rs. 1,500 — delivered across Pakistan',
    bg: 'bg-brand-yellow',
    titleColor: 'text-brand-teal-dark',
    descColor: 'text-brand-teal',
  },
  {
    icon: '💳',
    title: 'COD & Card',
    desc: 'Pay cash on delivery or with Mastercard, Visa & JazzCash',
    bg: 'bg-brand-teal',
    titleColor: 'text-white',
    descColor: 'text-white/85',
  },
  {
    icon: '🔄',
    title: 'Easy Returns',
    desc: '7-day hassle-free return and exchange — no questions asked',
    bg: 'bg-brand-teal-dark',
    titleColor: 'text-white',
    descColor: 'text-white/85',
  },
]

export default function PromoStrip() {
  return (
    <section className="py-10 bg-white">
      <div className="inner grid grid-cols-1 md:grid-cols-3 gap-5">
        {promos.map(({ icon, title, desc, bg, titleColor, descColor }) => (
          <div key={title}
            className={`${bg} rounded-[2rem] p-7 flex items-center gap-4 card-hover cursor-default`}>
            <span className="text-[2.8rem] flex-shrink-0 leading-none">{icon}</span>
            <div>
              <div className={`font-display text-lg ${titleColor} mb-1`}>{title}</div>
              <div className={`text-sm ${descColor} leading-snug`}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

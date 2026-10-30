const ITEMS = [
  '🚚 Free Delivery on orders above Rs. 1,500',
  '💳 COD + JazzCash + Easypaisa + Visa / Mastercard',
  '⭐ 50,000+ Happy Families across Pakistan',
  '🔄 Easy 7-Day Returns — No Questions Asked',
  '🎁 Gift Wrap Available on All Orders',
]

export default function AnnouncementBar() {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS]
  return (
    <div className="bg-brand-teal-dark text-white py-[9px] overflow-hidden select-none" aria-hidden>
      <div
        className="flex items-center w-max"
        style={{ animation: 'marquee 38s linear infinite' }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="font-heading font-semibold text-[0.72rem] sm:text-xs px-7 whitespace-nowrap tracking-wide">
            {item}
            <span className="text-brand-yellow mx-4 opacity-70">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

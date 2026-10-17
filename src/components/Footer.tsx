import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-teal-dark text-white/80 pt-12 pb-6">
      <div className="inner grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

        {/* Brand */}
        <div>
          <Image src="/totolands-logo.jpeg" alt="Totolands" width={110} height={46}
            className="h-[46px] w-auto object-contain rounded-md bg-white/8 mb-4" />
          <p className="text-sm leading-relaxed mb-5">
            Your littles&apos; tiny world. Pakistan&apos;s most loved online toy shop — bringing joy to
            children and smiles to families since 2024.
          </p>
          <p className="text-xs text-white/50 font-heading mb-2">We Accept</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {['COD', 'MASTERCARD', 'VISA', 'JAZZCASH'].map(m => (
              <span key={m} className="bg-white/10 rounded-md px-2.5 py-1 text-[0.7rem] font-bold text-white/85 tracking-wide">
                {m}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            {[['f','Facebook'],['in','Instagram'],['tw','Twitter'],['yt','YouTube']].map(([label, name]) => (
              <a key={name} href="#" aria-label={name}
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-xs font-bold
                           font-heading hover:bg-brand-yellow hover:text-brand-teal-dark transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-heading font-semibold text-white text-base mb-4">Shop</h4>
          <ul className="space-y-2">
            {['New Arrivals','Bestsellers','Sale & Offers','Gift Sets','All Products'].map(item => (
              <li key={item}>
                <Link href="#" className="text-sm text-white/70 hover:text-brand-yellow transition-colors no-underline">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-heading font-semibold text-white text-base mb-4">Help</h4>
          <ul className="space-y-2">
            {['Track My Order','Returns Policy','FAQs','Contact Us','Size Guide'].map(item => (
              <li key={item}>
                <Link href="#" className="text-sm text-white/70 hover:text-brand-yellow transition-colors no-underline">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading font-semibold text-white text-base mb-4">Contact</h4>
          <ul className="space-y-2">
            {[
              '📞 0300-0000000',
              '✉️ hello@totolands.com',
              '📍 Lahore, Pakistan',
              '⏰ Mon–Sat, 9am–9pm',
            ].map(item => (
              <li key={item} className="text-sm text-white/70">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="inner border-t border-white/10 pt-5 text-center text-xs text-white/40">
        © 2024 Totolands.com — All rights reserved · Made with ❤️ for little ones in Pakistan
      </div>
    </footer>
  )
}

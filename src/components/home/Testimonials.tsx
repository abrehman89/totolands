const reviews = [
  {
    text: "My son absolutely loves his remote control car from Totolands! The quality is amazing and delivery was super fast to Lahore. Will definitely order again!",
    name: 'Sana Malik',
    role: 'Mother of 2 · Lahore',
    avatar: '👩',
    avatarBg: 'bg-brand-yellow',
    rating: 5,
  },
  {
    text: "Best toy shop in Pakistan! I ordered the Lego set for Eid and it arrived perfectly packed with free gift wrap. My daughter was overjoyed. Highly recommended!",
    name: 'Ahmed Raza',
    role: 'Father of 3 · Karachi',
    avatar: '👨',
    avatarBg: 'bg-brand-teal',
    rating: 5,
  },
  {
    text: "COD payment made everything so easy! Great prices and genuine branded products. Totolands is now my go-to toy shop for all my kids' birthdays and Eids.",
    name: 'Fatima Khurram',
    role: 'Mother · Islamabad',
    avatar: '👩',
    avatarBg: 'bg-brand-teal-dark',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="inner">
        <div className="text-center mb-11">
          <p className="section-eyebrow">💬 Reviews</p>
          <h2 className="section-title">
            What <span className="text-brand-teal">Parents</span> Say
          </h2>
          <p className="mt-2.5 text-[#3d5a65] text-base">Thousands of happy families across Pakistan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map(({ text, name, role, avatar, avatarBg, rating }) => (
            <div key={name} className="bg-brand-off-white rounded-[1.25rem] p-6"
              style={{ boxShadow: '0 4px 20px rgba(46,107,122,0.10)' }}>
              <span className="block font-serif text-[3.5rem] text-brand-teal leading-[0.7] mb-3">&ldquo;</span>
              <p className="text-sm text-[#3d5a65] leading-[1.7] mb-5">{text}</p>
              <div className="flex items-center gap-3">
                <div className={`${avatarBg} w-11 h-11 rounded-full flex items-center justify-center
                                 text-2xl flex-shrink-0`}>
                  {avatar}
                </div>
                <div>
                  <div className="text-brand-yellow-dark text-sm mb-0.5">{'★'.repeat(rating)}</div>
                  <div className="font-heading font-semibold text-[0.9rem] text-[#0f1f28]">{name}</div>
                  <div className="text-[0.74rem] text-gray-400">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

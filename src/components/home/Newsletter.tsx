'use client'
import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email) setDone(true)
  }

  return (
    <section className="py-16 bg-brand-teal">
      <div className="inner max-w-[600px] mx-auto text-center">
        <h2 className="font-display text-white mb-2.5"
          style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', textWrap: 'balance' }}>
          🎉 Get Exclusive Deals First!
        </h2>
        <p className="text-white/88 text-base mb-7">
          Join 20,000+ parents who receive the best toy deals every week
        </p>

        {done ? (
          <p className="font-heading font-semibold text-white text-lg">
            🎉 Subscribed! Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-[460px] mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-5 py-3 rounded-full font-body text-sm
                         bg-white/15 text-white placeholder-white/55 outline-none
                         border-2 border-white/40 focus:border-white/70 focus:bg-white/22 transition-all"
            />
            <button type="submit" className="btn-white flex-shrink-0 px-5 py-3">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

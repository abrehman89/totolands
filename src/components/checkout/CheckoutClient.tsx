'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

const DELIVERY_FEE        = 250
const FREE_DELIVERY_THRESHOLD = 3000

const PAKISTAN_CITIES = [
  'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
  'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
  'Hyderabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana',
  'Abbottabad', 'Mardan', 'Dera Ghazi Khan', 'Kasur', 'Sahiwal',
]

type Step = 'delivery' | 'payment' | 'confirmed'

interface DeliveryForm {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  province: string
  notes: string
}

const EMPTY_DELIVERY: DeliveryForm = {
  fullName: '', phone: '', email: '',
  address: '', city: '', province: '', notes: '',
}

export default function CheckoutClient() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const [step, setStep]               = useState<Step>('delivery')
  const [delivery, setDelivery]       = useState<DeliveryForm>(EMPTY_DELIVERY)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'payfast'>('cod')
  const [errors, setErrors]           = useState<Partial<DeliveryForm>>({})
  const [placing, setPlacing]         = useState(false)
  const [orderId, setOrderId]         = useState('')
  const payfastFormRef                = useRef<HTMLFormElement>(null)
  const [payfastData, setPayfastData] = useState<{ url: string; params: Record<string, string> } | null>(null)

  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const grandTotal  = totalPrice + deliveryFee

  // Auto-submit the PayFast hidden form once params are ready
  useEffect(() => {
    if (payfastData && payfastFormRef.current) {
      payfastFormRef.current.submit()
    }
  }, [payfastData])

  // ── Redirect to cart if empty ──────────────────────────────────────────────
  if (items.length === 0 && step !== 'confirmed') {
    return (
      <main>
        <PageHeader step={step} />
        <div className="inner py-24 text-center">
          <p className="text-7xl mb-5">🛒</p>
          <h2 className="font-display text-2xl text-brand-teal-dark mb-3">Your cart is empty</h2>
          <p className="font-body text-gray-400 mb-8">Add some toys before checking out!</p>
          <Link href="/products" className="btn-primary px-8 py-3 text-base">Browse Toys</Link>
        </div>
      </main>
    )
  }

  // ── Delivery form validation ───────────────────────────────────────────────
  function validateDelivery(): boolean {
    const e: Partial<DeliveryForm> = {}
    if (!delivery.fullName.trim())                 e.fullName = 'Full name is required'
    if (!/^0\d{10}$/.test(delivery.phone.trim()))  e.phone    = 'Enter a valid Pakistani mobile number (e.g. 03001234567)'
    if (delivery.email && !/\S+@\S+\.\S+/.test(delivery.email)) e.email = 'Enter a valid email'
    if (!delivery.address.trim())                  e.address  = 'Street address is required'
    if (!delivery.city)                            e.city     = 'Please select a city'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleDeliverySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validateDelivery()) setStep('payment')
  }

  // ── Place order ───────────────────────────────────────────────────────────
  async function handlePlaceOrder() {
    setPlacing(true)
    try {
      // 1. Create order in DB
      const res = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...delivery,
          paymentMethod,
          total:       grandTotal,
          deliveryFee,
          items: items.map(i => ({
            id:    i.id,
            dbId:  i.dbId,
            name:  i.name,
            image: i.image,
            price: i.price,
            qty:   i.qty,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Order failed')

      const newOrderId: string = data.orderId
      clearCart()

      if (paymentMethod === 'payfast') {
        // 2. Get signed PayFast form params
        const pfRes = await fetch('/api/payfast/initiate', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: newOrderId }),
        })
        const pfData = await pfRes.json()
        if (!pfRes.ok) throw new Error(pfData.error || 'PayFast init failed')

        // 3. Store params and trigger hidden form submit in next render
        setPayfastData({ url: pfData.url, params: pfData.params })
        setOrderId(newOrderId)
        // form submit happens via useEffect below through ref
      } else {
        setOrderId(newOrderId)
        setStep('confirmed')
      }
    } catch (err: any) {
      alert('Sorry, could not place order: ' + err.message)
    } finally {
      setPlacing(false)
    }
  }

  function field(
    id: keyof DeliveryForm,
    label: string,
    type = 'text',
    placeholder = '',
    required = true,
  ) {
    return (
      <div>
        <label className="block font-heading font-semibold text-[0.82rem] text-[#0f1f28] mb-1.5" htmlFor={id}>
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={delivery[id]}
          onChange={e => { setDelivery(d => ({ ...d, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: undefined })) }}
          className={`w-full border-2 rounded-xl px-4 py-2.5 font-body text-sm text-[#0f1f28]
                      outline-none transition-colors bg-white
                      ${errors[id] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-brand-teal'}`}
        />
        {errors[id] && <p className="text-red-400 text-xs font-body mt-1">{errors[id]}</p>}
      </div>
    )
  }

  return (
    <main>
      <PageHeader step={step} />

      {/* Hidden PayFast auto-submit form */}
      {payfastData && (
        <>
          <form ref={payfastFormRef} method="POST" action={payfastData.url} className="hidden">
            {Object.entries(payfastData.params).map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v} />
            ))}
          </form>
          {/* Overlay while redirecting */}
          <div className="fixed inset-0 z-50 bg-brand-teal/90 flex flex-col items-center justify-center gap-4">
            <div className="text-5xl animate-bounce">💳</div>
            <p className="font-display text-2xl text-white">Redirecting to PayFast…</p>
            <p className="font-body text-sm text-white/70">Please do not close this window</p>
          </div>
        </>
      )}

      <div className="inner py-8">

        {/* Step indicator */}
        {step !== 'confirmed' && (
          <div className="flex items-center gap-0 mb-8 max-w-md">
            {(['delivery', 'payment'] as const).map((s, i) => {
              const done    = (step === 'payment' && s === 'delivery')
              const active  = step === s
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading
                                   font-bold flex-shrink-0 transition-all ${
                    done   ? 'bg-brand-green text-white' :
                    active ? 'bg-brand-teal text-white shadow-btn' :
                             'bg-gray-200 text-gray-400'
                  }`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className={`ml-2 text-[0.8rem] font-heading font-semibold capitalize ${
                    active ? 'text-brand-teal' : done ? 'text-brand-green' : 'text-gray-400'
                  }`}>
                    {s}
                  </span>
                  {i < 1 && <div className={`flex-1 h-0.5 mx-3 ${done ? 'bg-brand-green' : 'bg-gray-200'}`} />}
                </div>
              )
            })}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-7 items-start">

          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* STEP 1 — DELIVERY */}
            {step === 'delivery' && (
              <form onSubmit={handleDeliverySubmit} noValidate>
                <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
                  <h2 className="font-display text-xl text-brand-teal-dark mb-1">Delivery Information</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('fullName', 'Full Name', 'text', 'e.g. Ahmed Ali')}
                    {field('phone',    'Mobile Number', 'tel', '03001234567')}
                  </div>

                  {field('email', 'Email (optional)', 'email', 'you@example.com', false)}
                  {field('address', 'Street Address', 'text', 'House no., street, area')}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City select */}
                    <div>
                      <label className="block font-heading font-semibold text-[0.82rem] text-[#0f1f28] mb-1.5" htmlFor="city">
                        City<span className="text-red-400 ml-0.5">*</span>
                      </label>
                      <select
                        id="city"
                        value={delivery.city}
                        onChange={e => { setDelivery(d => ({ ...d, city: e.target.value })); setErrors(er => ({ ...er, city: undefined })) }}
                        className={`w-full border-2 rounded-xl px-4 py-2.5 font-body text-sm text-[#0f1f28]
                                    outline-none transition-colors bg-white cursor-pointer
                                    ${errors.city ? 'border-red-400' : 'border-gray-200 focus:border-brand-teal'}`}>
                        <option value="">Select city…</option>
                        {PAKISTAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.city && <p className="text-red-400 text-xs font-body mt-1">{errors.city}</p>}
                    </div>

                    {field('province', 'Province', 'text', 'e.g. Punjab', false)}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block font-heading font-semibold text-[0.82rem] text-[#0f1f28] mb-1.5" htmlFor="notes">
                      Order Notes (optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      placeholder="Special instructions, landmark, preferred delivery time…"
                      value={delivery.notes}
                      onChange={e => setDelivery(d => ({ ...d, notes: e.target.value }))}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 font-body text-sm
                                 text-[#0f1f28] outline-none focus:border-brand-teal transition-colors
                                 bg-white resize-none"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary mt-5 w-full justify-center py-3.5 text-base">
                  Continue to Payment →
                </button>
              </form>
            )}

            {/* STEP 2 — PAYMENT */}
            {step === 'payment' && (
              <div className="space-y-5">
                {/* Delivery summary */}
                <div className="bg-white rounded-2xl shadow-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-base text-brand-teal-dark">Delivering to</h3>
                    <button
                      onClick={() => setStep('delivery')}
                      className="text-xs font-heading font-semibold text-brand-teal hover:text-brand-teal-dark
                                 underline underline-offset-2 transition-colors">
                      Edit
                    </button>
                  </div>
                  <p className="font-body text-sm text-[#0f1f28] font-semibold">{delivery.fullName}</p>
                  <p className="font-body text-sm text-[#3d5a65]">{delivery.address}, {delivery.city}</p>
                  <p className="font-body text-sm text-[#3d5a65]">{delivery.phone}</p>
                </div>

                {/* Payment method */}
                <div className="bg-white rounded-2xl shadow-card p-6">
                  <h2 className="font-display text-xl text-brand-teal-dark mb-4">Payment Method</h2>

                  <div className="space-y-3">
                    {/* COD */}
                    <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-brand-teal bg-brand-green-light'
                        : 'border-gray-200 hover:border-brand-teal/40'
                    }`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')} className="mt-0.5 accent-brand-teal" />
                      <div className="flex-1">
                        <p className="font-heading font-semibold text-[0.95rem] text-[#0f1f28]">
                          💵 Cash on Delivery (COD)
                        </p>
                        <p className="font-body text-xs text-[#3d5a65] mt-0.5">
                          Pay in cash when your order arrives. No advance payment needed.
                        </p>
                      </div>
                    </label>

                    {/* PayFast */}
                    <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'payfast'
                        ? 'border-brand-teal bg-brand-green-light'
                        : 'border-gray-200 hover:border-brand-teal/40'
                    }`}>
                      <input type="radio" name="payment" value="payfast" checked={paymentMethod === 'payfast'}
                        onChange={() => setPaymentMethod('payfast')} className="mt-0.5 accent-brand-teal" />
                      <div className="flex-1">
                        <p className="font-heading font-semibold text-[0.95rem] text-[#0f1f28]">
                          💳 Card / JazzCash / Easypaisa
                        </p>
                        <p className="font-body text-xs text-[#3d5a65] mt-0.5">
                          Pay securely via PayFast PK — Mastercard, Visa, JazzCash & Easypaisa accepted.
                        </p>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {['Mastercard', 'Visa', 'JazzCash', 'Easypaisa'].map(m => (
                            <span key={m} className="text-[0.65rem] font-heading font-semibold px-2 py-0.5
                                                     rounded-full bg-white border border-gray-200 text-[#3d5a65]">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'payfast' && (
                    <div className="mt-4 p-4 bg-brand-yellow/15 rounded-xl border border-brand-yellow/40">
                      <p className="font-body text-xs text-brand-teal-dark">
                        🔒 You&apos;ll be redirected to PayFast&apos;s secure payment page after placing your order.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                  {placing
                    ? '⏳ Placing Order…'
                    : paymentMethod === 'cod'
                      ? `Place Order — Rs. ${grandTotal.toLocaleString()} (COD)`
                      : `Pay Rs. ${grandTotal.toLocaleString()} via PayFast →`
                  }
                </button>

                <p className="text-center font-body text-xs text-gray-400">
                  🔒 Your information is encrypted and secure
                </p>
              </div>
            )}

            {/* STEP 3 — CONFIRMED */}
            {step === 'confirmed' && (
              <div className="bg-white rounded-2xl shadow-card p-8 text-center">
                <div className="w-20 h-20 bg-brand-green/15 rounded-full flex items-center justify-center
                                text-4xl mx-auto mb-5">
                  🎉
                </div>
                <h2 className="font-display text-2xl text-brand-teal-dark mb-2">Order Placed!</h2>
                <p className="font-body text-[#3d5a65] mb-1">
                  Thank you, <span className="font-semibold text-[#0f1f28]">{delivery.fullName}</span>!
                </p>
                <p className="font-body text-sm text-[#3d5a65] mb-6">
                  Your order <span className="font-semibold text-brand-teal">{orderId}</span> has been received.<br />
                  {paymentMethod === 'cod'
                    ? 'Pay in cash when your toys arrive.'
                    : 'Payment confirmed via PayFast.'
                  }
                </p>

                <div className="bg-brand-green-light rounded-xl px-6 py-4 mb-6 text-left space-y-1.5">
                  <p className="font-body text-sm text-[#3d5a65]">
                    📦 Delivering to: <span className="font-semibold text-[#0f1f28]">{delivery.address}, {delivery.city}</span>
                  </p>
                  <p className="font-body text-sm text-[#3d5a65]">
                    📞 Contact: <span className="font-semibold text-[#0f1f28]">{delivery.phone}</span>
                  </p>
                  <p className="font-body text-sm text-[#3d5a65]">
                    🚚 Estimated delivery: <span className="font-semibold text-[#0f1f28]">2–4 business days</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/" className="btn-primary px-8 py-3">Continue Shopping</Link>
                  <Link href="/products" className="btn-outline px-8 py-3">Browse More Toys</Link>
                </div>
              </div>
            )}
          </div>

          {/* ── Right column — Order Summary ─────────────────────────── */}
          {step !== 'confirmed' && (
            <div className="w-full lg:w-[320px] flex-shrink-0 sticky top-24">
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h2 className="font-display text-lg text-brand-teal-dark mb-4">
                  Order Summary
                  <span className="font-body text-sm text-gray-400 ml-2">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                </h2>

                {/* Items */}
                <ul className="divide-y divide-gray-100 mb-4 max-h-64 overflow-y-auto pr-1">
                  {items.map(item => (
                    <li key={item.id} className="flex gap-3 py-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-brand-green-light flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-semibold text-[0.8rem] text-[#0f1f28] line-clamp-2 leading-snug">
                          {item.name}
                        </p>
                        <p className="font-body text-xs text-[#3d5a65] mt-0.5">
                          Qty: {item.qty} × Rs. {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-display text-[0.9rem] text-brand-teal-dark flex-shrink-0 self-center">
                        Rs. {(item.price * item.qty).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Totals */}
                <div className="space-y-2 font-body text-sm text-[#3d5a65] border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#0f1f28]">Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className={`font-semibold ${deliveryFee === 0 ? 'text-brand-green' : 'text-[#0f1f28]'}`}>
                      {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="font-semibold text-[#0f1f28] text-base">Total</span>
                    <span className="font-display text-[1.15rem] text-brand-teal-dark">
                      Rs. {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-4 text-[0.7rem] font-body text-gray-400">
                  <span>🔒 Secure</span>
                  <span>🚚 2–4 Days</span>
                  <span>↩️ Easy Returns</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function PageHeader({ step }: { step: Step }) {
  const title = step === 'confirmed' ? 'Order Confirmed' : 'Checkout'
  return (
    <section className="bg-brand-teal py-10">
      <div className="inner">
        <p className="section-eyebrow text-brand-yellow">🛒 Checkout</p>
        <h1 className="font-display text-white mt-1" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
          {title}
        </h1>
        <nav className="mt-4 flex items-center gap-2 text-xs font-body text-white/60">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span>/</span>
          <a href="/cart" className="hover:text-white transition-colors">Cart</a>
          <span>/</span>
          <span className="text-white">{title}</span>
        </nav>
      </div>
    </section>
  )
}

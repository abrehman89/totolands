'use client'
import { useState } from 'react'
import { CATEGORIES } from '@/lib/products-data'

interface Props { isEdit?: boolean }

export default function AdminProductForm({ isEdit = false }: Props) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const inputCls = 'w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 font-body text-sm text-[#0f1f28] outline-none focus:border-brand-teal transition-colors bg-white'
  const labelCls = 'block font-heading font-semibold text-[0.82rem] text-[#0f1f28] mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {saved && (
        <div className="bg-brand-green/10 border border-brand-green rounded-xl px-5 py-3">
          <p className="font-body text-sm text-brand-green font-semibold">
            ✓ Product {isEdit ? 'updated' : 'saved'} successfully! (mock — DB not yet connected)
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-brand-teal-dark">Basic Information</h2>

        <div>
          <label className={labelCls}>Product Name *</label>
          <input type="text" className={inputCls} placeholder="e.g. RC Sports Racing Car — Full Function"
            defaultValue={isEdit ? 'RC Sports Racing Car — Full Function' : ''} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Category *</label>
            <select className={inputCls} defaultValue={isEdit ? 'Remote Control' : ''} required>
              <option value="">Select category…</option>
              {CATEGORIES.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Age Range</label>
            <input type="text" className={inputCls} placeholder="e.g. 6–12 Years"
              defaultValue={isEdit ? '6–12 Years' : ''} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Description *</label>
          <textarea rows={4} className={inputCls + ' resize-none'} required
            placeholder="Describe the product in detail…"
            defaultValue={isEdit ? 'Experience the thrill of high-speed racing with our Full-Function RC Sports Car!' : ''} />
        </div>

        <div>
          <label className={labelCls}>Features (one per line)</label>
          <textarea rows={4} className={inputCls + ' resize-none'}
            placeholder={'Full-function remote control\nBuilt-in LED headlights\nUSB rechargeable battery'}
            defaultValue={isEdit ? 'Full-function remote control\nBuilt-in LED headlights\nUSB rechargeable battery' : ''} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-brand-teal-dark">Pricing & Stock</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Price (Rs.) *</label>
            <input type="number" min="0" className={inputCls} placeholder="3200"
              defaultValue={isEdit ? 3200 : ''} required />
          </div>
          <div>
            <label className={labelCls}>Old Price (Rs.)</label>
            <input type="number" min="0" className={inputCls} placeholder="4000"
              defaultValue={isEdit ? 4000 : ''} />
          </div>
          <div>
            <label className={labelCls}>Stock Qty *</label>
            <input type="number" min="0" className={inputCls} placeholder="18"
              defaultValue={isEdit ? 18 : ''} required />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Badge</label>
            <select className={inputCls} defaultValue={isEdit ? 'sale' : ''}>
              <option value="">No badge</option>
              <option value="sale">Sale</option>
              <option value="new">New</option>
              <option value="top">Top Pick</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Badge Text (optional)</label>
            <input type="text" className={inputCls} placeholder="e.g. -20%"
              defaultValue={isEdit ? '-20%' : ''} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-brand-teal-dark">Product Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Material</label>
            <input type="text" className={inputCls} placeholder="e.g. ABS Plastic"
              defaultValue={isEdit ? 'ABS Plastic' : ''} />
          </div>
          <div>
            <label className={labelCls}>What's in the Box</label>
            <input type="text" className={inputCls} placeholder="Car × 1, Remote × 1"
              defaultValue={isEdit ? 'Car × 1, Remote × 1, USB Charger × 1' : ''} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Image URL (main)</label>
          <input type="text" className={inputCls} placeholder="/images/prod-rc-car.jpg"
            defaultValue={isEdit ? '/images/prod-rc-car.jpg' : ''} />
          <p className="font-body text-xs text-gray-400 mt-1">
            Cloudinary upload will be wired here once storage is set up.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading}
          className="btn-primary px-8 py-3 disabled:opacity-60 disabled:cursor-not-allowed
                     disabled:translate-y-0 disabled:shadow-none">
          {loading ? '⏳ Saving…' : isEdit ? '✓ Update Product' : '+ Add Product'}
        </button>
      </div>
    </form>
  )
}

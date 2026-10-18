'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Category { id: string; name: string }

interface ProductData {
  id?: string
  name: string
  categoryId: string
  ageRange: string
  description: string
  features: string
  price: string
  oldPrice: string
  stock: string
  badge: string
  badgeText: string
  material: string
  inBox: string
  image: string
}

interface Props {
  isEdit?: boolean
  productId?: string
  initial?: Partial<ProductData>
  categories: Category[]
}

export default function AdminProductForm({ isEdit = false, productId, initial = {}, categories }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<ProductData>({
    name:        initial.name        ?? '',
    categoryId:  initial.categoryId  ?? '',
    ageRange:    initial.ageRange    ?? '',
    description: initial.description ?? '',
    features:    initial.features    ?? '',
    price:       initial.price       ?? '',
    oldPrice:    initial.oldPrice    ?? '',
    stock:       initial.stock       ?? '',
    badge:       initial.badge       ?? '',
    badgeText:   initial.badgeText   ?? '',
    material:    initial.material    ?? '',
    inBox:       initial.inBox       ?? '',
    image:       initial.image       ?? '',
  })
  const [saving,    setSaving]    = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [error,     setError]     = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function setField(key: keyof ProductData, val: string) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadErr('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setField('image', data.url)
    } catch (err: any) {
      setUploadErr(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const payload = {
      name:        form.name,
      categoryId:  form.categoryId,
      ageRange:    form.ageRange,
      description: form.description,
      features:    form.features.split('\n').map(l => l.trim()).filter(Boolean),
      price:       Number(form.price),
      oldPrice:    form.oldPrice ? Number(form.oldPrice) : null,
      stock:       Number(form.stock),
      badge:       form.badge    || null,
      badgeText:   form.badgeText || null,
      material:    form.material || null,
      inBox:       form.inBox    || null,
      image:       form.image    || '/images/prod-rc-car.jpg',
    }

    try {
      const url    = isEdit ? `/api/admin/products/${productId}` : '/api/admin/products'
      const method = isEdit ? 'PATCH' : 'POST'
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setSuccess(true)
      if (!isEdit) {
        setTimeout(() => router.push('/admin/products'), 1200)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 font-body text-sm text-[#0f1f28] outline-none focus:border-brand-teal transition-colors bg-white'
  const labelCls = 'block font-heading font-semibold text-[0.82rem] text-[#0f1f28] mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {success && (
        <div className="bg-brand-green/10 border border-brand-green rounded-xl px-5 py-3">
          <p className="font-body text-sm text-brand-green font-semibold">
            ✓ Product {isEdit ? 'updated' : 'added'} successfully!
            {!isEdit && ' Redirecting…'}
          </p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3">
          <p className="font-body text-sm text-red-500">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-brand-teal-dark">Basic Information</h2>

        <div>
          <label className={labelCls}>Product Name *</label>
          <input type="text" className={inputCls} required
            placeholder="e.g. RC Sports Racing Car — Full Function"
            value={form.name} onChange={e => setField('name', e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Category *</label>
            <select className={inputCls} required
              value={form.categoryId} onChange={e => setField('categoryId', e.target.value)}>
              <option value="">Select category…</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Age Range</label>
            <input type="text" className={inputCls} placeholder="e.g. 6–12 Years"
              value={form.ageRange} onChange={e => setField('ageRange', e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Description *</label>
          <textarea rows={4} className={inputCls + ' resize-none'} required
            placeholder="Describe the product in detail…"
            value={form.description} onChange={e => setField('description', e.target.value)} />
        </div>

        <div>
          <label className={labelCls}>Features (one per line)</label>
          <textarea rows={4} className={inputCls + ' resize-none'}
            placeholder={'Full-function remote control\nBuilt-in LED headlights\nUSB rechargeable battery'}
            value={form.features} onChange={e => setField('features', e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-brand-teal-dark">Pricing & Stock</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Price (Rs.) *</label>
            <input type="number" min="0" className={inputCls} placeholder="3200" required
              value={form.price} onChange={e => setField('price', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Old Price (Rs.)</label>
            <input type="number" min="0" className={inputCls} placeholder="4000"
              value={form.oldPrice} onChange={e => setField('oldPrice', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Stock Qty *</label>
            <input type="number" min="0" className={inputCls} placeholder="18" required
              value={form.stock} onChange={e => setField('stock', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Badge</label>
            <select className={inputCls} value={form.badge} onChange={e => setField('badge', e.target.value)}>
              <option value="">No badge</option>
              <option value="sale">Sale</option>
              <option value="new">New</option>
              <option value="top">Top Pick</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Badge Text (optional)</label>
            <input type="text" className={inputCls} placeholder="e.g. -20%"
              value={form.badgeText} onChange={e => setField('badgeText', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
        <h2 className="font-display text-lg text-brand-teal-dark">Product Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Material</label>
            <input type="text" className={inputCls} placeholder="e.g. ABS Plastic"
              value={form.material} onChange={e => setField('material', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>What's in the Box</label>
            <input type="text" className={inputCls} placeholder="Car × 1, Remote × 1"
              value={form.inBox} onChange={e => setField('inBox', e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Product Image</label>

          {/* Preview */}
          {form.image && (
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-brand-green-light mb-3">
              <Image src={form.image} alt="Product preview" fill className="object-cover" />
            </div>
          )}

          {/* Upload button */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-outline text-sm px-4 py-2 disabled:opacity-60">
              {uploading ? '⏳ Uploading…' : form.image ? '🔄 Change Image' : '📷 Upload Image'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {form.image && !uploading && (
              <span className="font-body text-xs text-brand-green font-semibold">✓ Image uploaded</span>
            )}
          </div>

          {/* Fallback: manual URL */}
          <div className="mt-3">
            <label className="block font-body text-xs text-gray-400 mb-1">Or paste image URL directly</label>
            <input type="text" className={inputCls} placeholder="/images/prod-rc-car.jpg or https://…"
              value={form.image} onChange={e => setField('image', e.target.value)} />
          </div>

          {uploadErr && <p className="font-body text-xs text-red-500 mt-1">{uploadErr}</p>}
          <p className="font-body text-xs text-gray-400 mt-1">Max 5 MB · JPG, PNG, or WebP</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="btn-primary px-8 py-3 disabled:opacity-60 disabled:cursor-not-allowed
                     disabled:translate-y-0 disabled:shadow-none">
          {saving ? '⏳ Saving…' : isEdit ? '✓ Update Product' : '+ Add Product'}
        </button>
      </div>
    </form>
  )
}

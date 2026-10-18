'use client'
import { useState } from 'react'
import Image from 'next/image'

interface Banner { id: string; title: string; subtitle: string; image: string; link: string; active: boolean }
interface Props  { initialBanners: Banner[] }

export default function AdminBannersClient({ initialBanners }: Props) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [saved,   setSaved]   = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function toggleActive(b: Banner) {
    const updated = { ...b, active: !b.active }
    setBanners(bs => bs.map(x => x.id === b.id ? updated : x))
    await fetch(`/api/admin/banners/${b.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !b.active }),
    })
  }

  async function handleSave(id: string) {
    await fetch(`/api/admin/banners/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: banners.find(b => b.id === id)?.active }),
    })
    setSaved(id)
    setTimeout(() => setSaved(null), 2000)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this banner?')) return
    setDeleting(id)
    const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setBanners(bs => bs.filter(b => b.id !== id))
    }
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      {banners.length === 0 && (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center">
          <p className="font-body text-gray-400">No banners yet. Add one to get started.</p>
        </div>
      )}
      {banners.map(banner => (
        <div key={banner.id}
          className={`bg-white rounded-2xl shadow-card overflow-hidden border-2 transition-all ${
            banner.active ? 'border-brand-green/40' : 'border-gray-200 opacity-70'
          }`}>
          <div className="flex flex-col sm:flex-row items-start gap-0">
            {/* Preview */}
            <div className="relative w-full sm:w-48 h-28 flex-shrink-0 bg-brand-green-light">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-brand-teal/40 flex items-end p-3">
                <div>
                  <p className="font-display text-white text-sm leading-tight">{banner.title}</p>
                  <p className="font-body text-white/80 text-[0.7rem] mt-0.5">{banner.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-heading font-semibold text-[0.95rem] text-[#0f1f28]">{banner.title}</p>
                  <p className="font-body text-sm text-[#3d5a65] mt-0.5">{banner.subtitle}</p>
                  <p className="font-body text-xs text-gray-400 mt-1">Link: {banner.link}</p>
                </div>
                <span className={`flex-shrink-0 text-[0.72rem] font-heading font-semibold px-2.5 py-0.5 rounded-full border ${
                  banner.active
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {banner.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {saved === banner.id && (
                <p className="font-body text-xs text-brand-green font-semibold mb-3">✓ Saved!</p>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => toggleActive(banner)}
                  className={`flex items-center gap-2 text-sm font-heading font-semibold px-4 py-2
                              rounded-xl transition-all ${
                    banner.active
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-brand-green-light text-brand-teal-dark hover:bg-brand-green hover:text-white'
                  }`}>
                  {banner.active ? '⏸ Deactivate' : '▶ Activate'}
                </button>
                <button onClick={() => handleSave(banner.id)}
                  className="text-sm font-heading font-semibold px-4 py-2 rounded-xl bg-brand-teal
                             text-white hover:bg-brand-teal-dark transition-all">
                  Save
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  disabled={deleting === banner.id}
                  className="text-sm font-heading font-semibold px-4 py-2 rounded-xl bg-red-50
                             text-red-500 hover:bg-red-100 transition-all disabled:opacity-50">
                  {deleting === banner.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ADMIN_BANNERS, AdminBanner } from '@/lib/admin-data'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<AdminBanner[]>(ADMIN_BANNERS)
  const [saved, setSaved] = useState<string | null>(null)

  function toggleActive(id: string) {
    setBanners(bs => bs.map(b => b.id === id ? { ...b, active: !b.active } : b))
  }

  async function handleSave(id: string) {
    await new Promise(r => setTimeout(r, 600))
    setSaved(id)
    setTimeout(() => setSaved(null), 2000)
  }

  return (
    <div className="p-6 lg:p-8 mt-[56px] lg:mt-0">
      <AdminHeader
        title="Banners"
        subtitle="Manage homepage hero banners"
        action={
          <button className="btn-primary text-sm px-5 py-2.5">+ Add Banner</button>
        }
      />

      <div className="space-y-4">
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
                  {/* Toggle */}
                  <button
                    onClick={() => toggleActive(banner.id)}
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
                  <button className="text-sm font-heading font-semibold px-4 py-2 rounded-xl bg-gray-100
                                     text-[#3d5a65] hover:bg-gray-200 transition-all">
                    Edit
                  </button>
                  <button className="text-sm font-heading font-semibold px-4 py-2 rounded-xl bg-red-50
                                     text-red-500 hover:bg-red-100 transition-all">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="font-body text-xs text-gray-400 mt-5">
        💡 Changes are saved to mock data only — full persistence will be available once Supabase is connected.
      </p>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { AdminOrder, STATUS_COLORS } from '@/lib/admin-data'

const STATUSES: AdminOrder['status'][] = ['Pending','Confirmed','Shipped','Delivered','Cancelled']

const STATUS_ICONS: Record<AdminOrder['status'], string> = {
  Pending:   '⏳',
  Confirmed: '✅',
  Shipped:   '🚚',
  Delivered: '🎉',
  Cancelled: '❌',
}

interface Props { orderId: string; currentStatus: AdminOrder['status'] }

export default function OrderStatusManager({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  async function handleSave() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
      <h2 className="font-display text-lg text-brand-teal-dark mb-1">Order Status</h2>
      <p className="font-body text-xs text-gray-400 mb-5">Update and save the order status</p>

      {saved && (
        <div className="bg-brand-green/10 border border-brand-green rounded-xl px-4 py-2.5 mb-4">
          <p className="font-body text-sm text-brand-green font-semibold">✓ Status updated!</p>
        </div>
      )}

      <div className="space-y-2 mb-6">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left
                        font-heading font-semibold text-sm transition-all ${
              status === s
                ? 'border-brand-teal bg-brand-green-light text-brand-teal-dark shadow-sm'
                : 'border-gray-200 text-[#3d5a65] hover:border-brand-teal/40'
            }`}>
            <span className="text-lg">{STATUS_ICONS[s]}</span>
            {s}
            {s === currentStatus && (
              <span className="ml-auto text-[0.65rem] font-body text-gray-400">current</span>
            )}
          </button>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving || status === currentStatus && !saved}
        className="btn-primary w-full justify-center py-3 text-sm
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none">
        {saving ? '⏳ Saving…' : 'Save Status'}
      </button>

      <div className="mt-5 pt-5 border-t border-gray-100">
        <p className="font-body text-xs text-gray-400 mb-2">Current badge</p>
        <span className={`text-[0.72rem] font-heading font-semibold px-3 py-1 rounded-full border ${STATUS_COLORS[status]}`}>
          {status}
        </span>
      </div>
    </div>
  )
}

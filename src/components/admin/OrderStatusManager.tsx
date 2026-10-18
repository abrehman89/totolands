'use client'
import { useState } from 'react'

type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'

const STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Shipped:   'bg-purple-100 text-purple-700 border-purple-200',
  Delivered: 'bg-green-100 text-green-700 border-green-200',
  Cancelled: 'bg-red-100 text-red-700 border-red-200',
}

const STATUS_ICONS: Record<OrderStatus, string> = {
  Pending:   '⏳',
  Confirmed: '✅',
  Shipped:   '🚚',
  Delivered: '🎉',
  Cancelled: '❌',
}

interface Props { orderId: string; currentStatus: OrderStatus }

export default function OrderStatusManager({ orderId, currentStatus }: Props) {
  const [status,  setStatus]  = useState<OrderStatus>(currentStatus)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
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
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 mb-4">
          <p className="font-body text-sm text-red-500">{error}</p>
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
            {s === currentStatus && status !== s && (
              <span className="ml-auto text-[0.65rem] font-body text-gray-400">current</span>
            )}
          </button>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving || status === currentStatus}
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

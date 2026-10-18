'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  createdAt: Date
}

interface Props {
  user: UserData
  orderCount: number
}

export default function AccountClient({ user, orderCount }: Props) {
  const [editing, setEditing]   = useState(false)
  const [name, setName]         = useState(user.name)
  const [phone, setPhone]       = useState(user.phone)
  const [saving, setSaving]     = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Update failed')
      setSuccess(true)
      setEditing(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-144px)] bg-brand-off-white py-10">
      <div className="inner max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl text-brand-teal-dark mb-1">My Account</h1>
          <p className="font-body text-gray-500">Manage your profile and preferences</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-card p-5 text-center">
            <p className="font-display text-3xl text-brand-teal">{orderCount}</p>
            <p className="font-body text-sm text-gray-500 mt-1">Total Orders</p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-5 text-center">
            <p className="font-body text-xs text-gray-400 mb-1">Member since</p>
            <p className="font-heading text-sm font-semibold text-brand-teal-dark">
              {new Date(user.createdAt).toLocaleDateString('en-PK', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-3xl shadow-card px-6 py-7 mb-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-lg font-semibold text-brand-teal-dark">Profile Details</h2>
            {!editing && (
              <button
                onClick={() => { setEditing(true); setSuccess(false) }}
                className="font-body text-sm text-brand-teal hover:text-brand-teal-dark transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          {success && (
            <div className="bg-green-50 text-green-700 text-sm font-body rounded-xl px-4 py-3 mb-5">
              Profile updated successfully!
            </div>
          )}

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-body text-sm text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-gray-500 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="03XXXXXXXXX"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal"
                />
              </div>
              <div>
                <label className="block font-body text-sm text-gray-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-gray-100 rounded-xl px-4 py-2.5 font-body text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
                <p className="font-body text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              {error && <p className="font-body text-sm text-red-500">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setName(user.name); setPhone(user.phone) }}
                  className="btn-outline px-5 py-2.5 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <Row label="Full Name"  value={name || '—'} />
              <Row label="Email"      value={user.email} />
              <Row label="Phone"      value={phone || '—'} />
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-3xl shadow-card px-6 py-5 mb-5">
          <Link
            href="/orders"
            className="flex items-center justify-between py-3 font-body text-sm text-gray-700 hover:text-brand-teal transition-colors border-b border-gray-100"
          >
            <span>📦 My Orders</span>
            <span className="text-gray-300">›</span>
          </Link>
          <Link
            href="/cart"
            className="flex items-center justify-between py-3 font-body text-sm text-gray-700 hover:text-brand-teal transition-colors"
          >
            <span>🛒 My Cart</span>
            <span className="text-gray-300">›</span>
          </Link>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full font-body text-sm text-red-500 hover:text-red-600 transition-colors py-3"
        >
          Sign Out
        </button>

      </div>
    </main>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="font-body text-sm text-gray-400">{label}</span>
      <span className="font-body text-sm text-gray-800">{value}</span>
    </div>
  )
}

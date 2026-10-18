'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORY_ICONS: Record<string, string> = {
  'Remote Control': '🏎️', 'Soft Toys': '🧸', 'Building Blocks': '🧱',
  'Arts & Crafts': '🎨',  'Dolls': '🪆',      'Outdoor': '⛺',
  'Puzzles': '🧩',         'Pretend Play': '🎭','Educational': '📚',
  'Board Games': '🎲',     'Action Figures': '🦸',
}

interface Category { id: string; name: string; slug: string; count: number }
interface Props { categories: Category[] }

export default function AdminCategoriesClient({ categories: initial }: Props) {
  const [categories, setCategories] = useState(initial)
  const [adding, setAdding]         = useState(false)
  const [newName, setNewName]       = useState('')
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')
  const router = useRouter()

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setCategories(prev => [...prev, { id: data.category.id, name: data.category.name, slug: data.category.slug, count: 0 }])
      setNewName('')
      setAdding(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="mb-6">
        <button onClick={() => { setAdding(v => !v); setError('') }}
          className="btn-primary text-sm px-5 py-2.5">
          {adding ? '✕ Cancel' : '+ Add Category'}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-card p-5 mb-6 max-w-md">
          <h3 className="font-display text-base text-brand-teal-dark mb-3">New Category</h3>
          <div className="flex gap-3">
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Category name…" required
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 font-body text-sm
                         text-[#0f1f28] outline-none focus:border-brand-teal transition-colors" />
            <button type="submit" disabled={saving}
              className="btn-primary text-sm px-5 py-2.5 disabled:opacity-60">
              {saving ? '…' : 'Save'}
            </button>
          </div>
          {error && <p className="font-body text-xs text-red-500 mt-2">{error}</p>}
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl shadow-card p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-green-light flex items-center justify-center text-2xl">
                {CATEGORY_ICONS[cat.name] ?? '🏷️'}
              </div>
              <div>
                <p className="font-heading font-semibold text-[0.95rem] text-[#0f1f28]">{cat.name}</p>
                <p className="font-body text-xs text-gray-400 mt-0.5">
                  {cat.count} product{cat.count !== 1 ? 's' : ''} · /{cat.slug}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <a href={`/category/${cat.slug}`} target="_blank"
                className="text-xs font-heading font-semibold text-brand-teal bg-brand-green-light
                           px-3 py-1 rounded-lg hover:bg-brand-teal hover:text-white transition-all">
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

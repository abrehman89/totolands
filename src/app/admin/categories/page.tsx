'use client'
import { useState } from 'react'
import { CATEGORIES } from '@/lib/products-data'
import { ALL_PRODUCTS } from '@/lib/products-data'
import AdminHeader from '@/components/admin/AdminHeader'

const CATEGORY_SLUGS: Record<string, string> = {
  'Remote Control':  'remote-control',
  'Soft Toys':       'soft-toys',
  'Building Blocks': 'building-blocks',
  'Arts & Crafts':   'arts-crafts',
  'Dolls':           'dolls',
  'Outdoor':         'outdoor',
  'Puzzles':         'puzzles',
  'Pretend Play':    'pretend-play',
  'Educational':     'educational',
  'Board Games':     'board-games',
  'Action Figures':  'action-figures',
}

const CATEGORY_ICONS: Record<string, string> = {
  'Remote Control': '🏎️', 'Soft Toys': '🧸', 'Building Blocks': '🧱',
  'Arts & Crafts': '🎨',  'Dolls': '🪆',      'Outdoor': '⛺',
  'Puzzles': '🧩',         'Pretend Play': '🎭','Educational': '📚',
  'Board Games': '🎲',     'Action Figures': '🦸',
}

export default function AdminCategoriesPage() {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')

  const cats = CATEGORIES.filter(c => c !== 'All')

  return (
    <div className="p-6 lg:p-8 mt-[56px] lg:mt-0">
      <AdminHeader
        title="Categories"
        subtitle={`${cats.length} categories`}
        action={
          <button onClick={() => setAdding(v => !v)} className="btn-primary text-sm px-5 py-2.5">
            {adding ? '✕ Cancel' : '+ Add Category'}
          </button>
        }
      />

      {adding && (
        <div className="bg-white rounded-2xl shadow-card p-5 mb-6 max-w-md">
          <h3 className="font-display text-base text-brand-teal-dark mb-3">New Category</h3>
          <div className="flex gap-3">
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Category name…"
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 font-body text-sm
                         text-[#0f1f28] outline-none focus:border-brand-teal transition-colors" />
            <button onClick={() => { setNewName(''); setAdding(false) }}
              className="btn-primary text-sm px-5 py-2.5">
              Save
            </button>
          </div>
          <p className="font-body text-xs text-gray-400 mt-2">
            Category will be saved once DB is connected.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cats.map(cat => {
          const count = ALL_PRODUCTS.filter(p => p.category === cat).length
          const slug  = CATEGORY_SLUGS[cat] ?? cat.toLowerCase().replace(/\s+/g, '-')
          return (
            <div key={cat} className="bg-white rounded-2xl shadow-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-green-light flex items-center justify-center text-2xl">
                  {CATEGORY_ICONS[cat] ?? '🏷️'}
                </div>
                <div>
                  <p className="font-heading font-semibold text-[0.95rem] text-[#0f1f28]">{cat}</p>
                  <p className="font-body text-xs text-gray-400 mt-0.5">
                    {count} product{count !== 1 ? 's' : ''} · /{slug}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 items-end">
                <a href={`/category/${slug}`} target="_blank"
                  className="text-xs font-heading font-semibold text-brand-teal bg-brand-green-light
                             px-3 py-1 rounded-lg hover:bg-brand-teal hover:text-white transition-all">
                  View
                </a>
                <button className="text-xs font-heading font-semibold text-[#3d5a65] bg-gray-100
                                   px-3 py-1 rounded-lg hover:bg-gray-200 transition-all">
                  Edit
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

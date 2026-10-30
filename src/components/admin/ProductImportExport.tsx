'use client'
import { useRef, useState } from 'react'
import Papa from 'papaparse'
import { useRouter } from 'next/navigation'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ExportProduct {
  name: string
  slug: string
  categoryName: string
  categorySlug: string
  description: string
  price: number
  oldPrice: number | null
  stock: number
  ageRange: string | null
  material: string | null
  inBox: string | null
  badge: string | null
  badgeText: string | null
  image: string
  images: string[]
  features: string[]
}

// ── CSV helpers ───────────────────────────────────────────────────────────────

const CSV_HEADERS = [
  'name', 'slug', 'categorySlug', 'description',
  'price', 'oldPrice', 'stock',
  'ageRange', 'material', 'inBox',
  'badge', 'badgeText',
  'image', 'images', 'features',
]

const TEMPLATE_EXAMPLE = [
  'Wooden Building Blocks Set', '', 'building-blocks',
  'Premium solid wood blocks for toddlers',
  '1499', '1799', '50',
  '3-5 Years', 'Wood', '60 Blocks + Storage Bag',
  'new', 'Just In',
  'https://example.com/image.jpg', '', 'Improves motor skills|Bright colours|Non-toxic paint',
]

function escapeCsvCell(val: string | number | null | undefined): string {
  const str = String(val ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function buildCsvString(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const lines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map(row => row.map(escapeCsvCell).join(',')),
  ]
  return lines.join('\r\n')
}

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadExcel(products: ExportProduct[]) {
  const headers = CSV_HEADERS
  const rows = products.map(p => [
    p.name, p.slug, p.categorySlug, p.description,
    p.price, p.oldPrice ?? '', p.stock,
    p.ageRange ?? '', p.material ?? '', p.inBox ?? '',
    p.badge ?? '', p.badgeText ?? '',
    p.image, p.images.join('|'), p.features.join('|'),
  ])

  // SpreadsheetML — opens natively in Excel/LibreOffice
  const cell = (v: string | number) =>
    typeof v === 'number'
      ? `<Cell><Data ss:Type="Number">${v}</Data></Cell>`
      : `<Cell><Data ss:Type="String">${String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</Data></Cell>`

  const xmlRows = [
    `<Row>${headers.map(h => cell(h)).join('')}</Row>`,
    ...rows.map(r => `<Row>${r.map(c => cell(c as string | number)).join('')}</Row>`),
  ].join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Products">
  <Table>${xmlRows}</Table>
 </Worksheet>
</Workbook>`

  downloadFile('totolands-products.xls', xml, 'application/vnd.ms-excel')
}

// ── Main component ────────────────────────────────────────────────────────────

type Step = 'upload' | 'preview' | 'result'

export default function ProductImportExport({ products }: { products: ExportProduct[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [showExport,  setShowExport]  = useState(false)
  const [showModal,   setShowModal]   = useState(false)
  const [step,        setStep]        = useState<Step>('upload')
  const [parsedRows,  setParsedRows]  = useState<Record<string, string>[]>([])
  const [parseError,  setParseError]  = useState('')
  const [loading,     setLoading]     = useState(false)
  const [result,      setResult]      = useState<{ created: number; errors: string[] } | null>(null)

  // ── Export ──────────────────────────────────────────────────────────────────

  function handleExportCsv() {
    const rows = products.map(p => [
      p.name, p.slug, p.categorySlug, p.description,
      p.price, p.oldPrice ?? '', p.stock,
      p.ageRange ?? '', p.material ?? '', p.inBox ?? '',
      p.badge ?? '', p.badgeText ?? '',
      p.image, p.images.join('|'), p.features.join('|'),
    ])
    const csv = buildCsvString(CSV_HEADERS, rows)
    downloadFile('totolands-products.csv', csv, 'text/csv')
    setShowExport(false)
  }

  function handleExportExcel() {
    downloadExcel(products)
    setShowExport(false)
  }

  // ── Template ────────────────────────────────────────────────────────────────

  function handleDownloadTemplate() {
    const csv = buildCsvString(CSV_HEADERS, [TEMPLATE_EXAMPLE])
    downloadFile('totolands-products-template.csv', csv, 'text/csv')
  }

  // ── Import: file parse ───────────────────────────────────────────────────────

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setParseError('')
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(res) {
        if (!res.data.length) {
          setParseError('The file appears to be empty.')
          return
        }
        const missing = ['name', 'categorySlug', 'price', 'stock', 'image'].filter(
          col => !Object.keys(res.data[0]).includes(col)
        )
        if (missing.length) {
          setParseError(`Missing required columns: ${missing.join(', ')}. Please use the template.`)
          return
        }
        setParsedRows(res.data)
        setStep('preview')
      },
      error(err) {
        setParseError(`Could not parse file: ${err.message}`)
      },
    })
    // reset so same file can be re-uploaded
    e.target.value = ''
  }

  // ── Import: submit ───────────────────────────────────────────────────────────

  async function handleImport() {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/products/import', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ rows: parsedRows }),
      })
      const data = await res.json()
      setResult(data)
      setStep('result')
      if (data.created > 0) router.refresh()
    } catch {
      setResult({ created: 0, errors: ['Network error — please try again.'] })
      setStep('result')
    } finally {
      setLoading(false)
    }
  }

  function closeModal() {
    setShowModal(false)
    setStep('upload')
    setParsedRows([])
    setParseError('')
    setResult(null)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const PREVIEW_COLS = ['name', 'categorySlug', 'price', 'stock', 'badge', 'image']

  return (
    <>
      {/* Buttons */}
      <div className="flex items-center gap-2">

        {/* Export dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExport(v => !v)}
            className="flex items-center gap-1.5 bg-white border border-gray-200 text-brand-teal-dark
                       font-heading font-semibold text-sm px-4 py-2.5 rounded-xl hover:border-brand-teal
                       hover:bg-brand-green-light transition-all shadow-sm">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {showExport && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowExport(false)} />
              <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100
                              overflow-hidden z-20 w-44">
                <button onClick={handleExportCsv}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-heading font-semibold
                             text-[#0f1f28] hover:bg-brand-green-light transition-colors">
                  <span className="text-base">📄</span> Export as CSV
                </button>
                <button onClick={handleExportExcel}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-heading font-semibold
                             text-[#0f1f28] hover:bg-brand-green-light transition-colors border-t border-gray-50">
                  <span className="text-base">📊</span> Export as Excel
                </button>
              </div>
            </>
          )}
        </div>

        {/* Import button */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-brand-teal text-white font-heading font-semibold
                     text-sm px-4 py-2.5 rounded-xl hover:bg-brand-teal-dark transition-all shadow-sm">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Import CSV
        </button>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,31,40,0.55)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
              <div>
                <h2 className="font-heading font-extrabold text-xl text-[#0f1f28]">
                  {step === 'upload'  && 'Import Products via CSV'}
                  {step === 'preview' && `Preview — ${parsedRows.length} rows`}
                  {step === 'result'  && 'Import Complete'}
                </h2>
                <p className="font-body text-sm text-[#3d5a65] mt-0.5">
                  {step === 'upload'  && 'Upload a CSV file to add multiple products at once'}
                  {step === 'preview' && 'Review the data before importing'}
                  {step === 'result'  && 'Here\'s what happened'}
                </p>
              </div>
              <button onClick={closeModal}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center
                           justify-center text-gray-500 transition-colors flex-shrink-0">
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-7 py-6">

              {/* ── Step 1: Upload ── */}
              {step === 'upload' && (
                <div className="space-y-5">

                  {/* Template download */}
                  <div className="bg-brand-green-light rounded-2xl p-5">
                    <p className="font-heading font-bold text-sm text-brand-teal-dark mb-1">Step 1 — Download the template</p>
                    <p className="font-body text-xs text-[#3d5a65] mb-3 leading-relaxed">
                      Use this template so your columns match exactly. Fill it in and save as CSV.
                    </p>
                    <button onClick={handleDownloadTemplate}
                      className="inline-flex items-center gap-2 bg-brand-teal text-white font-heading
                                 font-semibold text-xs px-4 py-2 rounded-full hover:bg-brand-teal-dark transition-colors">
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Download Template CSV
                    </button>
                  </div>

                  {/* Column guide */}
                  <div>
                    <p className="font-heading font-bold text-sm text-[#0f1f28] mb-2">CSV Column Guide</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { col: 'name',         req: true,  note: 'Product name' },
                        { col: 'categorySlug', req: true,  note: 'e.g. cars, building-blocks' },
                        { col: 'price',        req: true,  note: 'Number in Rs. (no commas)' },
                        { col: 'stock',        req: true,  note: 'Available quantity' },
                        { col: 'image',        req: true,  note: 'Main image URL' },
                        { col: 'description',  req: false, note: 'Product description' },
                        { col: 'oldPrice',     req: false, note: 'Original price (for sale)' },
                        { col: 'badge',        req: false, note: 'sale | new | top' },
                        { col: 'features',     req: false, note: 'Pipe-separated: A|B|C' },
                        { col: 'images',       req: false, note: 'Extra images, pipe-separated' },
                        { col: 'ageRange',     req: false, note: 'e.g. 3-5 Years' },
                      ].map(({ col, req, note }) => (
                        <div key={col} className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2">
                          <code className="font-mono text-[0.72rem] text-brand-teal bg-brand-green-light px-1.5 py-0.5 rounded flex-shrink-0">{col}</code>
                          {req && <span className="text-red-400 text-[0.65rem] font-heading font-bold mt-0.5 flex-shrink-0">REQ</span>}
                          <span className="font-body text-[0.72rem] text-[#3d5a65]">{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* File upload */}
                  <div>
                    <p className="font-heading font-bold text-sm text-[#0f1f28] mb-2">Step 2 — Upload your CSV</p>
                    <label
                      className="flex flex-col items-center justify-center border-2 border-dashed
                                 border-brand-teal/40 rounded-2xl p-8 cursor-pointer
                                 hover:border-brand-teal hover:bg-brand-green-light/50 transition-all">
                      <svg width="32" height="32" fill="none" stroke="#2E6B7A" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-3 opacity-60">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span className="font-heading font-semibold text-sm text-brand-teal">Click to choose CSV file</span>
                      <span className="font-body text-xs text-gray-400 mt-1">Only .csv files supported</span>
                      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
                    </label>
                    {parseError && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <p className="font-body text-sm text-red-500">{parseError}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Step 2: Preview ── */}
              {step === 'preview' && (
                <div className="space-y-4">
                  <div className="bg-brand-green-light rounded-xl px-4 py-3">
                    <p className="font-body text-sm text-brand-teal-dark">
                      <strong>{parsedRows.length} products</strong> found in your file. Review below, then click <strong>Import</strong>.
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {PREVIEW_COLS.map(c => (
                            <th key={c} className="text-left px-3 py-2.5 font-heading font-semibold text-[#3d5a65] whitespace-nowrap">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {parsedRows.slice(0, 20).map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            {PREVIEW_COLS.map(c => (
                              <td key={c} className="px-3 py-2 font-body text-[#0f1f28] max-w-[140px] truncate">
                                {row[c] || <span className="text-gray-300">—</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedRows.length > 20 && (
                      <p className="text-center font-body text-xs text-gray-400 py-2 bg-gray-50 border-t border-gray-100">
                        … and {parsedRows.length - 20} more rows
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ── Step 3: Result ── */}
              {step === 'result' && result && (
                <div className="space-y-4">
                  <div className={`rounded-2xl p-5 flex items-start gap-4 ${result.created > 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <span className="text-3xl">{result.created > 0 ? '✅' : '❌'}</span>
                    <div>
                      <p className="font-heading font-bold text-base text-[#0f1f28]">
                        {result.created} product{result.created !== 1 ? 's' : ''} imported successfully
                      </p>
                      {result.errors.length > 0 && (
                        <p className="font-body text-sm text-orange-600 mt-0.5">
                          {result.errors.length} row{result.errors.length !== 1 ? 's' : ''} had errors (skipped)
                        </p>
                      )}
                    </div>
                  </div>

                  {result.errors.length > 0 && (
                    <div>
                      <p className="font-heading font-semibold text-sm text-[#0f1f28] mb-2">Errors</p>
                      <div className="bg-red-50 rounded-xl p-4 space-y-1 max-h-48 overflow-y-auto">
                        {result.errors.map((e, i) => (
                          <p key={i} className="font-body text-xs text-red-600">• {e}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between px-7 py-4 border-t border-gray-100 bg-gray-50/50">
              {step === 'upload' && (
                <>
                  <p className="font-body text-xs text-gray-400">Max ~5,000 rows per import</p>
                  <button onClick={closeModal}
                    className="font-heading font-semibold text-sm text-[#3d5a65] hover:text-[#0f1f28] transition-colors">
                    Cancel
                  </button>
                </>
              )}

              {step === 'preview' && (
                <>
                  <button onClick={() => setStep('upload')}
                    className="font-heading font-semibold text-sm text-[#3d5a65] hover:text-[#0f1f28] transition-colors">
                    ← Back
                  </button>
                  <button onClick={handleImport} disabled={loading}
                    className="btn-primary text-sm px-6 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed
                               disabled:translate-y-0 disabled:shadow-none">
                    {loading ? '⏳ Importing…' : `Import ${parsedRows.length} Products`}
                  </button>
                </>
              )}

              {step === 'result' && (
                <>
                  <div />
                  <button onClick={closeModal} className="btn-primary text-sm px-6 py-2.5">
                    Done
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}

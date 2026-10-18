import crypto from 'crypto'

// Sandbox in dev/preview, production on vercel deploy
export function getPayFastUrl() {
  return process.env.PAYFAST_SANDBOX === 'true'
    ? 'https://sandbox.payfast.pk/checkout/pay'
    : 'https://www.payfast.pk/checkout/pay'
}

interface PayFastOptions {
  orderId:    string
  amount:     number
  itemName:   string
  email?:     string
  fullName?:  string
  returnUrl:  string
  cancelUrl:  string
  notifyUrl:  string
}

export function buildPayFastParams(opts: PayFastOptions): Record<string, string> {
  const params: Record<string, string> = {
    merchant_id:  process.env.PAYFAST_MERCHANT_ID  ?? '',
    merchant_key: process.env.PAYFAST_MERCHANT_KEY ?? '',
    return_url:   opts.returnUrl,
    cancel_url:   opts.cancelUrl,
    notify_url:   opts.notifyUrl,
    m_payment_id: opts.orderId,
    amount:       opts.amount.toFixed(2),
    item_name:    opts.itemName.slice(0, 255),
  }

  if (opts.email) params.email_address = opts.email

  if (opts.fullName) {
    const parts = opts.fullName.trim().split(/\s+/)
    params.name_first = parts[0]
    params.name_last  = parts.length > 1 ? parts.slice(1).join(' ') : parts[0]
  }

  params.signature = generateSignature(params)
  return params
}

export function generateSignature(params: Record<string, string>): string {
  // Build query string from all params except 'signature', in insertion order
  const qs = Object.entries(params)
    .filter(([k]) => k !== 'signature')
    .map(([k, v]) => `${k}=${encodeURIComponent(v.trim()).replace(/%20/g, '+')}`)
    .join('&')

  const passphrase = process.env.PAYFAST_PASSPHRASE
  const toHash = passphrase ? `${qs}&passphrase=${encodeURIComponent(passphrase.trim())}` : qs

  return crypto.createHash('md5').update(toHash).digest('hex')
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import AuthShell from './AuthShell'

interface FormState {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}
interface Errors {
  fullName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  agreeTerms?: string
  general?: string
}

const EMPTY: FormState = {
  fullName: '', email: '', phone: '',
  password: '', confirmPassword: '', agreeTerms: false,
}

export default function SignupClient() {
  const [form, setForm]       = useState<FormState>(EMPTY)
  const [errors, setErrors]   = useState<Errors>({})
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const e: Errors = {}
    if (!form.fullName.trim())                         e.fullName        = 'Full name is required'
    if (!/\S+@\S+\.\S+/.test(form.email.trim()))       e.email           = 'Enter a valid email address'
    if (form.phone && !/^0\d{10}$/.test(form.phone))   e.phone           = 'Enter a valid Pakistani number (e.g. 03001234567)'
    if (form.password.length < 8)                       e.password        = 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(form.password))                   e.password        = 'Include at least one uppercase letter'
    if (!/[0-9]/.test(form.password))                   e.password        = 'Include at least one number'
    if (form.confirmPassword !== form.password)         e.confirmPassword = 'Passwords do not match'
    if (!form.agreeTerms)                               e.agreeTerms      = 'You must agree to the Terms & Conditions'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({})

    // 1. Create account
    const res = await fetch('/api/auth/signup', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        fullName: form.fullName,
        email:    form.email,
        phone:    form.phone,
        password: form.password,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setErrors({ general: data.error ?? 'Something went wrong. Please try again.' })
      setLoading(false)
      return
    }

    // 2. Auto sign-in after successful registration
    await signIn('credentials', {
      email:    form.email.trim().toLowerCase(),
      password: form.password,
      redirect: false,
    })

    setLoading(false)
    setSuccess(true)
  }

  // Password strength indicator
  function pwStrength(): { label: string; color: string; width: string } {
    const pw = form.password
    if (!pw) return { label: '', color: 'bg-gray-200', width: '0%' }
    let score = 0
    if (pw.length >= 8)         score++
    if (/[A-Z]/.test(pw))       score++
    if (/[0-9]/.test(pw))       score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    if (score <= 1) return { label: 'Weak',   color: 'bg-red-400',          width: '25%' }
    if (score === 2) return { label: 'Fair',   color: 'bg-brand-yellow-dark', width: '50%' }
    if (score === 3) return { label: 'Good',   color: 'bg-brand-green',       width: '75%' }
    return              { label: 'Strong', color: 'bg-brand-green',       width: '100%' }
  }

  const strength = pwStrength()

  if (success) {
    return (
      <AuthShell
        title="Account Created! 🎉"
        subtitle="Welcome to the Totolands family."
        footerText="Wrong account?"
        footerLinkLabel="Sign out"
        footerLinkHref="/auth/login">
        <div className="text-center py-4">
          <p className="text-5xl mb-4">🧸</p>
          <p className="font-body text-sm text-[#3d5a65] mb-2">
            Account created for <span className="font-semibold text-[#0f1f28]">{form.email}</span>
          </p>
          <p className="font-body text-xs text-gray-400 mb-6">
            Check your email for a verification link.
          </p>
          <Link href="/" className="btn-primary w-full justify-center py-3">
            Start Shopping 🛍️
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create Account 🧸"
      subtitle="Join thousands of happy parents on Totolands"
      footerText="Already have an account?"
      footerLinkLabel="Login"
      footerLinkHref="/auth/login">

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <p className="font-body text-sm text-red-500">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">

        {/* Full Name */}
        <Field label="Full Name" id="fullName" error={errors.fullName}>
          <input id="fullName" type="text" placeholder="Ahmed Ali"
            value={form.fullName} autoComplete="name"
            onChange={e => set('fullName', e.target.value)}
            className={inputCls(!!errors.fullName)} />
        </Field>

        {/* Email */}
        <Field label="Email Address" id="email" error={errors.email}>
          <input id="email" type="email" placeholder="you@example.com"
            value={form.email} autoComplete="email"
            onChange={e => set('email', e.target.value)}
            className={inputCls(!!errors.email)} />
        </Field>

        {/* Phone (optional) */}
        <Field label="Mobile Number" id="phone" error={errors.phone} optional>
          <input id="phone" type="tel" placeholder="03001234567"
            value={form.phone} autoComplete="tel"
            onChange={e => set('phone', e.target.value)}
            className={inputCls(!!errors.phone)} />
        </Field>

        {/* Password */}
        <Field label="Password" id="password" error={errors.password}>
          <div className="relative">
            <input id="password" type={showPw ? 'text' : 'password'}
              placeholder="Min 8 characters"
              value={form.password} autoComplete="new-password"
              onChange={e => set('password', e.target.value)}
              className={inputCls(!!errors.password) + ' pr-14'} />
            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-heading
                         font-semibold text-gray-400 hover:text-brand-teal transition-colors select-none">
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
          {form.password && (
            <div className="mt-2">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                  style={{ width: strength.width }} />
              </div>
              <p className={`text-xs font-body mt-1 ${
                strength.label === 'Strong' ? 'text-brand-green' :
                strength.label === 'Good'   ? 'text-brand-green' :
                strength.label === 'Fair'   ? 'text-brand-yellow-dark' : 'text-red-400'
              }`}>
                {strength.label} password
              </p>
            </div>
          )}
        </Field>

        {/* Confirm Password */}
        <Field label="Confirm Password" id="confirmPassword" error={errors.confirmPassword}>
          <input id="confirmPassword" type={showPw ? 'text' : 'password'}
            placeholder="Re-enter password"
            value={form.confirmPassword} autoComplete="new-password"
            onChange={e => set('confirmPassword', e.target.value)}
            className={inputCls(!!errors.confirmPassword)} />
        </Field>

        {/* Terms */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.agreeTerms}
              onChange={e => set('agreeTerms', e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-brand-teal flex-shrink-0" />
            <span className="font-body text-xs text-[#3d5a65] leading-relaxed">
              I agree to Totolands{' '}
              <Link href="/terms" className="text-brand-teal hover:underline">Terms & Conditions</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-brand-teal hover:underline">Privacy Policy</Link>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-red-400 text-xs font-body mt-1 ml-7">{errors.agreeTerms}</p>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center py-3.5 text-base
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none">
          {loading ? '⏳ Creating Account…' : 'Create My Account'}
        </button>
      </form>
    </AuthShell>
  )
}

function Field({
  label, id, error, optional = false, children,
}: {
  label: string; id: string; error?: string; optional?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id}
        className="flex items-center gap-1.5 font-heading font-semibold text-[0.82rem] text-[#0f1f28] mb-1.5">
        {label}
        {optional && <span className="text-[0.72rem] font-body text-gray-400 font-normal">(optional)</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs font-body mt-1">{error}</p>}
    </div>
  )
}

function inputCls(hasError: boolean) {
  return `w-full border-2 rounded-xl px-4 py-3 font-body text-sm text-[#0f1f28]
          outline-none transition-colors bg-white
          ${hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-brand-teal'}`
}

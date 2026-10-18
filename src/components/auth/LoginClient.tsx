'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import AuthShell from './AuthShell'

interface FormState { email: string; password: string }
interface Errors    { email?: string; password?: string; general?: string }

export default function LoginClient() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/'
  const errorParam   = searchParams.get('error')

  const [form, setForm]       = useState<FormState>({ email: '', password: '' })
  const [errors, setErrors]   = useState<Errors>({})
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate(): boolean {
    const e: Errors = {}
    if (!/\S+@\S+\.\S+/.test(form.email.trim())) e.email    = 'Enter a valid email address'
    if (form.password.length < 6)                 e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    setErrors({})

    const result = await signIn('credentials', {
      email:    form.email.trim().toLowerCase(),
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setErrors({ general: 'Incorrect email or password. Please try again.' })
      return
    }

    setSuccess(true)
    router.push(callbackUrl)
    router.refresh()
  }

  function field(
    id: keyof FormState,
    label: string,
    type: string,
    placeholder: string,
    right?: React.ReactNode,
  ) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={id} className="font-heading font-semibold text-[0.82rem] text-[#0f1f28]">
            {label}
          </label>
          {right}
        </div>
        <div className="relative">
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={form[id]}
            autoComplete={id === 'email' ? 'email' : 'current-password'}
            onChange={e => { setForm(f => ({ ...f, [id]: e.target.value })); setErrors(er => ({ ...er, [id]: undefined })) }}
            className={`w-full border-2 rounded-xl px-4 py-3 font-body text-sm text-[#0f1f28]
                        outline-none transition-colors bg-white pr-${id === 'password' ? '12' : '4'}
                        ${errors[id] ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-brand-teal'}`}
          />
          {id === 'password' && (
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-teal
                         transition-colors text-sm font-heading font-semibold select-none">
              {showPw ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
        {errors[id] && <p className="text-red-400 text-xs font-body mt-1">{errors[id]}</p>}
      </div>
    )
  }

  if (success) {
    return (
      <AuthShell
        title="Welcome back!"
        subtitle="You are now logged in."
        footerText="Not your account?"
        footerLinkLabel="Log out"
        footerLinkHref="/auth/login">
        <div className="text-center py-6">
          <p className="text-5xl mb-4">🎉</p>
          <p className="font-body text-sm text-[#3d5a65] mb-6">
            Logged in as <span className="font-semibold text-[#0f1f28]">{form.email}</span>
          </p>
          <Link href="/" className="btn-primary w-full justify-center py-3">
            Go to Home
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Welcome back 👋"
      subtitle="Login to your Totolands account"
      footerText="Don't have an account?"
      footerLinkLabel="Sign up free"
      footerLinkHref="/auth/signup">

      {(errors.general || errorParam === 'AdminOnly') && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          <p className="font-body text-sm text-red-500">
            {errorParam === 'AdminOnly'
              ? 'Admin access only. Please login with an admin account.'
              : errors.general}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {field('email', 'Email Address', 'email', 'you@example.com')}
        {field(
          'password', 'Password',
          showPw ? 'text' : 'password',
          '••••••••',
          <Link href="/auth/forgot-password"
            className="text-xs font-body text-brand-teal hover:text-brand-teal-dark transition-colors">
            Forgot password?
          </Link>,
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3.5 text-base mt-2
                     disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none">
          {loading ? '⏳ Logging in…' : 'Login to My Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="font-body text-xs text-gray-400">or continue with</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Google placeholder */}
      <button
        type="button"
        disabled
        className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl
                   px-4 py-3 font-heading font-semibold text-sm text-[#3d5a65]
                   hover:border-brand-teal/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.7 0 6.7 5.4 2.7 13.3l7.9 6.1C12.5 13 17.8 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9C43.8 37.5 46.5 31.4 46.5 24.5z"/>
          <path fill="#FBBC05" d="M10.6 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6l-7.9-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.7l8-6.1z"/>
          <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.6-5.9c-2 1.4-4.6 2.2-7.6 2.2-6.2 0-11.5-4.2-13.4-9.8l-8 6.1C6.7 42.6 14.7 48 24 48z"/>
        </svg>
        Continue with Google
        <span className="text-[0.65rem] font-body text-gray-400 ml-1">(coming soon)</span>
      </button>
    </AuthShell>
  )
}

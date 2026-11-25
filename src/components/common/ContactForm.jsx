import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react'
import { useContent } from '../../content/ContentProvider'
import { cn } from '../../lib/utils/cn'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Collaboration enquiry form.
 * Submissions are inserted into Supabase `inquiries` when configured, which
 * requires no server-side API. In Local Studio mode they are stored in this
 * browser only, and the form says so explicitly.
 */
export function ContactForm({ subjects = [], formNote, formTitle }) {
  const { submitInquiry, mode } = useContent()
  const [values, setValues] = useState({
    name: '',
    email: '',
    organisation: '',
    subject: subjects[0]?.value || subjects[0] || 'Research collaboration',
    message: '',
    website: '', // honeypot
  })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle')
  const [submitError, setSubmitError] = useState('')

  const options = (subjects || []).map((s) => (typeof s === 'string' ? s : s.value)).filter(Boolean)

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const next = {}
    if (values.name.trim().length < 2) next.name = 'Please enter your name.'
    if (!EMAIL_RE.test(values.email.trim())) next.email = 'Please enter a valid email address.'
    if (values.message.trim().length < 20) next.message = 'Please provide at least 20 characters of detail.'
    if (!values.subject) next.subject = 'Please choose a subject.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (values.website) return // silently drop bots
    if (!validate()) return
    setState('sending')
    setSubmitError('')
    try {
      await submitInquiry({
        name: values.name.trim(),
        email: values.email.trim(),
        organisation: values.organisation.trim(),
        subject: values.subject,
        message: values.message.trim(),
        source: 'website',
      })
      setState('sent')
    } catch (err) {
      setState('idle')
      setSubmitError(err.message || 'Your enquiry could not be sent. Please try again.')
    }
  }

  if (state === 'sent') {
    return (
      <div className="flex h-full min-h-[22rem] flex-col items-start justify-center rounded-xl border border-brand-teal/30 bg-brand-teal/[0.04] p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-teal/40 bg-white">
          <CheckCircle2 className="h-5 w-5 text-[#0c7c6f]" strokeWidth={1.8} />
        </span>
        <h3 className="display-sm mt-5 text-ink">Enquiry recorded.</h3>
        <p className="mt-2 max-w-sm text-[0.88rem] leading-relaxed text-ink-soft">
          {mode === 'local'
            ? 'This build is running in Local Studio mode, so your message has been stored in this browser only. Connect a Supabase project to receive enquiries centrally.'
            : 'Thank you — your message has reached the team. We aim to respond to research enquiries within five working days.'}
        </p>
        <button
          type="button"
          onClick={() => {
            setValues({ ...values, message: '' })
            setState('idle')
          }}
          className="mt-6 text-[0.8rem] font-medium text-brand-cyan link-underline"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-hairline bg-white p-6 md:p-8" noValidate>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="display-sm text-ink">{formTitle || 'Collaboration enquiry'}</h3>
          {formNote ? (
            <p className="mt-2 max-w-md text-[0.8rem] leading-relaxed text-ink-muted">{formNote}</p>
          ) : null}
        </div>
        <Send className="mt-1 h-4 w-4 shrink-0 text-ink-muted/40" strokeWidth={1.6} />
      </div>

      {mode === 'local' ? (
        <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/[0.05] px-3.5 py-2.5">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" strokeWidth={1.8} />
          <p className="text-[0.72rem] leading-relaxed text-amber-900/80">
            Local Studio mode: enquiries are saved in this browser only. Configure Supabase to
            collect submissions centrally.
          </p>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          <input
            className={cn('admin-input', errors.name && 'border-red-400')}
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
          />
        </Field>

        <Field label="Email" required error={errors.email}>
          <input
            type="email"
            className={cn('admin-input', errors.email && 'border-red-400')}
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field label="Organisation">
          <input
            className="admin-input"
            value={values.organisation}
            onChange={(e) => update('organisation', e.target.value)}
            autoComplete="organization"
          />
        </Field>

        <Field label="Subject" required error={errors.subject}>
          <select
            className={cn('admin-input', errors.subject && 'border-red-400')}
            value={values.subject}
            onChange={(e) => update('subject', e.target.value)}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Message" required error={errors.message}>
          <textarea
            rows={5}
            className={cn('admin-input resize-y', errors.message && 'border-red-400')}
            value={values.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder="Describe your enquiry, your affiliation and how you would like to contribute."
            aria-invalid={Boolean(errors.message)}
          />
        </Field>
      </div>

      {/* honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0"
        value={values.website}
        onChange={(e) => update('website', e.target.value)}
      />

      {submitError ? (
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[0.78rem] text-red-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
          {submitError}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-xs text-[0.68rem] leading-relaxed text-ink-muted/70">
          By sending an enquiry you consent to the team contacting you about your message.
        </p>
        <button
          type="submit"
          disabled={state === 'sending'}
          className="btn btn-primary disabled:opacity-60"
        >
          {state === 'sending' ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
              Sending
            </>
          ) : (
            <>
              Send enquiry
              <Send className="h-3.5 w-3.5" strokeWidth={1.8} />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="admin-label">
        {label}
        {required ? <span className="ml-0.5 text-brand-cyan">*</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1 block text-[0.7rem] text-red-600">{error}</span> : null}
    </label>
  )
}

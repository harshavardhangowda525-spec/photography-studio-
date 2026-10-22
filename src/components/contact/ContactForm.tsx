import { AnimatePresence, m } from 'motion/react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { links } from '../../config/business'
import { enquiryTypes } from '../../content/site'
import {
  composeEnquiryMessage,
  emptyEnquiry,
  requiredFields,
  validateEnquiry,
  type Enquiry,
  type EnquiryErrors,
} from '../../lib/enquiry'
import { ease } from '../../motion/presets'
import { Button } from '../ui/Button'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'opened'; url: string }
  | { kind: 'blocked'; url: string }

const COOLDOWN_MS = 4000

/**
 * Enquiry form delivered through WhatsApp (no server, no stored data, no API keys).
 * On submit we validate, compose the message and open WhatsApp with it prefilled.
 * We can't know whether the visitor then presses Send, so the confirmation says exactly that —
 * it never claims the enquiry was received.
 */
export function ContactForm({ initialType = '' }: { initialType?: string }) {
  const [values, setValues] = useState<Enquiry>({ ...emptyEnquiry, type: enquiryTypes.includes(initialType) ? initialType : '' })
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Enquiry, boolean>>>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [coolingDown, setCoolingDown] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    if (!coolingDown) return
    const t = window.setTimeout(() => setCoolingDown(false), COOLDOWN_MS)
    return () => window.clearTimeout(t)
  }, [coolingDown])

  const update = (field: keyof Enquiry) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const next = { ...values, [field]: e.target.value }
    setValues(next)
    if (touched[field] || errors[field]) setErrors((prev) => ({ ...prev, [field]: validateEnquiry(next)[field] }))
    if (status.kind !== 'idle' && status.kind !== 'submitting') setStatus({ kind: 'idle' })
  }

  const blur = (field: keyof Enquiry) => () => {
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validateEnquiry(values)[field] }))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (status.kind === 'submitting' || coolingDown) return // guard against double submits

    const found = validateEnquiry(values)
    setErrors(found)
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])))
    const invalid = Object.keys(found) as (keyof Enquiry)[]
    if (invalid.length) {
      setShowSummary(true)
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>(`[name="${invalid[0]}"]`)?.focus()
      })
      return
    }
    setShowSummary(false)
    setStatus({ kind: 'submitting' })
    setCoolingDown(true)

    const url = links.whatsapp(composeEnquiryMessage(values))
    // Must run synchronously inside the submit gesture or browsers treat it as a pop-up.
    const win = window.open(url, '_blank')
    if (win) {
      win.opener = null
      setStatus({ kind: 'opened', url })
    } else {
      setStatus({ kind: 'blocked', url })
    }
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  const reset = () => {
    setValues(emptyEnquiry)
    setErrors({})
    setTouched({})
    setStatus({ kind: 'idle' })
    setShowSummary(false)
  }

  const errorCount = Object.values(errors).filter(Boolean).length
  const busy = status.kind === 'submitting' || coolingDown

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby="form-note" className="relative">
      <AnimatePresence>
        {showSummary && errorCount > 0 && (
          <m.div
            ref={summaryRef}
            role="alert"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-10 flex items-start gap-3 border-l-2 border-[#d98b7a] bg-[#d98b7a]/[0.07] px-5 py-4 text-sm text-ivory"
          >
            <AlertCircle size={18} strokeWidth={1.5} aria-hidden="true" className="mt-0.5 shrink-0 text-[#e3a597]" />
            <span>
              Please check {errorCount === 1 ? 'one field' : `${errorCount} fields`} below before sending your enquiry.
            </span>
          </m.div>
        )}
      </AnimatePresence>

      <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
        <Field label="Full name" name="name" error={touched.name ? errors.name : undefined} required>
          {(p) => <input {...p} type="text" autoComplete="name" value={values.name} onChange={update('name')} onBlur={blur('name')} className="field" />}
        </Field>
        <Field label="Phone number" name="phone" error={touched.phone ? errors.phone : undefined} required>
          {(p) => (
            <input
              {...p}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+91"
              value={values.phone}
              onChange={update('phone')}
              onBlur={blur('phone')}
              className="field"
            />
          )}
        </Field>
        <Field label="Email address" name="email" error={touched.email ? errors.email : undefined} hint="Optional">
          {(p) => <input {...p} type="email" autoComplete="email" inputMode="email" value={values.email} onChange={update('email')} onBlur={blur('email')} className="field" />}
        </Field>
        <Field label="Type of photography or videography" name="type" error={touched.type ? errors.type : undefined} required>
          {(p) => (
            <select {...p} value={values.type} onChange={update('type')} onBlur={blur('type')} className="field cursor-pointer appearance-none bg-[length:12px] bg-[right_0.25rem_center] bg-no-repeat bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2012%2012%22%3E%3Cpath%20d=%22M2%204l4%204%204-4%22%20fill=%22none%22%20stroke=%22%23C7A878%22/%3E%3C/svg%3E')] pr-8">
              <option value="" disabled>
                Choose one
              </option>
              {enquiryTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Event date" name="date" error={touched.date ? errors.date : undefined} required>
          {(p) => <input {...p} type="date" value={values.date} onChange={update('date')} onBlur={blur('date')} className="field [color-scheme:dark]" />}
        </Field>
        <Field label="Event location" name="location" error={touched.location ? errors.location : undefined} required>
          {(p) => (
            <input
              {...p}
              type="text"
              autoComplete="address-level2"
              placeholder="Venue or area, e.g. Jayanagar"
              value={values.location}
              onChange={update('location')}
              onBlur={blur('location')}
              className="field"
            />
          )}
        </Field>
        <Field label="Estimated budget" name="budget" hint="Optional" error={undefined}>
          {(p) => <input {...p} type="text" placeholder="e.g. ₹25,000 – ₹40,000" value={values.budget} onChange={update('budget')} className="field" />}
        </Field>
        <div className="hidden md:block" aria-hidden="true" />
        <div className="md:col-span-2">
          <Field label="Additional details" name="details" hint="Optional" error={touched.details ? errors.details : undefined}>
            {(p) => (
              <textarea
                {...p}
                rows={4}
                maxLength={2000}
                placeholder="Timings, number of guests, the moments that matter most to you…"
                value={values.details}
                onChange={update('details')}
                onBlur={blur('details')}
                className="field resize-y"
              />
            )}
          </Field>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center">
        <Button
          type="submit"
          disabled={busy}
          aria-disabled={busy}
          icon={
            status.kind === 'submitting' ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <WhatsAppIcon size={16} />
            )
          }
        >
          {status.kind === 'submitting' ? 'Opening WhatsApp…' : coolingDown ? 'WhatsApp opened' : 'Send your enquiry'}
        </Button>
        <p id="form-note" className="max-w-sm text-xs leading-relaxed text-mute">
          Your enquiry opens in WhatsApp, ready to send to the studio. Fields marked <span className="text-gold">*</span> are
          required. Nothing is stored on this website.
        </p>
      </div>

      {/* Outcome — announced to assistive tech, and honest about what has (and hasn't) happened */}
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        <AnimatePresence mode="wait">
          {status.kind === 'opened' && (
            <StatusPanel key="opened" tone="success">
              <p className="font-serif text-2xl text-ivory">Your message is ready in WhatsApp.</p>
              <p className="mt-2 text-sm leading-relaxed text-stone/80">
                Press <strong className="font-semibold text-ivory">Send</strong> in WhatsApp to deliver it to the studio —
                it hasn&rsquo;t been sent until you do. WhatsApp didn&rsquo;t open?{' '}
                <a href={status.url} target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4">
                  Open it here
                </a>{' '}
                or call{' '}
                <a href={links.tel} className="text-gold underline underline-offset-4">
                  +91 85498 88399
                </a>
                .
              </p>
              <button type="button" onClick={reset} className="mt-4 min-h-11 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-mute hover:text-ivory">
                Start a new enquiry
              </button>
            </StatusPanel>
          )}
          {status.kind === 'blocked' && (
            <StatusPanel key="blocked" tone="error">
              <p className="font-serif text-2xl text-ivory">WhatsApp couldn&rsquo;t open automatically.</p>
              <p className="mt-2 text-sm leading-relaxed text-stone/80">
                Your browser blocked the new window, so nothing has been sent yet. Your details are still here.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                <a
                  href={status.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 bg-gold px-5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ink"
                >
                  <WhatsAppIcon size={16} /> Open WhatsApp
                </a>
                <a
                  href={links.tel}
                  className="inline-flex min-h-11 items-center border border-line px-5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ivory"
                >
                  Call the studio
                </a>
              </div>
            </StatusPanel>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}

function StatusPanel({ tone, children }: { tone: 'success' | 'error'; children: ReactNode }) {
  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.cinema } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      className={`mt-10 flex gap-4 border-l-2 px-5 py-5 ${
        tone === 'success' ? 'border-gold bg-gold/[0.06]' : 'border-[#d98b7a] bg-[#d98b7a]/[0.07]'
      }`}
    >
      <Icon size={20} strokeWidth={1.5} aria-hidden="true" className={`mt-1 shrink-0 ${tone === 'success' ? 'text-gold' : 'text-[#e3a597]'}`} />
      <div>{children}</div>
    </m.div>
  )
}

interface FieldRenderProps {
  id: string
  name: string
  required?: boolean
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
}: {
  label: string
  name: keyof Enquiry
  error: string | undefined
  hint?: string
  required?: boolean
  children: (props: FieldRenderProps) => ReactNode
}) {
  const id = useId()
  const errorId = `${id}-error`
  const isRequired = required ?? requiredFields.includes(name)
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-stone/80">
        <span>
          {label}
          {isRequired && (
            <span className="ml-1 text-gold" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {hint && <span className="font-medium normal-case tracking-normal text-mute/80">{hint}</span>}
      </label>
      {children({
        id,
        name,
        required: isRequired,
        'aria-required': isRequired || undefined,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': error ? errorId : undefined,
      })}
      <AnimatePresence initial={false}>
        {error && (
          <m.p
            id={errorId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-2 text-xs text-[#e3a597]"
          >
            {error}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}

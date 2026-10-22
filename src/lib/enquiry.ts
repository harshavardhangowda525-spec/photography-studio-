import { business } from '../config/business'

export interface Enquiry {
  name: string
  phone: string
  email: string
  type: string
  date: string
  location: string
  budget: string
  details: string
}

export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>

export const emptyEnquiry: Enquiry = {
  name: '',
  phone: '',
  email: '',
  type: '',
  date: '',
  location: '',
  budget: '',
  details: '',
}

export const requiredFields: (keyof Enquiry)[] = ['name', 'phone', 'type', 'date', 'location']

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Indian mobile/landline (10 digits, optional +91/0) or any international number in E.164 range. */
export function isValidPhone(raw: string) {
  const v = raw.replace(/[\s\-().]/g, '')
  if (/^(?:\+?91|0)?[1-9]\d{9}$/.test(v)) return true // mobiles and landlines with STD code, e.g. 080…
  return /^\+(?!91)\d{7,15}$/.test(v)
}

const todayISO = () => {
  const d = new Date()
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tz).toISOString().slice(0, 10)
}

export function validateEnquiry(e: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {}
  if (e.name.trim().length < 2) errors.name = 'Please enter your full name.'
  if (!e.phone.trim()) errors.phone = 'Please enter a phone number we can reach you on.'
  else if (!isValidPhone(e.phone)) errors.phone = 'Please enter a valid phone number, e.g. +91 98765 43210.'
  if (e.email.trim() && !EMAIL.test(e.email.trim())) errors.email = 'Please enter a valid email address.'
  if (!e.type) errors.type = 'Please choose the type of coverage you need.'
  if (!e.date) errors.date = 'Please choose your event date (an approximate date is fine).'
  else if (e.date < todayISO()) errors.date = 'The event date can’t be in the past.'
  if (e.location.trim().length < 2) errors.location = 'Please tell us where the event will take place.'
  if (e.details.length > 2000) errors.details = 'Please keep additional details under 2,000 characters.'
  return errors
}

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Composes the WhatsApp message sent to the studio. */
export function composeEnquiryMessage(e: Enquiry) {
  const fields = [
    `Name: ${e.name.trim()}`,
    `Phone: ${e.phone.trim()}`,
    e.email.trim() && `Email: ${e.email.trim()}`,
    `Looking for: ${e.type}`,
    `Event date: ${formatDate(e.date)}`,
    `Location: ${e.location.trim()}`,
    e.budget.trim() && `Estimated budget: ${e.budget.trim()}`,
  ].filter(Boolean)
  const details = e.details.trim() ? `\n\nDetails: ${e.details.trim()}` : ''
  return `${business.whatsappGreeting}\n\n${fields.join('\n')}${details}`
}

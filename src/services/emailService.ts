import emailjs from '@emailjs/browser'

export type ContactEmailPayload = {
  name: string
  email: string
  type?: string
  subject: string
  message: string
}

export function emailJsConfigured() {
  return Boolean(
    String(import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '').trim()
      && String(import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '').trim()
      && String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '').trim(),
  )
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const serviceId = String(import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '').trim()
  const templateId = String(import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '').trim()
  const publicKey = String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '').trim()

  if (!emailJsConfigured()) {
    throw new Error('EmailJS is not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.')
  }

  await emailjs.send(
    serviceId,
    templateId,
    {
      from_name: payload.name,
      from_email: payload.email,
      request_type: payload.type ?? 'general',
      subject: payload.subject,
      message: payload.message,
    },
    { publicKey },
  )
}

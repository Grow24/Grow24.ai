/**
 * Send email via the site's API (POST /api/send-email).
 * Uses VITE_SEND_EMAIL_ENDPOINT if set, otherwise same-origin /api/send-email
 * (proxied in dev to the send-email server).
 */

export interface SendEmailAttachment {
  filename: string
  content: string // base64
}

export interface SendEmailPayload {
  to: string | string[]
  cc?: string
  bcc?: string
  subject: string
  html: string
  text?: string
  attachments?: SendEmailAttachment[]
}

function getSendEmailEndpoint(): string {
  if (typeof window !== 'undefined' && (window as any).VITE_SEND_EMAIL_ENDPOINT) {
    return (window as any).VITE_SEND_EMAIL_ENDPOINT
  }
  const env = import.meta.env.VITE_SEND_EMAIL_ENDPOINT
  if (env) return env
  const api = import.meta.env.VITE_API_ENDPOINT || ''
  const base = api.replace(/\/api\/chat\/?$/, '').replace(/\/$/, '') || (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/api/send-email`
}

export async function sendEmail(payload: SendEmailPayload): Promise<{ success: boolean; message: string }> {
  const endpoint = getSendEmailEndpoint()
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({ message: 'Invalid response' }))
  if (!res.ok) {
    return { success: false, message: data.message || 'Failed to send email' }
  }
  return { success: true, message: data.message || 'Email sent successfully' }
}

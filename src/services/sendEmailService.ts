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
  let res: Response
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error'
    return {
      success: false,
      message: `Cannot reach the send-email server. Start it with: npm run server:email. (${msg})`,
    }
  }

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const text = await res.text().catch(() => '')
  let data: { success?: boolean; message?: string } = {}

  if (isJson && text) {
    try {
      data = JSON.parse(text) as { success?: boolean; message?: string }
    } catch {
      data = {}
    }
  }
  if (!isJson && text) {
    try {
      data = JSON.parse(text) as { success?: boolean; message?: string }
    } catch {
      data = {}
    }
  }

  if (res.status === 502 || res.status === 503 || res.status === 504 || res.status === 0) {
    return {
      success: false,
      message: 'Send-email server is not running. Start it in a separate terminal: npm run server:email',
    }
  }

  if (!res.ok) {
    const serverMessage = data.message?.trim()
    return {
      success: false,
      message:
        serverMessage ||
        (text && text.length < 200 ? text : `Server returned ${res.status} ${res.statusText}.`) ||
        'Failed to send email',
    }
  }
  return { success: true, message: data.message || 'Email sent successfully' }
}

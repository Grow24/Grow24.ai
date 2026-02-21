/**
 * Send email via the site's API (POST /api/send-email).
 * Uses the same backend as chat/leads so Contact Us → Create Email Template → Send email works.
 * Override with VITE_SEND_EMAIL_ENDPOINT if you use a separate send-email server.
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
  // Use same backend as chat/leads (PBMP_CHAT_API_ENDPOINT or VITE_API_ENDPOINT)
  const chatEndpoint =
    typeof window !== 'undefined' && (window as any).PBMP_CHAT_API_ENDPOINT
      ? (window as any).PBMP_CHAT_API_ENDPOINT
      : import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api/chat'
  const base = chatEndpoint.replace(/\/api\/chat\/?$/, '').replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '')
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
      message: `Cannot reach the backend. (${msg})`,
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
      message: 'Cannot reach the backend. Check that your API server is running and CORS allows this origin.',
    }
  }

  if (res.status === 404) {
    return {
      success: false,
      message:
        'Send-email is not enabled on this server. Add POST /api/send-email to your backend (see server/ADD_SEND_EMAIL_TO_BACKEND.js).',
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

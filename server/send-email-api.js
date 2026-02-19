/**
 * Send Email API – POST /api/send-email
 * Supports:
 *   - SendGrid: set SENDGRID_API_KEY (and optionally FROM_EMAIL). Same as main backend.
 *   - Generic SMTP: set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally SMTP_PORT, SMTP_SECURE, FROM_EMAIL).
 * Optional: PORT=3001
 * Loads .env from project root when present.
 */
import http from 'http'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (!m) continue
      let val = m[2].trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      const commentIdx = val.indexOf('#')
      if (commentIdx !== -1) val = val.slice(0, commentIdx).trim()
      process.env[m[1]] = val
    }
    return true
  } catch {
    return false
  }
}

// Load .env from project root (server/..) then from cwd
if (!loadEnv(resolve(__dirname, '..', '.env'))) {
  loadEnv(resolve(process.cwd(), '.env'))
}

const PORT = parseInt(process.env.PORT || '3001', 10)

function getTransport() {
  // Prefer SendGrid if API key is set (same config as main Express backend)
  if (process.env.SENDGRID_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    })
  }
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) {
    throw new Error(
      'Email not configured. Add SENDGRID_API_KEY=your_sendgrid_key to a .env file in the project root (same folder as package.json), then restart: npm run server:email'
    )
  }
  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  })
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        resolve(raw ? JSON.parse(raw) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function sendJson(res, status, data, origin) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...corsHeaders(origin || '*') })
  res.end(JSON.stringify(data))
}

function getPathname(url) {
  if (!url) return ''
  const q = url.indexOf('?')
  return q === -1 ? url : url.slice(0, q)
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(origin))
    res.end()
    return
  }

  if (req.method !== 'POST' || getPathname(req.url) !== '/api/send-email') {
    sendJson(res, 404, { success: false, message: 'Not found' }, origin)
    return
  }

  try {
    let body
    try {
      body = await parseBody(req)
    } catch {
      sendJson(res, 400, { success: false, message: 'Invalid JSON body' }, origin)
      return
    }

    const { to, cc, bcc, subject, html, text, attachments: rawAttachments } = body

    const toList = Array.isArray(to) ? to : (typeof to === 'string' && to ? to.split(',').map((e) => e.trim()).filter(Boolean) : [])
    if (!toList.length) {
      sendJson(res, 400, { success: false, message: 'At least one "to" recipient is required' }, origin)
      return
    }

    if (!subject || typeof subject !== 'string') {
      sendJson(res, 400, { success: false, message: 'Subject is required' }, origin)
      return
    }

    const attachments = []
    if (Array.isArray(rawAttachments)) {
      for (const a of rawAttachments) {
        if (a && typeof a.filename === 'string' && a.content != null) {
          attachments.push({
            filename: a.filename,
            content: Buffer.from(a.content, 'base64'),
          })
        }
      }
    }

    let transport
    try {
      transport = getTransport()
    } catch (err) {
      sendJson(res, 500, { success: false, message: err.message || 'SMTP not configured' }, origin)
      return
    }

    const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@grow24.ai'

    const mailOptions = {
      from,
      to: toList,
      subject,
      html: html || undefined,
      text: text || undefined,
      attachments: attachments.length ? attachments : undefined,
    }
    if (cc && (Array.isArray(cc) ? cc.length : String(cc).trim())) {
      mailOptions.cc = Array.isArray(cc) ? cc : String(cc).split(',').map((e) => e.trim()).filter(Boolean)
    }
    if (bcc && (Array.isArray(bcc) ? bcc.length : String(bcc).trim())) {
      mailOptions.bcc = Array.isArray(bcc) ? bcc : String(bcc).split(',').map((e) => e.trim()).filter(Boolean)
    }

    await transport.sendMail(mailOptions)
    sendJson(res, 200, { success: true, message: 'Email sent successfully' }, origin)
  } catch (err) {
    console.error('Send-email error:', err)
    sendJson(res, 500, {
      success: false,
      message: err.message || 'Failed to send email',
    }, origin)
  }
})

server.listen(PORT, () => {
  const hasSendGrid = !!process.env.SENDGRID_API_KEY
  const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  const using = hasSendGrid ? 'SendGrid' : hasSmtp ? 'SMTP' : 'none'
  console.log(`Send-email API listening on http://localhost:${PORT} (POST /api/send-email) [${using}]`)
  if (using === 'none') {
    console.log('⚠️  Add SENDGRID_API_KEY=your_key to .env in the project root, then restart.')
  }
})

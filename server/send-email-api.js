/**
 * Send Email API – POST /api/send-email
 * Uses nodemailer. Configure via env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL.
 * Optional: SMTP_SECURE=true, PORT=3001
 */
import http from 'http'
import nodemailer from 'nodemailer'

const PORT = parseInt(process.env.PORT || '3001', 10)

function getTransport() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) {
    throw new Error('Missing SMTP config: set SMTP_HOST, SMTP_USER, SMTP_PASS (and optionally SMTP_PORT, SMTP_SECURE, FROM_EMAIL)')
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

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...corsHeaders(res.getHeader('Origin') || '*') })
  res.end(JSON.stringify(data))
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(origin))
    res.end()
    return
  }

  if (req.method !== 'POST' || req.url !== '/api/send-email') {
    sendJson(res, 404, { success: false, message: 'Not found' })
    return
  }

  let body
  try {
    body = await parseBody(req)
  } catch {
    sendJson(res, 400, { success: false, message: 'Invalid JSON body' })
    return
  }

  const { to, cc, bcc, subject, html, text, attachments: rawAttachments } = body

  const toList = Array.isArray(to) ? to : (typeof to === 'string' && to ? to.split(',').map((e) => e.trim()).filter(Boolean) : [])
  if (!toList.length) {
    sendJson(res, 400, { success: false, message: 'At least one "to" recipient is required' })
    return
  }

  if (!subject || typeof subject !== 'string') {
    sendJson(res, 400, { success: false, message: 'Subject is required' })
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
    sendJson(res, 500, { success: false, message: err.message || 'SMTP not configured' })
    return
  }

  const from = process.env.FROM_EMAIL || process.env.SMTP_USER

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

  try {
    await transport.sendMail(mailOptions)
    sendJson(res, 200, { success: true, message: 'Email sent successfully' })
  } catch (err) {
    sendJson(res, 500, { success: false, message: err.message || 'Failed to send email' })
  }
})

server.listen(PORT, () => {
  console.log(`Send-email API listening on http://localhost:${PORT} (POST /api/send-email)`)
})

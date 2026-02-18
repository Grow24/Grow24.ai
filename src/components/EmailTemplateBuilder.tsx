import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendEmail, type SendEmailAttachment } from '../services/sendEmailService'

export interface EmailAttachment {
  file: File
  id: string
}

export interface EmailButton {
  id: string
  label: string
  url: string
}

export interface EmailTemplateState {
  to: string
  cc: string
  bcc: string
  subject: string
  bodyHtml: string
  bodyPlain: string
  attachments: EmailAttachment[]
  audioFile: File | null
  audioUrl: string
  videoFile: File | null
  videoUrl: string
  buttons: EmailButton[]
}

const defaultTemplate: EmailTemplateState = {
  to: '',
  cc: '',
  bcc: '',
  subject: '',
  bodyHtml: '<p>Write your message here. Use the toolbar for formatting.</p>',
  bodyPlain: 'Write your message here.',
  attachments: [],
  audioFile: null,
  audioUrl: '',
  videoFile: null,
  videoUrl: '',
  buttons: [],
}

function stripHtml(html: string): string {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return (tmp.textContent || tmp.innerText || '').trim()
}

export default function EmailTemplateBuilder({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [template, setTemplate] = useState<EmailTemplateState>(defaultTemplate)
  const [bodyMode, setBodyMode] = useState<'visual' | 'html'>('visual')
  const [activeTab, setActiveTab] = useState<'compose' | 'preview'>('compose')
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const update = (updates: Partial<EmailTemplateState>) => {
    setTemplate((t) => ({ ...t, ...updates }))
  }

  const addAttachment = (files: FileList | null) => {
    if (!files?.length) return
    const newAttachments: EmailAttachment[] = Array.from(files).map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }))
    setTemplate((t) => ({
      ...t,
      attachments: [...t.attachments, ...newAttachments],
    }))
  }

  const removeAttachment = (id: string) => {
    setTemplate((t) => ({ ...t, attachments: t.attachments.filter((a) => a.id !== id) }))
  }

  const addButton = () => {
    const newBtn: EmailButton = {
      id: `btn-${Date.now()}`,
      label: 'Button',
      url: 'https://',
    }
    setTemplate((t) => ({ ...t, buttons: [...t.buttons, newBtn] }))
  }

  const updateButton = (id: string, field: 'label' | 'url', value: string) => {
    setTemplate((t) => ({
      ...t,
      buttons: t.buttons.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
    }))
  }

  const removeButton = (id: string) => {
    setTemplate((t) => ({ ...t, buttons: t.buttons.filter((b) => b.id !== id) }))
  }

  const insertButtonHtml = (btn: EmailButton) => {
    const html = `<a href="${btn.url}" style="display:inline-block;padding:12px 24px;background:#0d9488;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">${btn.label}</a>`
    setTemplate((t) => ({ ...t, bodyHtml: t.bodyHtml + html }))
  }

  const buildFullHtml = (opts?: { forSend?: boolean }): string => {
    let html = template.bodyHtml
    const forSend = opts?.forSend
    if (template.audioUrl || (template.audioFile && !forSend)) {
      const src = template.audioUrl || (template.audioFile ? '[[AUDIO_PLACEHOLDER]]' : '')
      if (!forSend || template.audioUrl)
        html += `<p><strong>Audio:</strong></p><audio controls src="${src}">Your browser does not support audio.</audio>`
      else if (forSend && template.audioFile)
        html += `<p><strong>Audio:</strong> See attached file "${template.audioFile.name}".</p>`
    }
    if (template.videoUrl || (template.videoFile && !forSend)) {
      const src = template.videoUrl || (template.videoFile ? '[[VIDEO_PLACEHOLDER]]' : '')
      if (!forSend || template.videoUrl)
        html += `<p><strong>Video:</strong></p><video controls width="400" src="${src}">Your browser does not support video.</video>`
      else if (forSend && template.videoFile)
        html += `<p><strong>Video:</strong> See attached file "${template.videoFile.name}".</p>`
    }
    if (template.buttons.length > 0) {
      html += '<p style="margin-top:16px;">'
      template.buttons.forEach((b) => {
        html += `<a href="${b.url}" style="display:inline-block;margin-right:8px;padding:12px 24px;background:#0d9488;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">${b.label}</a>`
      })
      html += '</p>'
    }
    return html
  }

  const handleSendMailto = () => {
    const plain = template.bodyPlain || stripHtml(template.bodyHtml)
    const to = encodeURIComponent(template.to.trim())
    const subj = encodeURIComponent(template.subject)
    const body = encodeURIComponent(plain)
    const mailto = `mailto:${to || '?'}${template.subject ? `?subject=${subj}` : ''}${plain ? `&body=${body}` : ''}`
    window.location.href = mailto
    if (template.attachments.length > 0) {
      setTimeout(() => {
        alert(
          `This email has ${template.attachments.length} attachment(s). Your email client opened with subject and body; please attach the files manually (they are listed in the template).`
        )
      }, 300)
    }
  }

  const copyHtmlToClipboard = () => {
    const full = buildFullHtml()
    navigator.clipboard.writeText(full)
    alert('HTML body copied to clipboard. Paste it into your email client (e.g. Gmail “Insert” or Outlook).')
  }

  const copyFullToClipboard = () => {
    const full = `Subject: ${template.subject}\n\n${template.bodyPlain || stripHtml(template.bodyHtml)}`
    navigator.clipboard.writeText(full)
    alert('Subject and plain text body copied to clipboard.')
  }

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.includes(',') ? result.split(',')[1] : result
        resolve(base64 || '')
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleSendDirectly = async () => {
    const toList = template.to.trim().split(',').map((e) => e.trim()).filter(Boolean)
    if (!toList.length) {
      setSendStatus({ type: 'error', message: 'Please enter at least one recipient (To).' })
      return
    }
    if (!template.subject.trim()) {
      setSendStatus({ type: 'error', message: 'Please enter a subject.' })
      return
    }
    setSendStatus(null)
    setIsSending(true)
    try {
      const attachments: SendEmailAttachment[] = []
      for (const a of template.attachments) {
        attachments.push({ filename: a.file.name, content: await fileToBase64(a.file) })
      }
      if (template.audioFile) {
        attachments.push({ filename: template.audioFile.name, content: await fileToBase64(template.audioFile) })
      }
      if (template.videoFile) {
        attachments.push({ filename: template.videoFile.name, content: await fileToBase64(template.videoFile) })
      }
      const result = await sendEmail({
        to: toList,
        cc: template.cc.trim() || undefined,
        bcc: template.bcc.trim() || undefined,
        subject: template.subject.trim(),
        html: buildFullHtml({ forSend: true }),
        text: template.bodyPlain || stripHtml(template.bodyHtml),
        attachments: attachments.length ? attachments : undefined,
      })
      if (result.success) {
        setSendStatus({ type: 'success', message: result.message })
      } else {
        setSendStatus({ type: 'error', message: result.message })
      }
    } catch (err) {
      setSendStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to send email. Is the send-email server running?',
      })
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create email template</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs: Compose | Preview */}
          <div className="flex border-b border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('compose')}
              className={`px-6 py-3 font-medium ${activeTab === 'compose' ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Compose
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 font-medium ${activeTab === 'preview' ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Preview
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'compose' ? (
              <div className="space-y-6">
                {/* To, CC, BCC */}
                <div className="grid gap-3">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    To (recipients, comma-separated)
                  </label>
                  <input
                    type="text"
                    value={template.to}
                    onChange={(e) => update({ to: e.target.value })}
                    placeholder="email@example.com, another@example.com"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">CC</label>
                      <input
                        type="text"
                        value={template.cc}
                        onChange={(e) => update({ cc: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">BCC</label>
                      <input
                        type="text"
                        value={template.bcc}
                        onChange={(e) => update({ bcc: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={template.subject}
                    onChange={(e) => update({ subject: e.target.value })}
                    placeholder="Email subject"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Body: Visual / HTML */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Body (HTML formatting)</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setBodyMode('visual')}
                        className={`px-3 py-1 rounded text-sm ${bodyMode === 'visual' ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300' : 'bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
                      >
                        Visual
                      </button>
                      <button
                        type="button"
                        onClick={() => setBodyMode('html')}
                        className={`px-3 py-1 rounded text-sm ${bodyMode === 'html' ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300' : 'bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
                      >
                        HTML
                      </button>
                    </div>
                  </div>
                  {bodyMode === 'visual' ? (
                    <textarea
                      value={template.bodyHtml}
                      onChange={(e) => {
                        update({ bodyHtml: e.target.value })
                        update({ bodyPlain: stripHtml(e.target.value) })
                      }}
                      rows={10}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
                      placeholder="HTML content (e.g. <p>Hello</p>)"
                    />
                  ) : (
                    <textarea
                      value={template.bodyHtml}
                      onChange={(e) => {
                        update({ bodyHtml: e.target.value })
                        update({ bodyPlain: stripHtml(e.target.value) })
                      }}
                      rows={10}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm"
                      placeholder="HTML content"
                    />
                  )}
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Use HTML tags for formatting: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;a href="..."&gt;, etc.
                  </p>
                </div>

                {/* Buttons (CTA) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Buttons (CTA)</label>
                    <button
                      type="button"
                      onClick={addButton}
                      className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                    >
                      + Add button
                    </button>
                  </div>
                  <div className="space-y-2">
                    {template.buttons.map((btn) => (
                      <div
                        key={btn.id}
                        className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600"
                      >
                        <input
                          type="text"
                          value={btn.label}
                          onChange={(e) => updateButton(btn.id, 'label', e.target.value)}
                          placeholder="Button label"
                          className="flex-1 min-w-[100px] px-3 py-1.5 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                        />
                        <input
                          type="url"
                          value={btn.url}
                          onChange={(e) => updateButton(btn.id, 'url', e.target.value)}
                          placeholder="https://..."
                          className="flex-1 min-w-[120px] px-3 py-1.5 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => insertButtonHtml(btn)}
                          className="px-3 py-1.5 rounded bg-teal-500 text-white text-sm hover:bg-teal-600"
                        >
                          Insert into body
                        </button>
                        <button
                          type="button"
                          onClick={() => removeButton(btn.id)}
                          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                          aria-label="Remove button"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Attachments</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      addAttachment(e.target.files)
                      e.target.value = ''
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium"
                  >
                    + Add files
                  </button>
                  {template.attachments.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {template.attachments.map((a) => (
                        <li key={a.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span className="truncate">{a.file.name}</span>
                          <span className="text-slate-400">({(a.file.size / 1024).toFixed(1)} KB)</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(a.id)}
                            className="text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Audio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Audio</label>
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) update({ audioFile: f, audioUrl: '' })
                      e.target.value = ''
                    }}
                  />
                  <div className="flex flex-wrap gap-3 items-center">
                    <button
                      type="button"
                      onClick={() => audioInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-teal-500 text-sm"
                    >
                      Upload audio
                    </button>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">or</span>
                    <input
                      type="url"
                      value={template.audioUrl}
                      onChange={(e) => update({ audioUrl: e.target.value, audioFile: null })}
                      placeholder="Audio URL"
                      className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                  {(template.audioFile || template.audioUrl) && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {template.audioFile ? template.audioFile.name : 'URL will be embedded in email body.'}
                    </p>
                  )}
                </div>

                {/* Video */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Video</label>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) update({ videoFile: f, videoUrl: '' })
                      e.target.value = ''
                    }}
                  />
                  <div className="flex flex-wrap gap-3 items-center">
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-teal-500 text-sm"
                    >
                      Upload video
                    </button>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">or</span>
                    <input
                      type="url"
                      value={template.videoUrl}
                      onChange={(e) => update({ videoUrl: e.target.value, videoFile: null })}
                      placeholder="Video URL"
                      className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                  {(template.videoFile || template.videoUrl) && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {template.videoFile ? template.videoFile.name : 'URL will be embedded in email body.'}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Preview tab */
              <div className="rounded-lg border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 p-6">
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-slate-600">
                  <p className="text-sm text-slate-500 dark:text-slate-400">To: {template.to || '(not set)'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Subject: {template.subject || '(no subject)'}</p>
                </div>
                <div
                  className="prose dark:prose-invert max-w-none email-preview"
                  dangerouslySetInnerHTML={{ __html: buildFullHtml() }}
                />
                {template.attachments.length > 0 && (
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    Attachments ({template.attachments.length}): {template.attachments.map((a) => a.file.name).join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Send status */}
          {sendStatus && (
            <div
              className={`mx-6 mt-2 px-4 py-2 rounded-lg text-sm ${
                sendStatus.type === 'success'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
              }`}
            >
              {sendStatus.message}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex flex-wrap items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
            <button
              type="button"
              onClick={copyFullToClipboard}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 text-sm font-medium"
            >
              Copy subject + body (plain)
            </button>
            <button
              type="button"
              onClick={copyHtmlToClipboard}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 text-sm font-medium"
            >
              Copy HTML body
            </button>
            <button
              type="button"
              onClick={handleSendMailto}
              className="px-6 py-2.5 rounded-lg border border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 font-semibold"
            >
              Open in email client (mailto)
            </button>
            <button
              type="button"
              onClick={handleSendDirectly}
              disabled={isSending}
              className="px-6 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending…' : 'Send email'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

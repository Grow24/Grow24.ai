export type ChatVoiceState =
  | 'need_permission'
  | 'idle'
  | 'wake'
  | 'listen'
  | 'send'
  | 'error'

type SpeechRec = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: {
    resultIndex: number
    results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>
  }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  abort: () => void
  stop: () => void
}

export function getSpeechRecognitionCtor(): (new () => SpeechRec) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRec
    webkitSpeechRecognition?: new () => SpeechRec
  }
  return w.SpeechRecognition || w.webkitSpeechRecognition || null
}

export function normalizeTranscript(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function hasWakeWord(text: string): boolean {
  const t = normalizeTranscript(text)
  if (!t) return false
  if (/\bhey\s*pbmp\b/.test(t)) return true
  if (/\bhey\s*p\s*b\s*m\s*p\b/.test(t)) return true
  if (/\bhey\s*pbm\s*p\b/.test(t)) return true
  if (/\bhay\s*pbmp\b/.test(t)) return true
  return /\bhey\b/.test(t) && /\bpbmp\b/.test(t)
}

export function stripWakeWord(text: string): string {
  return text
    .replace(/^(hey|hay)\s*(p\s*b\s*m\s*p|pbmp|pbm\s*p)\b[,.]?\s*/i, '')
    .trim()
}

export function speak(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve()
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    utterance.pitch = 1
    utterance.onend = () => resolve()
    utterance.onerror = () => resolve()
    window.speechSynthesis.speak(utterance)
  })
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

export type { SpeechRec }

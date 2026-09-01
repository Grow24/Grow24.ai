import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getSpeechRecognitionCtor,
  hasWakeWord,
  speak,
  stopSpeaking,
  stripWakeWord,
  type ChatVoiceState,
  type SpeechRec,
} from './voiceChat'

const COMMAND_LISTEN_MS = 7000

type Options = {
  /** Chat panel is open. Voice is forced off when this is false. */
  active: boolean
  /** Do not start a new wake cycle (sending / booking). */
  paused: boolean
  onCommand: (text: string) => Promise<string | void>
}

export function useChatbotVoice({ active, paused, onCommand }: Options) {
  const [state, setState] = useState<ChatVoiceState>('need_permission')
  const [statusText, setStatusText] = useState('Tap Enable Voice, then say “Hey PBMP”.')
  const [error, setError] = useState('')
  const [interimCommand, setInterimCommand] = useState('')

  const recognitionRef = useRef<SpeechRec | null>(null)
  const listenTimerRef = useRef<number | null>(null)
  const armedRef = useRef(false)
  const busyRef = useRef(false)
  const stateRef = useRef<ChatVoiceState>('need_permission')
  const pausedRef = useRef(paused)
  const startWakeRef = useRef<() => void>(() => undefined)
  const handleWakeRef = useRef<() => Promise<void>>(async () => undefined)
  const onCommandRef = useRef(onCommand)

  onCommandRef.current = onCommand
  pausedRef.current = paused

  useEffect(() => {
    stateRef.current = state
  }, [state])

  const stopRecognition = useCallback(() => {
    const rec = recognitionRef.current
    if (!rec) return
    rec.onresult = null
    rec.onerror = null
    rec.onend = null
    try {
      rec.abort()
    } catch {
      /* ignore */
    }
    recognitionRef.current = null
  }, [])

  const startWakeListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor || !armedRef.current || busyRef.current || pausedRef.current) return

    stopRecognition()
    const rec = new Ctor()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-IN'

    rec.onresult = (event) => {
      if (busyRef.current || pausedRef.current || stateRef.current !== 'idle') return
      let combined = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        combined += ` ${event.results[i][0].transcript}`
      }
      if (hasWakeWord(combined)) {
        void handleWakeRef.current()
      }
    }

    rec.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return
      if (event.error === 'not-allowed') {
        armedRef.current = false
        setState('need_permission')
        setError('Microphone permission denied.')
        setStatusText('Allow the microphone, then tap Enable Voice again.')
      }
    }

    rec.onend = () => {
      if (armedRef.current && !busyRef.current && !pausedRef.current && stateRef.current === 'idle') {
        try {
          rec.start()
        } catch {
          window.setTimeout(() => startWakeRef.current(), 400)
        }
      }
    }

    recognitionRef.current = rec
    try {
      rec.start()
    } catch {
      window.setTimeout(() => startWakeRef.current(), 400)
    }
  }, [stopRecognition])

  useEffect(() => {
    startWakeRef.current = startWakeListening
  }, [startWakeListening])

  const listenForCommand = useCallback(async (): Promise<string> => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) return ''

    stopRecognition()
    setState('listen')
    setStatusText('Speak your question…')
    setInterimCommand('')

    let collected = ''
    const rec = new Ctor()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-IN'

    rec.onresult = (event) => {
      let chunk = ''
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        chunk += ` ${event.results[i][0].transcript}`
      }
      collected = `${collected} ${chunk}`.replace(/\s+/g, ' ').trim()
      setInterimCommand(collected)
    }

    rec.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return
    }

    recognitionRef.current = rec
    try {
      rec.start()
    } catch {
      return ''
    }

    await new Promise<void>((resolve) => {
      listenTimerRef.current = window.setTimeout(() => resolve(), COMMAND_LISTEN_MS)
    })

    try {
      rec.stop()
    } catch {
      try {
        rec.abort()
      } catch {
        /* ignore */
      }
    }
    recognitionRef.current = null
    if (listenTimerRef.current) {
      window.clearTimeout(listenTimerRef.current)
      listenTimerRef.current = null
    }

    return stripWakeWord(collected)
      .replace(/yes[,]?\s*i['’]?m\s+listening[.!]*/gi, '')
      .trim()
  }, [stopRecognition])

  const resumeWake = useCallback(() => {
    if (!armedRef.current) return
    busyRef.current = false
    setInterimCommand('')
    setState('idle')
    setStatusText('Listening for “Hey PBMP”')
    window.setTimeout(() => startWakeRef.current(), 400)
  }, [])

  const handleWake = useCallback(async () => {
    if (busyRef.current || pausedRef.current) return
    busyRef.current = true
    stopRecognition()
    setState('wake')
    setStatusText("Yes, I'm listening")
    setError('')
    await speak("Yes, I'm listening")
    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), 500)
    })

    const command = await listenForCommand()
    if (!armedRef.current) {
      busyRef.current = false
      return
    }

    if (!command || command.length < 2) {
      setState('error')
      setStatusText("I didn't catch that. Say Hey PBMP and try again.")
      await speak("I didn't catch that. Say Hey PBMP and try again.")
      resumeWake()
      return
    }

    setState('send')
    setStatusText('Sending to Grow24 assistant…')
    try {
      const reply = await onCommandRef.current(command)
      if (reply && typeof reply === 'string' && reply.trim()) {
        await speak(reply.replace(/\[DIAGRAM_PROMPT:\w+\]/g, '').trim())
      }
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Could not send your question.')
      setStatusText('Could not send your question.')
    }
    resumeWake()
  }, [listenForCommand, resumeWake, stopRecognition])

  useEffect(() => {
    handleWakeRef.current = handleWake
  }, [handleWake])

  const enableVoice = useCallback(async () => {
    setError('')
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setState('error')
      setError('This browser has no speech recognition. Use Chrome or Edge.')
      setStatusText('Voice wake-word needs Chrome or Edge.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      armedRef.current = true
      setState('idle')
      setStatusText('Listening for “Hey PBMP”')
      startWakeListening()
    } catch {
      armedRef.current = false
      setState('need_permission')
      setError('Microphone access is required.')
      setStatusText('Allow the microphone, then tap Enable Voice.')
    }
  }, [startWakeListening])

  const disableVoice = useCallback(() => {
    armedRef.current = false
    busyRef.current = false
    stopRecognition()
    stopSpeaking()
    if (listenTimerRef.current) {
      window.clearTimeout(listenTimerRef.current)
      listenTimerRef.current = null
    }
    setInterimCommand('')
    setState('need_permission')
    setStatusText('Voice is off. Tap Enable Voice, then say “Hey PBMP”.')
  }, [stopRecognition])

  useEffect(() => {
    if (!active) {
      disableVoice()
    }
  }, [active, disableVoice])

  useEffect(() => {
    if (active && armedRef.current && !busyRef.current && !paused && state === 'idle') {
      startWakeListening()
    }
  }, [active, paused, startWakeListening, state])

  useEffect(() => {
    const onPageHide = () => disableVoice()
    window.addEventListener('pagehide', onPageHide)
    return () => window.removeEventListener('pagehide', onPageHide)
  }, [disableVoice])

  return {
    state,
    statusText,
    error,
    interimCommand,
    armed: state !== 'need_permission' && state !== 'error',
    supportsSpeech: typeof window !== 'undefined' && Boolean(getSpeechRecognitionCtor()),
    enableVoice,
    disableVoice,
    askNow: handleWake,
  }
}

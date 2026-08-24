import { createPortal } from 'react-dom'

const CONCEPT_YOUTUBE_ID = 'qorKBybGr_s'
const CONCEPT_YOUTUBE_EMBED = `https://www.youtube-nocookie.com/embed/${CONCEPT_YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`

export function ConceptVideoModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/80"
        aria-label="Close video"
        onClick={onClose}
      />
      <div className="relative z-[1] w-full max-w-5xl overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative aspect-video bg-black">
          <iframe
            title="Grow24.ai Concept"
            src={CONCEPT_YOUTUBE_EMBED}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ConceptVideoModal

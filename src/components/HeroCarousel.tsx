import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'

// Sample data (placeholder for future Library link) – library-style resource cards
const SAMPLE_SLIDES = [
  {
    title: 'Business Analysis Best Practices',
    subtitle: 'Apply industry-standard techniques from BABOK to define and deliver value.',
    category: 'Article',
  },
  {
    title: 'Project Management Frameworks',
    subtitle: 'From goal identification through execution—PMBOK-aligned templates and guides.',
    category: 'Template',
  },
  {
    title: 'Value Cycle Implementation Guide',
    subtitle: 'Step-by-step approach to personal and professional growth cycles.',
    category: 'White Paper',
  },
  {
    title: 'Lead-to-Cash Process Library',
    subtitle: 'Sales and delivery workflows with ready-made playbooks.',
    category: 'Case Study',
  },
  {
    title: 'Change Management Playbook',
    subtitle: 'Structured change management for business transformation.',
    category: 'Training',
  },
]

function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => emblaApi.off('select', onSelect)
  }, [emblaApi, onSelect])

  const handleLibraryClick = () => {
    const el = document.getElementById('library')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mb-6 sm:mb-8 px-2 sm:px-4"
    >
      <div
        className="overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-600/50 bg-gradient-to-br from-slate-50 to-emerald-50/40 dark:from-slate-800/80 dark:to-emerald-900/20 shadow-lg"
        ref={emblaRef}
      >
        <div className="flex touch-pan-y">
          {SAMPLE_SLIDES.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 cursor-pointer select-none"
              onClick={handleLibraryClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleLibraryClick()
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${slide.title} – go to Library`}
            >
              <div className="py-4 sm:py-5 px-5 sm:px-8 flex flex-col items-center justify-center text-center min-h-[100px] sm:min-h-[112px]">
                <span className="text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">
                  {slide.category}
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-0.5 line-clamp-2">
                  {slide.title}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {slide.subtitle}
                </p>
                <span className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 underline underline-offset-2">
                  Explore Library →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          type="button"
          onClick={scrollPrev}
          className="p-2 rounded-lg bg-slate-200/80 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500/50 transition-colors"
          aria-label="Previous slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex gap-1.5">
          {SAMPLE_SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === selectedIndex ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={scrollNext}
          className="p-2 rounded-lg bg-slate-200/80 dark:bg-slate-600/50 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500/50 transition-colors"
          aria-label="Next slide"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

export default HeroCarousel

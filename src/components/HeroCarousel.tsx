import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'

// 10 slides total; 5 visible at a time (BCG-style). Replace with your Library assets later.
const SAMPLE_SLIDES = [
  { image: 'https://picsum.photos/seed/hero1/800/500', title: 'Business Analysis' },
  { image: 'https://picsum.photos/seed/hero2/800/500', title: 'Project Management' },
  { image: 'https://picsum.photos/seed/hero3/800/500', title: 'Value Cycle' },
  { image: 'https://picsum.photos/seed/hero4/800/500', title: 'Lead-to-Cash' },
  { image: 'https://picsum.photos/seed/hero5/800/500', title: 'Change Management' },
  { image: 'https://picsum.photos/seed/hero6/800/500', title: 'Solutions' },
  { image: 'https://picsum.photos/seed/hero7/800/500', title: 'Strategy & Objectives' },
  { image: 'https://picsum.photos/seed/hero8/800/500', title: 'Execution & Operations' },
  { image: 'https://picsum.photos/seed/hero9/800/500', title: 'Transformation' },
  { image: 'https://picsum.photos/seed/hero10/800/500', title: 'Value Framework' },
]

const SLIDE_COUNT = SAMPLE_SLIDES.length

// BCG-style scale: among 5 visible – center largest, adjacent smaller, outer medium
function getScaleForPosition(index: number, selectedIndex: number): number {
  let offset = (index - selectedIndex) % SLIDE_COUNT
  if (offset > SLIDE_COUNT / 2) offset -= SLIDE_COUNT
  if (offset < -SLIDE_COUNT / 2) offset += SLIDE_COUNT
  const absOffset = Math.abs(offset)
  if (absOffset === 0) return 1.2   // center – largest
  if (absOffset === 1) return 0.88  // adjacent (2nd, 4th) – smaller
  if (absOffset === 2) return 0.96  // outer (1st, 5th) – medium
  return 0.82                       // off-screen (peek) – smaller
}

function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  // Auto-slide every 5s; pause on hover, resume 5s after mouse leave
  useEffect(() => {
    if (!emblaApi || isHovered) return
    const interval = setInterval(() => {
      scrollNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [emblaApi, isHovered, scrollNext])

  const handleLibraryClick = () => {
    const el = document.getElementById('library')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="w-full mx-auto mb-6 sm:mb-8"
    >
      <div className="relative">
        {/* Subtle prev/next – BCG-style edge arrows */}
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-md border border-slate-200/80 dark:border-slate-600/50 hover:bg-white dark:hover:bg-slate-700/90 disabled:opacity-40 disabled:pointer-events-none transition-all"
          aria-label="Previous"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-md border border-slate-200/80 dark:border-slate-600/50 hover:bg-white dark:hover:bg-slate-700/90 disabled:opacity-40 disabled:pointer-events-none transition-all"
          aria-label="Next"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* 10 slides total; 5 visible at a time. Center largest, adjacent smaller, outer medium (BCG). */}
        <div
          className="overflow-hidden w-full px-12 sm:px-14"
          ref={emblaRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex touch-pan-y"
            style={{ gap: '1.25vw' }}
          >
            {SAMPLE_SLIDES.map((slide, index) => {
              const scale = getScaleForPosition(index, selectedIndex)
              return (
                <div
                  key={index}
                  className="min-w-0 flex items-center justify-center shrink-0"
                  style={{ flexBasis: '19vw' }}
                >
                  <button
                    type="button"
                    onClick={handleLibraryClick}
                    className="w-full block rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-600/50 bg-slate-100 dark:bg-slate-800 shadow-sm hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 origin-center transition-transform duration-300 ease-out"
                    style={{
                      transform: `scale(${scale})`,
                    }}
                  >
                    <div className="relative aspect-[16/10] w-full bg-slate-200 dark:bg-slate-700">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 right-3 text-left text-sm font-semibold text-white drop-shadow-sm">
                        {slide.title}
                      </span>
                    </div>
                    <span className="block py-2.5 px-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 text-center">
                      Explore Library →
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Dots and nav below slider – active dot green, inactive light grey */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-slate-200/90 dark:bg-slate-600/80 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500/80 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm"
            aria-label="Previous slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Slider position">
            {SAMPLE_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Slide ${index + 1} of ${SAMPLE_SLIDES.length}`}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === selectedIndex
                    ? 'bg-emerald-500 dark:bg-emerald-400'
                    : 'bg-slate-300 dark:bg-slate-500 hover:bg-slate-400 dark:hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-slate-200/90 dark:bg-slate-600/80 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-500/80 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm"
            aria-label="Next slide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default HeroCarousel

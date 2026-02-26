import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'

const MOBILE_BREAKPOINT = 640

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches
      : false
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    const update = () => setIsMobile(mq.matches)
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return isMobile
}

// 10 slides total; 5 visible at a time (BCG-style). Replace with your Library assets later.
const SAMPLE_SLIDES = [
  { image: 'https://picsum.photos/seed/hero1/800/500', title: 'Business Analysis', description: 'Analyze and optimize your business processes and outcomes.' },
  { image: 'https://picsum.photos/seed/hero2/800/500', title: 'Project Management', description: 'Plan, execute, and deliver projects effectively.' },
  { image: 'https://picsum.photos/seed/hero3/800/500', title: 'Value Cycle', description: 'Understand and maximize your personal and professional value.' },
  { image: 'https://picsum.photos/seed/hero4/800/500', title: 'Lead-to-Cash', description: 'Streamline your pipeline from lead generation to revenue.' },
  { image: 'https://picsum.photos/seed/hero5/800/500', title: 'Change Management', description: 'Navigate and lead organizational transformation.' },
  { image: 'https://picsum.photos/seed/hero6/800/500', title: 'Solutions', description: 'Discover solutions tailored to your goals and context.' },
  { image: 'https://picsum.photos/seed/hero7/800/500', title: 'Strategy & Objectives', description: 'Define and align strategy with clear objectives.' },
  { image: 'https://picsum.photos/seed/hero8/800/500', title: 'Execution & Operations', description: 'Turn plans into results with effective execution.' },
  { image: 'https://picsum.photos/seed/hero9/800/500', title: 'Transformation', description: 'Drive sustainable change and growth.' },
  { image: 'https://picsum.photos/seed/hero10/800/500', title: 'Value Framework', description: 'A structured approach to creating and capturing value.' },
]

const SLIDE_COUNT = SAMPLE_SLIDES.length

// visibleCount: 3 on mobile, 5 on laptop
function getScaleForPosition(index: number, selectedIndex: number, visibleCount: number): number {
  let offset = (index - selectedIndex) % SLIDE_COUNT
  if (offset > SLIDE_COUNT / 2) offset -= SLIDE_COUNT
  if (offset < -SLIDE_COUNT / 2) offset += SLIDE_COUNT
  const absOffset = Math.abs(offset)
  if (visibleCount === 3) {
    if (absOffset === 0) return 1.15  // center – largest
    if (absOffset === 1) return 0.88   // left/right – slightly smaller
    return 0.78                        // off-screen
  }
  // 5 visible: center largest, adjacent smaller, extreme left/right larger again
  if (absOffset === 0) return 1.2   // center – largest
  if (absOffset === 1) return 0.82  // left/right of center – slightly smaller
  if (absOffset === 2) return 0.98  // extreme left/right – larger again
  return 0.78                       // off-screen (peek) – smaller
}

function HeroCarousel() {
  const isMobile = useIsMobile()
  const visibleCount = isMobile ? 3 : 5
  const slideBasis = isMobile ? '32%' : '18%'
  const slideGap = isMobile ? '2%' : '2.5%'

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
  const [hoveredSlideIndex, setHoveredSlideIndex] = useState<number | null>(null)

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

  // Reinit carousel when switching mobile ↔ desktop so slide sizes and snaps update
  useEffect(() => {
    emblaApi?.reInit()
  }, [emblaApi, visibleCount])

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
      className="w-full max-w-6xl mx-auto mb-6 sm:mb-8"
    >
      <div className="relative">
        {/* Prev/next arrows – smaller on mobile to save space */}
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-md border border-slate-200/80 dark:border-slate-600/50 hover:bg-white dark:hover:bg-slate-700/90 disabled:opacity-40 disabled:pointer-events-none transition-all"
          aria-label="Previous"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 shadow-md border border-slate-200/80 dark:border-slate-600/50 hover:bg-white dark:hover:bg-slate-700/90 disabled:opacity-40 disabled:pointer-events-none transition-all"
          aria-label="Next"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* 10 slides; 3 visible on mobile, 5 on laptop. Responsive padding. */}
        <div
          className="overflow-hidden w-full px-6 sm:px-12 md:px-14 @container"
          ref={emblaRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex touch-pan-y"
            style={{ gap: slideGap }}
          >
            {SAMPLE_SLIDES.map((slide, index) => {
              const scale = getScaleForPosition(index, selectedIndex, visibleCount)
              const isSlideHovered = hoveredSlideIndex === index
              return (
                <div
                  key={index}
                  className="min-w-0 flex items-center justify-center shrink-0"
                  style={{ flexBasis: slideBasis, minWidth: '0' }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={handleLibraryClick}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleLibraryClick()
                      }
                    }}
                    onMouseEnter={() => setHoveredSlideIndex(index)}
                    onMouseLeave={() => setHoveredSlideIndex(null)}
                    className="w-full block rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-600/50 bg-slate-100 dark:bg-slate-800 shadow-sm hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 origin-center transition-transform duration-300 ease-out text-left cursor-pointer"
                    style={{
                      transform: `scale(${scale})`,
                    }}
                  >
                    <div className="relative aspect-[2/3] w-full bg-slate-200 dark:bg-slate-700">
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
                      {/* Hover overlay: slides up from bottom and covers entire image (BCG-style) */}
                      <motion.div
                        className="absolute inset-0 z-10 bg-black/80 text-white p-4 flex flex-col justify-end"
                        initial={false}
                        animate={{
                          y: isSlideHovered ? 0 : '100%',
                        }}
                        transition={{ type: 'tween', duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ originY: 1 }}
                      >
                        <h3 className="text-sm font-semibold mb-1 line-clamp-2">{slide.title}</h3>
                        <p className="text-xs text-white/90 mb-3 line-clamp-2">{slide.description}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleLibraryClick()
                          }}
                          className="inline-flex items-center justify-center w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors cursor-pointer"
                        >
                          Learn More
                        </button>
                      </motion.div>
                    </div>
                    <span className="block py-2.5 px-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 text-center">
                      Explore Library →
                    </span>
                  </div>
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

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { useNavigate } from '@tanstack/react-router'

const MOBILE_BREAKPOINT = 768

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

const SAMPLE_SLIDES = [
  { image: '/white_mode.jpeg', title: 'Grow24 Overview', description: 'Personal & Professional management in one unified platform.' },
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

// Design intent (BCG-style): (1) Spacing and visual balance — generous, consistent gaps and margins so each block has presence. (2) Image sizes are intentionally uneven — center visually most prominent via relative scaling. To keep the center overlay and actions fully visible, the center slide is not scaled above 1; instead, surrounding slides are scaled down slightly.
// BCG-style: center visually most prominent, adjacent shorter, outer in between (staggered heights, uniform gaps)
function getScaleForPosition(index: number, selectedIndex: number, visibleCount: number): number {
  let offset = (index - selectedIndex) % SLIDE_COUNT
  if (offset > SLIDE_COUNT / 2) offset -= SLIDE_COUNT
  if (offset < -SLIDE_COUNT / 2) offset += SLIDE_COUNT
  const absOffset = Math.abs(offset)

  // Mobile: center slide at 1, others slightly smaller
  if (visibleCount === 1) {
    if (absOffset === 0) return 1
    return 0.9
  }

  // Desktop: keep center card at base size so the flipped overlay and
  // "Know More" button never get clipped by the viewport; emphasize it
  // by shrinking neighbors instead of enlarging the center.
  if (absOffset === 0) return 1      // center: base size
  if (absOffset === 1) return 0.9    // immediate neighbors
  if (absOffset === 2) return 0.86   // outer visible cards
  return 0.82
}

// BCG-like opacity: center full, sides slightly dimmed
function getOpacityForPosition(index: number, selectedIndex: number, visibleCount: number): number {
  if (visibleCount === 1) return index === selectedIndex ? 1 : 0.6
  let offset = (index - selectedIndex) % SLIDE_COUNT
  if (offset > SLIDE_COUNT / 2) offset -= SLIDE_COUNT
  if (offset < -SLIDE_COUNT / 2) offset += SLIDE_COUNT
  const absOffset = Math.abs(offset)
  if (absOffset === 0) return 1
  if (absOffset === 1) return 0.92
  if (absOffset === 2) return 0.82
  return 0.7
}

function HeroCarousel() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const visibleCount = isMobile ? 1 : 5
  const slideGapPx = isMobile ? 0 : 36
  // Laptop: equal spacing between all 5 visible slides — one source of truth for gap, 4 gaps between 5 slides
  const slideBasis = isMobile ? '100%' : `calc((100% - 4 * ${slideGapPx}px) / 5)`

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
  const [tappedSlideIndex, setTappedSlideIndex] = useState<number | null>(null)

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

  useEffect(() => {
    emblaApi?.reInit()
  }, [emblaApi, visibleCount])

  useEffect(() => {
    if (isMobile) setTappedSlideIndex(null)
  }, [isMobile, selectedIndex])

  useEffect(() => {
    if (!emblaApi || isHovered) return
    const interval = setInterval(() => scrollNext(), 5000)
    return () => clearInterval(interval)
  }, [emblaApi, isHovered, scrollNext])

  const handleLibraryClick = () => {
    const el = document.getElementById('library')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const showOverlay = (index: number) => {
    if (isMobile) return tappedSlideIndex === index
    return hoveredSlideIndex === index
  }

  const handleSlideClick = (index: number) => {
    if (isMobile) {
      if (index !== selectedIndex) {
        scrollTo(index)
        setTappedSlideIndex(null)
        return
      }
      setTappedSlideIndex((prev) => (prev === index ? null : index))
      return
    }
    handleLibraryClick()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className={`relative w-full ${isMobile ? 'mb-0' : 'mb-20 sm:mb-24 md:mb-28'}`}
    >
      <div className="md:flex md:flex-wrap md:items-start md:gap-x-3">
        {/* Arrows: on laptop (md+) align with WhatsApp/social (left) and chatbot (right) columns; on mobile use inset position */}
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="absolute left-3 sm:left-4 md:left-6 md:-ml-[109px] top-6 md:top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] border border-slate-200/60 dark:border-slate-600/50 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="absolute right-3 sm:right-4 md:right-6 md:-mr-[100px] top-6 md:top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] border border-slate-200/60 dark:border-slate-600/50 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div
          className="overflow-hidden w-full md:flex-1 md:min-w-0"
          ref={emblaRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex touch-pan-y select-none"
            style={{
              // Laptop: single source of truth for equal spacing between all 5 visible slides
              ['--carousel-gap' as string]: isMobile ? undefined : `${slideGapPx}px`,
              gap: isMobile ? 0 : 'var(--carousel-gap)',
              marginLeft: isMobile ? 0 : undefined,
            }}
          >
            {SAMPLE_SLIDES.map((slide, index) => {
              const scale = getScaleForPosition(index, selectedIndex, visibleCount)
              const opacity = getOpacityForPosition(index, selectedIndex, visibleCount)
              const isOverlayVisible = showOverlay(index)
              return (
                <div
                  key={index}
                  className="flex items-center justify-center flex-shrink-0 flex-grow-0 box-border overflow-hidden"
                  style={{
                    width: slideBasis,
                    minWidth: slideBasis,
                    maxWidth: slideBasis,
                    flexBasis: slideBasis,
                  }}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSlideClick(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSlideClick(index)
                      }
                    }}
                    onMouseEnter={() => setHoveredSlideIndex(index)}
                    onMouseLeave={() => setHoveredSlideIndex(null)}
                    className="w-full block rounded-lg overflow-hidden border border-slate-200/70 dark:border-slate-600/50 bg-slate-100 dark:bg-slate-800 shadow-sm hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 origin-center transition-all duration-300 ease-out text-left cursor-pointer"
                    style={{
                      transform: `scale(${scale})`,
                      opacity,
                    }}
                  >
              <div
                className={`relative w-full ${
                  isMobile
                    ? 'aspect-[16/9] min-h-[18vh]'
                    : 'aspect-[4/5] min-h-[40vh] md:min-h-[44vh]'
                } bg-slate-200 dark:bg-slate-700`}
              >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <span className="absolute bottom-3 left-3 right-3 text-left text-sm sm:text-base font-semibold text-white drop-shadow-md">
                        {slide.title}
                      </span>
                      <motion.div
                        className="absolute inset-0 z-10 bg-slate-900/95 text-white p-4 sm:p-5 flex flex-col justify-end"
                        initial={false}
                        animate={{
                          y: isOverlayVisible ? 0 : '100%',
                        }}
                        transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ originY: 1 }}
                      >
                        <h3 className="text-sm sm:text-base font-semibold mb-1.5 line-clamp-2">{slide.title}</h3>
                        <p className="text-xs sm:text-sm text-white/90 mb-4 line-clamp-2">{slide.description}</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              // For the /white_mode.jpeg slide, open the Value Definition page.
                              // For all other slides, keep the existing behavior (scroll to library).
                              if (slide.image === '/white_mode.jpeg') {
                                navigate({ to: '/value-definition' })
                              } else {
                                handleLibraryClick()
                              }
                            }}
                            className="inline-flex items-center justify-center flex-1 sm:flex-none w-full sm:w-auto py-2.5 px-4 rounded-md bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            Know More
                          </button>
                          {isMobile && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setTappedSlideIndex(null)
                              }}
                              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer touch-manipulation"
                              aria-label="Close"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <path d="M18 6L6 18M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* BCG-style dots + nav below: prev/next squares, dots in middle */}
        <div className="flex w-full items-center justify-center gap-4 sm:gap-6 mt-3 sm:mt-4">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-colors border border-slate-200/60 dark:border-slate-600/50"
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2" role="tablist" aria-label="Slider position">
            {SAMPLE_SLIDES.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollTo(index)}
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Slide ${index + 1} of ${SAMPLE_SLIDES.length}`}
                className={`rounded-full transition-all duration-200 ${
                  index === selectedIndex
                    ? 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-slate-800 dark:bg-slate-200'
                    : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-300 dark:bg-slate-500 hover:bg-slate-400 dark:hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 disabled:pointer-events-none transition-colors border border-slate-200/60 dark:border-slate-600/50"
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default HeroCarousel

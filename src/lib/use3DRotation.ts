import { useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface Use3DRotationOptions {
  intensity?: number // Rotation intensity (default: 15 degrees)
  perspective?: number // CSS perspective value (default: 1000px)
  reduceMotion?: boolean // Respect prefers-reduced-motion
}

/**
 * Custom hook for 3D rotation effects based on mouse position
 * Returns motion values for rotateX, rotateY, and transform style
 */
export function use3DRotation(options: Use3DRotationOptions = {}) {
  const {
    intensity = 15,
    perspective = 1000,
    reduceMotion = false,
  } = options

  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth spring animations for rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 300,
    damping: 30,
  })

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || reduceMotion) return

      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      // Normalize to -0.5 to 0.5 range
      const normalizedX = mouseX / (rect.width / 2)
      const normalizedY = mouseY / (rect.height / 2)

      x.set(Math.max(-0.5, Math.min(0.5, normalizedX)))
      y.set(Math.max(-0.5, Math.min(0.5, normalizedY)))
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [x, y, reduceMotion])

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      x.set(0)
      y.set(0)
    }
  }, [x, y])

  return {
    cardRef,
    rotateX,
    rotateY,
    style: {
      perspective: `${perspective}px`,
      transformStyle: 'preserve-3d' as const,
    },
  }
}

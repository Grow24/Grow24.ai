import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense } from 'react'

// Organic mesh generator for calm, flowing aesthetics
function OrganicMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  useFrame((state) => {
    if (!meshRef.current) return
    
    timeRef.current += 0.0005
    meshRef.current.rotation.x += 0.0001
    meshRef.current.rotation.y += 0.0002
    meshRef.current.position.y = Math.sin(timeRef.current) * 0.5

    // Scale pulsing effect
    const scale = 1 + Math.sin(timeRef.current * 1.5) * 0.05
    meshRef.current.scale.set(scale, scale, scale)
  })

  // Generate organic geometry with emerald coloring
  const geometry = new THREE.IcosahedronGeometry(2, 6)
  const material = new THREE.MeshPhongMaterial({
    color: 0x10b981, // Emerald green
    emissive: 0x059669, // Darker emerald glow
    wireframe: false,
    shininess: 100,
    flatShading: false,
  })

  return <mesh ref={meshRef} geometry={geometry} material={material} />
}

// Particle field for atmospheric effect
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null)

  useEffect(() => {
    if (!particlesRef.current) return

    const geometry = new THREE.BufferGeometry()
    const particleCount = 500

    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20

      velocities[i * 3] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0x6ee7b7, // Light emerald
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    })

    particlesRef.current.geometry = geometry
    particlesRef.current.material = material

    // Animation loop for particles
    let animationId: number
    const animate = () => {
      const positions = geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i]
        positions[i + 1] += velocities[i + 1]
        positions[i + 2] += velocities[i + 2]

        // Wrap around boundaries
        if (Math.abs(positions[i]) > 10) velocities[i] *= -1
        if (Math.abs(positions[i + 1]) > 10) velocities[i + 1] *= -1
        if (Math.abs(positions[i + 2]) > 10) velocities[i + 2] *= -1
      }
      geometry.attributes.position.needsUpdate = true
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return <points ref={particlesRef} />
}

// Lighting setup
function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} color={0xffffff} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={0.8}
        color={0x10b981}
        castShadow
      />
      <pointLight position={[-5, -10, -7]} intensity={0.4} color={0x06b6d4} />
    </>
  )
}

// Camera controls for optimal positioning
function CameraController() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.z = 5
    camera.fov = 75
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

interface CalmBackgroundProps {
  className?: string
}

export const CalmBackground: React.FC<CalmBackgroundProps> = ({ className = '' }) => {
  const [hasWebGPU, setHasWebGPU] = React.useState(false)

  useEffect(() => {
    // Detect WebGPU support
    const checkWebGPU = async () => {
      if ('gpu' in navigator) {
        try {
          const adapter = await (navigator as any).gpu?.requestAdapter()
          setHasWebGPU(!!adapter)
        } catch {
          setHasWebGPU(false)
        }
      }
    }
    checkWebGPU()
  }, [])

  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <CameraController />
        <Lights />
        <Suspense fallback={null}>
          <OrganicMesh />
          <ParticleField />
        </Suspense>
      </Canvas>

      {/* Fallback gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 -z-20" />

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent -z-20" />
    </div>
  )
}

export default CalmBackground

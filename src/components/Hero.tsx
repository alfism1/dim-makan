import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import * as THREE from 'three'
import gsap from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParticleData {
  x: number
  y: number
  z: number
  vy: number
  phase: number
  swayAmp: number
  swayFreq: number
}

// ─── Steam particle cloud (runs inside <Canvas>) ──────────────────────────────

interface SteamCloudProps {
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
  reducedMotion: boolean
}

function SteamCloud({ mouseRef, reducedMotion }: SteamCloudProps) {
  const geoRef = useRef<THREE.BufferGeometry>(null)
  const pointsRef = useRef<THREE.Points>(null)

  const { count, positions, particles } = useMemo(() => {
    const count = window.innerWidth < 768 ? 80 : 200
    const positions = new Float32Array(count * 3)

    const particles: ParticleData[] = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 9,
      y: Math.random() * 12 - 6,
      z: (Math.random() - 0.5) * 3,
      vy: 0.12 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
      swayAmp: 0.006 + Math.random() * 0.014,
      swayFreq: 0.3 + Math.random() * 0.7,
    }))

    particles.forEach((p, i) => {
      positions[i * 3] = p.x
      positions[i * 3 + 1] = p.y
      positions[i * 3 + 2] = p.z
    })

    return { count, positions, particles }
  }, [])

  // Set geometry attribute imperatively — avoids R3F v9 attach string ambiguity
  useEffect(() => {
    if (!geoRef.current) return
    geoRef.current.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    )
    return () => {
      geoRef.current?.dispose()
    }
  }, [positions])

  useFrame((state, delta) => {
    if (reducedMotion || !pointsRef.current) return

    const pos = pointsRef.current.geometry.attributes.position
    if (!pos) return

    const attr = pos as THREE.BufferAttribute
    const t = state.clock.elapsedTime
    const mx = mouseRef.current.x
    const my = mouseRef.current.y
    const dt = Math.min(delta, 0.05) // cap delta so large tab-switch spikes don't teleport particles

    for (let i = 0; i < count; i++) {
      const p = particles[i]

      p.y += p.vy * dt
      p.x += Math.sin(t * p.swayFreq + p.phase) * p.swayAmp

      // Wrap at ceiling, respawn at floor with random x
      if (p.y > 6) {
        p.y = -6
        p.x = (Math.random() - 0.5) * 9
      }

      // Parallax: depth-scaled offset so near particles shift more
      const depthFactor = (p.z + 2) / 4 // 0.5–1.25 range
      attr.setXYZ(i, p.x + mx * 0.5 * depthFactor, p.y + my * 0.25 * depthFactor, p.z)
    }

    attr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef} />
      <pointsMaterial
        size={0.045}
        color="#FAF7F2"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

// ─── Magnetic CTA button ──────────────────────────────────────────────────────

interface MagneticButtonProps {
  children: React.ReactNode
  href: string
  variant: 'solid' | 'ghost'
  reducedMotion: boolean
}

function MagneticButton({ children, href, variant, reducedMotion }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 380, damping: 26, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 380, damping: 26, mass: 0.6 })

  const onMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const RADIUS = 80 // px from center to start attracting

    if (dist < RADIUS) {
      // Scale factor: 0 at edge → ~0.28 at button surface, capped so shift ≤ 20px
      const strength = Math.min((1 - dist / RADIUS) * 0.35, 20 / Math.max(dist, 1))
      x.set(dx * strength)
      y.set(dy * strength)
    }
  }

  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const cls = [
    'inline-flex items-center justify-center px-7 py-3.5 rounded-full',
    'font-body font-semibold text-sm tracking-wide cursor-pointer select-none',
    'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
    variant === 'solid'
      ? 'bg-red text-cream hover:bg-red-dark'
      : 'border border-cream/50 text-cream hover:bg-cream/10',
  ].join(' ')

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={reducedMotion ? undefined : { x: sx, y: sy }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cls}
    >
      {children}
    </motion.a>
  )
}

// ─── Hero section ─────────────────────────────────────────────────────────────

export default function Hero() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasWrapRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const btnsRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  // Convert raw pointer position → normalised −1…+1 coords for particle parallax
  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return
    const r = sectionRef.current.getBoundingClientRect()
    mouseRef.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
    mouseRef.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
  }

  const onMouseLeave = () => {
    mouseRef.current.x = 0
    mouseRef.current.y = 0
  }

  useLayoutEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.9,
          },
        })
        // Headline exits first — slides up and fades
        .to(headlineRef.current, { y: -70, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0)
        // Sub + buttons follow slightly behind
        .to(subRef.current, { y: -45, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0.08)
        .to(btnsRef.current, { y: -30, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.14)
        // Canvas fades out toward the end
        .to(canvasWrapRef.current, { opacity: 0, duration: 0.5 }, 0.45)
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen overflow-hidden bg-ink"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* R3F canvas — pointer-events: none so overlay buttons remain clickable */}
      <div
        ref={canvasWrapRef}
        className="absolute inset-0 z-0"
        style={{ pointerEvents: 'none' }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ alpha: true, antialias: false }}
          dpr={[1, 1.5]}
        >
          <SteamCloud mouseRef={mouseRef} reducedMotion={reducedMotion} />
        </Canvas>
      </div>

      {/* Bottom vignette — adds depth without blocking particles */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(26,26,26,0.75) 0%, transparent 50%)',
        }}
      />

      {/* Overlay content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          ref={headlineRef}
          className={[
            'font-display font-bold text-cream leading-[1.1] tracking-tight',
            'text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]',
          ].join(' ')}
        >
          Dimsum Tangan,
          <br />
          <span className="text-gold">Rasa Rumahan.</span>
        </h1>

        <p
          ref={subRef}
          className="mt-6 max-w-md font-body text-base text-cream/65 md:text-lg"
        >
          Dibuat satu per satu. Dikukus segar tiap hari. Diantar ke pintumu.
        </p>

        <div
          ref={btnsRef}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton
            href="https://wa.me/"
            variant="solid"
            reducedMotion={reducedMotion}
          >
            WhatsApp
          </MagneticButton>
          <MagneticButton
            href="https://gofood.co.id/"
            variant="ghost"
            reducedMotion={reducedMotion}
          >
            GoFood
          </MagneticButton>
          <MagneticButton
            href="https://grabfood.com/"
            variant="ghost"
            reducedMotion={reducedMotion}
          >
            GrabFood
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

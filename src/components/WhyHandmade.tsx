import { useLayoutEffect, useRef } from 'react'
import gsap from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ─── Background color interpolator ───────────────────────────────────────────
// Three-stop palette tied to scroll progress 0 → 0.5 → 1.
// gsap.utils.interpolate on hex strings handles RGB lerp natively.

const bgInterp = gsap.utils.interpolate(['#FAF7F2', '#D4A847', '#C0392B'])

// ─── Panel data ───────────────────────────────────────────────────────────────

interface Panel {
  id: string
  title: string
  copy: string
  bg: string
  textPrimary: string
  textSecondary: string
  accent: string
}

const PANELS: Panel[] = [
  {
    id: 'hands',
    title: 'Dibungkus Tangan',
    copy: 'Setiap dimsum dilipat dan dibungkus satu per satu oleh tangan kami. Tidak ada mesin press, tidak ada cetakan — hanya ketelitian yang tak bisa digantikan mesin manapun.',
    bg: '#FAF7F2',
    textPrimary: '#1A1A1A',
    textSecondary: 'rgba(26,26,26,0.55)',
    accent: '#C0392B',
  },
  {
    id: 'steamed',
    title: 'Dikukus Segar Tiap Hari',
    copy: 'Kami tidak pernah menyimpan dimsum yang sudah dikukus dari hari sebelumnya. Setiap pagi kukusan dinyalakan, dan dimsum segar tersaji dalam hitungan jam.',
    bg: '#D4A847',
    textPrimary: '#1A1A1A',
    textSecondary: 'rgba(26,26,26,0.6)',
    accent: '#8B2319',
  },
  {
    id: 'local',
    title: 'Bahan Lokal Pilihan',
    copy: 'Udang dari nelayan lokal, sayuran dari pasar pagi. Kami memilih bahan-bahan terbaik bukan karena murah — tapi karena itulah yang membuat rasanya jujur.',
    bg: '#C0392B',
    textPrimary: '#FAF7F2',
    textSecondary: 'rgba(250,247,242,0.65)',
    accent: '#D4A847',
  },
]

// ─── Large line-art icons (100×100 viewBox) ───────────────────────────────────

const ICON_BASE = {
  viewBox: '0 0 100 100',
  width: 100,
  height: 100,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

// Two cupped hands holding a folded dumpling above
function HandsIcon({ color }: { color: string }) {
  return (
    <svg {...ICON_BASE} stroke={color}>
      {/* Left hand: arc with three finger lines */}
      <path d="M 16 84 C 14 66 20 50 32 42 L 35 50 L 38 36 L 41 50 L 44 36 L 47 48" />
      <path d="M 16 84 C 18 76 24 72 36 72" />
      {/* Right hand: mirror */}
      <path d="M 84 84 C 86 66 80 50 68 42 L 65 50 L 62 36 L 59 50 L 56 36 L 53 48" />
      <path d="M 84 84 C 82 76 76 72 64 72" />
      {/* Connecting palm base */}
      <path d="M 36 72 C 36 78 64 78 64 72" />
      {/* Dumpling above the hands */}
      <path d="M 34 30 C 34 20 40 14 50 14 C 60 14 66 20 66 30 C 66 38 60 44 50 44 C 40 44 34 38 34 30 Z" />
      {/* Pleat fold on dumpling */}
      <path d="M 36 28 C 41 24 50 22 59 25 C 63 28 66 30" />
      {/* Three pleat marks */}
      <path d="M 42 25 L 41 34" />
      <path d="M 50 22 L 50 34" />
      <path d="M 58 25 L 59 34" />
    </svg>
  )
}

// Bamboo steamer tiers with steam wisps
function SteamerIcon({ color }: { color: string }) {
  return (
    <svg {...ICON_BASE} stroke={color}>
      {/* Steam wisps */}
      <path d="M 30 22 C 32 16 28 10 30 4" />
      <path d="M 50 20 C 52 14 48 8 50 2" />
      <path d="M 70 22 C 72 16 68 10 70 4" />
      {/* Lid */}
      <path d="M 22 38 C 22 32 34 28 50 28 C 66 28 78 32 78 38 C 78 44 66 48 50 48 C 34 48 22 44 22 38 Z" />
      {/* Lid knob */}
      <line x1="50" y1="28" x2="50" y2="24" />
      <circle cx="50" cy="22" r="3" />
      {/* Upper tier body */}
      <line x1="22" y1="38" x2="20" y2="54" />
      <line x1="78" y1="38" x2="80" y2="54" />
      <path d="M 20 54 C 20 60 34 64 50 64 C 66 64 80 60 80 54 C 80 48 66 44 50 44 C 34 44 20 48 20 54 Z" />
      {/* Lower tier body */}
      <line x1="20" y1="54" x2="16" y2="70" />
      <line x1="80" y1="54" x2="84" y2="70" />
      <path d="M 16 70 C 16 78 31 84 50 84 C 69 84 84 78 84 70 C 84 62 69 56 50 56 C 31 56 16 62 16 70 Z" />
      {/* Tier rim lines */}
      <path d="M 20 54 C 20 58 33 62 50 62 C 67 62 80 58 80 54" />
    </svg>
  )
}

// Stylised leaf with central spine and angled veins
function LeafIcon({ color }: { color: string }) {
  return (
    <svg {...ICON_BASE} stroke={color}>
      {/* Leaf outer shape */}
      <path d="M 50 8 C 76 18 90 44 84 68 C 78 86 60 94 50 94 C 40 94 22 86 16 68 C 10 44 24 18 50 8 Z" />
      {/* Central spine */}
      <line x1="50" y1="8" x2="50" y2="94" />
      {/* Left veins — three, at different heights */}
      <path d="M 50 34 L 28 52" />
      <path d="M 50 54 L 24 68" />
      <path d="M 50 72 L 32 82" />
      {/* Right veins — mirror */}
      <path d="M 50 34 L 72 52" />
      <path d="M 50 54 L 76 68" />
      <path d="M 50 72 L 68 82" />
      {/* Small bud at tip */}
      <circle cx="50" cy="8" r="4" />
    </svg>
  )
}

const PANEL_ICONS = [HandsIcon, SteamerIcon, LeafIcon] as const

// ─── Section ──────────────────────────────────────────────────────────────────

export default function WhyHandmade() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (reducedMotion || !section || !track) return

    const isDesktop = window.innerWidth >= 1024
    if (!isDesktop) return

    const ctx = gsap.context(() => {
      // scrollWidth = 3 panels × 100vw = 300vw; subtract viewport = 200vw travel
      const scrollDist = track.scrollWidth - window.innerWidth

      // Primary tween: slide the track leftward
      const tl = gsap.timeline()
      tl.to(track, { x: -scrollDist, ease: 'none' })

      ScrollTrigger.create({
        trigger: section,
        pin: true,
        pinSpacing: true,
        scrub: 1.2,
        start: 'top top',
        end: `+=${scrollDist}`,
        animation: tl,
        // Tie background color to the scrubbed animation progress —
        // this is what makes the transition "tied to scroll progress".
        onUpdate(self: ScrollTrigger) {
          section.style.backgroundColor = bgInterp(self.progress)
        },
      })
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="why-handmade"
      className="overflow-hidden"
      // Initial bg = Panel 1's color; GSAP onUpdate takes over once pinned
      style={{ backgroundColor: PANELS[0].bg }}
    >
      {/* ── Track: flex-row on desktop, flex-col on mobile ── */}
      <div
        ref={trackRef}
        className="flex flex-col lg:flex-row lg:h-screen"
      >
        {PANELS.map((panel, i) => {
          const Icon = PANEL_ICONS[i]

          return (
            <div
              key={panel.id}
              className="relative flex flex-col items-center justify-center min-h-screen lg:min-h-0 lg:h-screen lg:w-screen lg:flex-none px-8 py-20"
              style={{ backgroundColor: panel.bg }}
            >
              {/* Panel number — faint top-left label */}
              <span
                className="absolute top-8 left-10 font-body text-xs font-semibold tracking-[0.18em] uppercase select-none"
                style={{ color: panel.textSecondary }}
                aria-hidden="true"
              >
                0{i + 1} / 03
              </span>

              {/* Content block — max-width constrains the readable column */}
              <div className="max-w-lg text-center">
                {/* Icon */}
                <div className="flex justify-center mb-10">
                  <Icon color={panel.textPrimary} />
                </div>

                {/* Headline */}
                <h2
                  className="font-display text-4xl font-bold leading-tight mb-6 md:text-5xl lg:text-[3rem]"
                  style={{ color: panel.textPrimary }}
                >
                  {panel.title}
                </h2>

                {/* Copy */}
                <p
                  className="font-body text-lg leading-[1.75]"
                  style={{ color: panel.textSecondary }}
                >
                  {panel.copy}
                </p>

                {/* Accent rule */}
                <div
                  className="mx-auto mt-10 h-px w-12 rounded-full"
                  style={{ backgroundColor: panel.accent }}
                />
              </div>

              {/* Panel progress dots — desktop only, absolute bottom center */}
              <div
                className="hidden lg:flex absolute bottom-8 left-0 right-0 justify-center gap-2"
                aria-hidden="true"
              >
                {PANELS.map((_, dotIdx) => (
                  <div
                    key={dotIdx}
                    className="w-1.5 h-1.5 rounded-full transition-opacity"
                    style={{
                      backgroundColor: panel.textPrimary,
                      opacity: dotIdx === i ? 0.7 : 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

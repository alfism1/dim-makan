import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: string
  quote: string
  name: string
  area: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      '"Hakau-nya lembut banget, kulitnya tipis dan isinya penuh. Beda dari yang lain — ini beneran bikin kangen dan selalu jadi pilihan pertama tiap akhir pekan."',
    name: 'Siti Rahayu',
    area: 'Kebayoran Baru, Jakarta Selatan',
  },
  {
    id: 't2',
    quote:
      '"Saya pesan untuk arisan 30 orang dan semua tamu minta kontak Dim Makan sebelum pulang. Pelayanannya cepat, dimsum datang masih panas, dan rasanya konsisten setiap kali."',
    name: 'Dina Kusumawati',
    area: 'Pondok Indah, Jakarta Selatan',
  },
  {
    id: 't3',
    quote:
      '"Frozen dimsumnya praktis sekali untuk stok mingguan. Kukus 15 menit dari freezer, hasilnya seperti baru dibuat. Benar-benar worth every rupiah."',
    name: 'Rendra Pratama',
    area: 'BSD City, Tangerang Selatan',
  },
]

const AUTO_MS = 4000

// ─── Arrow icons ──────────────────────────────────────────────────────────────

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Testimonials() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const [current, setCurrent] = useState(0)
  const [resetKey, setResetKey] = useState(0)    // increments to restart the 4s timer
  const directionRef = useRef<1 | -1>(1)          // 1 = forward, -1 = backward

  // ── Slide variants — x offset respects reducedMotion ──────────────────────
  const slideVariants = {
    enter: (dir: number) => ({
      x: reducedMotion ? 0 : dir > 0 ? 72 : -72,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: reducedMotion ? 0 : dir > 0 ? -72 : 72,
      opacity: 0,
    }),
  }

  // ── Auto-advance (resets when resetKey changes) ────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      directionRef.current = 1
      setCurrent(c => (c + 1) % TESTIMONIALS.length)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [resetKey])                                   // resetKey dependency restarts the interval

  // ── Manual navigation ──────────────────────────────────────────────────────
  const goTo = (next: number, dir: 1 | -1) => {
    directionRef.current = dir
    setCurrent(next)
    setResetKey(k => k + 1)
  }

  const handlePrev = () =>
    goTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length, -1)

  const handleNext = () =>
    goTo((current + 1) % TESTIMONIALS.length, 1)

  // ── GSAP section fade-in on scroll ────────────────────────────────────────
  useLayoutEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 36,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    return () => ctx.revert()
  }, [reducedMotion])

  const t = TESTIMONIALS[current]

  return (
    <section
      ref={sectionRef}
      id="testimoni"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: '#F5F1EC' }}
    >
      {/* ── Decorative SVG quotation mark (0.06 opacity, deep red) ── */}
      <svg
        viewBox="0 0 200 160"
        width="260"
        height="208"
        aria-hidden="true"
        className="absolute -top-4 -left-4 md:top-0 md:left-0 pointer-events-none select-none"
        style={{ opacity: 0.06 }}
      >
        {/*
          Two comma-drop shapes forming a double opening curly quote.
          Each shape: a round head tapering into a curved tail.
        */}
        {/* Left comma */}
        <path
          d="M 28 20 C 44 20 56 34 56 52 C 56 70 44 82 28 82
             C 18 82 10 76 10 66 C 10 54 18 48 28 48
             C 34 48 38 52 36 58 C 34 64 26 66 22 62
             C 18 58 20 50 28 44
             C 36 38 44 44 44 52 C 44 60 36 66 28 66
             C 20 66 14 60 14 52 C 14 40 20 28 28 20 Z
             M 22 90 C 28 100 32 112 30 120 L 20 120 C 22 110 20 98 14 88 Z"
          fill="#C0392B"
        />
        {/* Right comma — shifted 70px right */}
        <path
          d="M 98 20 C 114 20 126 34 126 52 C 126 70 114 82 98 82
             C 88 82 80 76 80 66 C 80 54 88 48 98 48
             C 104 48 108 52 106 58 C 104 64 96 66 92 62
             C 88 58 90 50 98 44
             C 106 38 114 44 114 52 C 114 60 106 66 98 66
             C 90 66 84 60 84 52 C 84 40 90 28 98 20 Z
             M 92 90 C 98 100 102 112 100 120 L 90 120 C 92 110 90 98 84 88 Z"
          fill="#C0392B"
        />
      </svg>

      <div className="relative max-w-3xl mx-auto px-6 text-center">

        {/* Overline */}
        <p className="font-body text-[11px] font-semibold tracking-[0.22em] text-red uppercase mb-12">
          Testimoni
        </p>

        {/* Slide container — min-h prevents layout jump during mode="wait" transition */}
        <div className="relative min-h-[280px] md:min-h-[240px] flex flex-col items-center justify-center">
          <AnimatePresence custom={directionRef.current} mode="wait">
            <motion.div
              key={t.id}
              custom={directionRef.current}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-8"
            >
              {/* Quote text */}
              <blockquote>
                <p className="font-display italic text-ink text-xl leading-[1.65] md:text-2xl lg:text-[1.7rem]">
                  {t.quote}
                </p>
              </blockquote>

              {/* Attribution */}
              <div className="flex flex-col items-center gap-1">
                {/* Gold rule above name */}
                <div className="w-8 h-px bg-gold mb-3" />
                <p className="font-body font-semibold text-ink text-sm tracking-wide">
                  {t.name}
                </p>
                <p className="font-body text-xs text-ink/45 tracking-wide">
                  {t.area}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls: prev arrow — dots — next arrow */}
        <div className="flex items-center justify-center gap-5 mt-10">

          <button
            type="button"
            onClick={handlePrev}
            aria-label="Testimoni sebelumnya"
            className={[
              'w-10 h-10 rounded-full flex items-center justify-center',
              'border border-muted text-ink/50',
              'hover:border-ink/30 hover:text-ink hover:bg-ink/4',
              'transition-all duration-200',
            ].join(' ')}
          >
            <ChevronLeft />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-2" role="tablist" aria-label="Pilih testimoni">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`Testimoni ${i + 1}`}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                className={[
                  'h-2 rounded-full transition-all duration-300 ease-out',
                  i === current
                    ? 'w-6 bg-red'
                    : 'w-2 bg-ink/20 hover:bg-ink/40',
                ].join(' ')}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Testimoni berikutnya"
            className={[
              'w-10 h-10 rounded-full flex items-center justify-center',
              'border border-muted text-ink/50',
              'hover:border-ink/30 hover:text-ink hover:bg-ink/4',
              'transition-all duration-200',
            ].join(' ')}
          >
            <ChevronRight />
          </button>

        </div>
      </div>
    </section>
  )
}

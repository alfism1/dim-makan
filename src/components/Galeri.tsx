import { useLayoutEffect, useRef } from 'react'
import gsap from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface GalleryCell {
  id: string
  caption: string
  gradient: string
  height: 240 | 320
}

// Gradient palette rotates cream→gold→red with slight angle/stop variation per cell.
const CELLS: GalleryCell[] = [
  {
    id: 'g1',
    caption: 'Proses pelipatan hakau satu per satu',
    gradient: 'linear-gradient(138deg, #FAF7F2 0%, #E8D080 100%)',
    height: 240,
  },
  {
    id: 'g2',
    caption: 'Kulit tipis transparan yang sempurna',
    gradient: 'linear-gradient(150deg, #D4A847 0%, #C0392B 100%)',
    height: 320,
  },
  {
    id: 'g3',
    caption: 'Kukusan bambu di pagi hari',
    gradient: 'linear-gradient(128deg, #C0392B 0%, #8B2319 100%)',
    height: 240,
  },
  {
    id: 'g4',
    caption: 'Bahan-bahan segar dari pasar pagi',
    gradient: 'linear-gradient(162deg, #F5F1EC 0%, #DDB84A 85%)',
    height: 320,
  },
  {
    id: 'g5',
    caption: 'Siomay menjelang masuk kukusan',
    gradient: 'linear-gradient(118deg, #E0C060 0%, #C0392B 100%)',
    height: 240,
  },
  {
    id: 'g6',
    caption: 'Detail lipatan tangan terakhir',
    gradient: 'linear-gradient(158deg, #8B2319 0%, #C0392B 55%, #1A1A1A 100%)',
    height: 320,
  },
]

// Desktop column count used to compute row/col for alternating animation direction.
const DESKTOP_COLS = 3

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Galeri() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const cellRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      cellRefs.current.forEach((cell, i) => {
        if (!cell) return

        const row = Math.floor(i / DESKTOP_COLS)  // 0 or 1 for 6 cells
        const col = i % DESKTOP_COLS              // 0, 1, or 2

        // Even rows slide from left, odd rows from right
        const fromLeft = row % 2 === 0

        gsap.from(cell, {
          x: fromLeft ? -52 : 52,
          opacity: 0,
          duration: 0.72,
          delay: col * 0.1,        // stagger within the row
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section ref={sectionRef} id="galeri" className="bg-cream py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <div className="mb-14">
          <p className="font-body text-[11px] font-semibold tracking-[0.22em] text-red uppercase mb-3">
            Galeri
          </p>
          <h2 className="font-display text-4xl font-bold text-ink md:text-5xl mb-4">
            Dari Dapur Kami
          </h2>
          <p className="font-body text-base text-ink/55 max-w-md leading-relaxed">
            Setiap gambar adalah momen yang kami jaga — dari lipatan pertama
            hingga sajian di meja makanmu.
          </p>
        </div>

        {/* Masonry-feel grid
            items-start: cells don't stretch to row height, preserving height contrast.
            Each cell has an explicit pixel height — shorter cells leave natural gap
            at the bottom of their row cell, creating the staggered masonry look. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 items-start">
          {CELLS.map((cell, i) => (
            <div
              key={cell.id}
              ref={el => { cellRefs.current[i] = el }}
              className={[
                'group relative overflow-hidden rounded-2xl cursor-default',
                // Scale + shadow bloom on hover
                'transition-[transform,box-shadow] duration-[380ms] ease-out',
                'hover:scale-[1.04]',
                'hover:shadow-[0_16px_48px_rgba(0,0,0,0.14)]',
                'will-change-transform',
              ].join(' ')}
              style={{
                height: cell.height,
                background: cell.gradient,
              }}
            >
              {/* Faint diagonal texture — same language as TentangKami bg */}
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(255,255,255,0.04) 20px, rgba(255,255,255,0.04) 21px)',
                }}
              />

              {/* Highlight vignette at top-left corner */}
              <div
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 60% at 20% 20%, rgba(255,255,255,0.12) 0%, transparent 70%)',
                }}
              />

              {/* Caption overlay — hidden until hover, translates up 8px */}
              <div
                className={[
                  'absolute inset-x-0 bottom-0 px-5 py-4',
                  'bg-gradient-to-t from-black/60 via-black/20 to-transparent',
                  // Start 8px below, invisible; hover: move up, fade in
                  'translate-y-2 opacity-0',
                  'group-hover:translate-y-0 group-hover:opacity-100',
                  'transition-[transform,opacity] duration-300 ease-out',
                ].join(' ')}
              >
                <p className="font-body text-sm font-medium text-white leading-snug">
                  {cell.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

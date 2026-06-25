import { useLayoutEffect, useRef, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import gsap from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ─── SVG line-art icons ───────────────────────────────────────────────────────
// All 56×56 viewBox, stroke inherits from parent, fill none.

const SVG_PROPS = {
  viewBox: '0 0 56 56',
  width: 52,
  height: 52,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function HakauIcon() {
  // Crescent dumpling body with pleat fold and three pleat marks
  return (
    <svg {...SVG_PROPS}>
      <path d="M 10 30 C 10 16 18 10 28 10 C 38 10 46 16 46 30 C 46 42 38 48 28 48 C 18 48 10 42 10 30 Z" />
      <path d="M 10 28 C 17 22 22 20 28 20 C 34 20 39 22 46 28" />
      <path d="M 19 23 L 18 35" />
      <path d="M 28 20 L 28 35" />
      <path d="M 37 23 L 38 35" />
    </svg>
  )
}

function SiomayIcon() {
  // Open-top cup dumpling with scalloped edge and filling dome
  return (
    <svg {...SVG_PROPS}>
      <path d="M 15 44 L 15 30" />
      <path d="M 41 44 L 41 30" />
      <path d="M 15 44 C 15 48 20 50 28 50 C 36 50 41 48 41 44" />
      <path d="M 15 30 C 17 25 20 23 22 27 C 23 22 26 20 28 20 C 30 20 33 22 34 27 C 36 23 39 25 41 30" />
      <path d="M 21 27 C 22 22 34 22 35 27" />
    </svg>
  )
}

function CheongFunIcon() {
  // Rice noodle roll — cylinder end-on showing three rolled layers
  return (
    <svg {...SVG_PROPS}>
      <path d="M 8 22 L 8 36" />
      <path d="M 48 22 L 48 36" />
      <path d="M 8 22 C 8 16 16 12 28 12 C 40 12 48 16 48 22" />
      <path d="M 8 36 C 8 42 16 46 28 46 C 40 46 48 42 48 36" />
      {/* Top opening ellipse showing hollow */}
      <path d="M 8 22 C 8 28 16 32 28 32 C 40 32 48 28 48 22" />
      {/* Two inner roll layers */}
      <path d="M 15 22 C 15 26 20 29 28 29 C 36 29 41 26 41 22" />
      <path d="M 21 22 C 21 25 24 27 28 27 C 32 27 35 25 35 22" />
    </svg>
  )
}

function TurnipCakeIcon() {
  // Isometric rectangular block with horizontal score lines on front face
  return (
    <svg {...SVG_PROPS}>
      {/* Front face */}
      <path d="M 8 22 L 8 44 L 40 44 L 40 22 Z" />
      {/* Top face */}
      <path d="M 8 22 L 16 14 L 48 14 L 40 22 Z" />
      {/* Right face */}
      <path d="M 40 22 L 48 14 L 48 36 L 40 44" />
      {/* Horizontal score lines on front */}
      <path d="M 8 30 L 40 30" />
      <path d="M 8 37 L 40 37" />
    </svg>
  )
}

function EggTartIcon() {
  // Top-down view: three concentric circles + four radial spokes in rim
  return (
    <svg {...SVG_PROPS}>
      <circle cx="28" cy="28" r="20" />
      <circle cx="28" cy="28" r="13" />
      <circle cx="28" cy="28" r="5" />
      {/* Radial spokes suggesting fluted pastry rim */}
      <line x1="28" y1="8" x2="28" y2="15" />
      <line x1="28" y1="41" x2="28" y2="48" />
      <line x1="8" y1="28" x2="15" y2="28" />
      <line x1="41" y1="28" x2="48" y2="28" />
    </svg>
  )
}

function PorkBunIcon() {
  // Steamed bao dome with three pleats converging at a crown knot
  return (
    <svg {...SVG_PROPS}>
      <path d="M 10 42 C 10 22 17 10 28 10 C 39 10 46 22 46 42" />
      <path d="M 10 42 C 10 47 18 50 28 50 C 38 50 46 47 46 42" />
      {/* Three pleat lines converging at crown */}
      <path d="M 28 10 C 23 14 21 20 24 24" />
      <path d="M 28 10 C 28 15 28 20 28 24" />
      <path d="M 28 10 C 33 14 35 20 32 24" />
      {/* Crown knot */}
      <circle cx="28" cy="24" r="2.5" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string
  name: string
  desc: string
  price: string
  Icon: ComponentType
}

const MENU: MenuItem[] = [
  {
    id: 'hakau',
    name: 'Hakau',
    desc: 'Kulit transparan diisi udang segar cincang, dikukus hingga lembut kenyal.',
    price: 'Rp 28.000 / 4 pcs',
    Icon: HakauIcon,
  },
  {
    id: 'siomay',
    name: 'Siomay',
    desc: 'Campuran daging dan udang dalam kulit tipis, kukus dengan saus kecap jahe.',
    price: 'Rp 26.000 / 4 pcs',
    Icon: SiomayIcon,
  },
  {
    id: 'cheong-fun',
    name: 'Cheong Fun',
    desc: 'Lembaran beras digulung dengan udang atau char siu, siraman saus manis.',
    price: 'Rp 32.000 / 2 roll',
    Icon: CheongFunIcon,
  },
  {
    id: 'turnip-cake',
    name: 'Turnip Cake',
    desc: 'Kue lobak kukus lalu digoreng kecokelatan — renyah luar, lembut dalam.',
    price: 'Rp 22.000 / 3 pcs',
    Icon: TurnipCakeIcon,
  },
  {
    id: 'egg-tart',
    name: 'Egg Tart',
    desc: 'Kulit pastri renyah dengan isian custard telur sutra — hangat dari oven.',
    price: 'Rp 18.000 / 2 pcs',
    Icon: EggTartIcon,
  },
  {
    id: 'pork-bun',
    name: 'Pork Bun',
    desc: 'Bakpao kukus berisi char siu manis-gurih, diuleni dan dilipat dengan tangan.',
    price: 'Rp 24.000 / 2 pcs',
    Icon: PorkBunIcon,
  },
]

// ─── Spring config for icon bounce ────────────────────────────────────────────

const ICON_SPRING = { type: 'spring', stiffness: 520, damping: 13, mass: 0.7 } as const

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Menu() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from(cardRefs.current, {
        y: 44,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section ref={sectionRef} id="menu" className="bg-cream py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <div className="mb-14">
          <p className="font-body text-[11px] font-semibold tracking-[0.22em] text-red uppercase mb-3">
            Menu
          </p>
          <h2 className="font-display text-4xl font-bold text-ink md:text-5xl">
            Pilihan Hari Ini
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {MENU.map((item, i) => (
            <div
              key={item.id}
              ref={el => { cardRefs.current[i] = el }}
              className={[
                'group relative flex flex-col p-6 md:p-7',
                'bg-cream border border-muted rounded-2xl',
                'transition-all duration-300 ease-out cursor-default',
                'hover:-translate-y-1.5',
                'hover:border-gold',
                'hover:shadow-[0_14px_36px_rgba(212,168,71,0.14),0_2px_8px_rgba(0,0,0,0.06)]',
              ].join(' ')}
            >
              {/* Icon with spring bounce on hover */}
              <motion.div
                className="mb-5 w-fit text-ink/70 group-hover:text-ink transition-colors duration-200"
                whileHover={reducedMotion ? undefined : { y: -4, scale: 1.1 }}
                transition={ICON_SPRING}
              >
                <item.Icon />
              </motion.div>

              {/* Gold accent bar — appears on hover */}
              <div
                className={[
                  'absolute top-0 left-6 right-6 h-px rounded-full',
                  'bg-gold scale-x-0 group-hover:scale-x-100',
                  'transition-transform duration-300 ease-out origin-left',
                ].join(' ')}
              />

              <h3 className="font-display text-xl font-bold text-ink mb-1.5">
                {item.name}
              </h3>

              <p className="font-body text-sm leading-relaxed text-ink/55 flex-1 mb-4">
                {item.desc}
              </p>

              <p className="font-body text-sm font-semibold text-red">
                {item.price}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

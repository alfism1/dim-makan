import { useLayoutEffect, useRef, type ComponentType } from 'react'
import gsap from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ─── Channel icons (36×36 viewBox) ───────────────────────────────────────────

const ICON_BASE = {
  viewBox: '0 0 36 36',
  width: 26,
  height: 26,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function WhatsAppIcon() {
  // Speech bubble with two text lines and a downward tail
  return (
    <svg {...ICON_BASE}>
      <path d="M 6 8 C 6 5.2 8.2 3 11 3 H 25 C 27.8 3 30 5.2 30 8 V 20 C 30 22.8 27.8 25 25 25 H 15 L 10 31 L 13 25 H 11 C 8.2 25 6 22.8 6 20 Z" />
      <line x1="12" y1="12" x2="24" y2="12" />
      <line x1="12" y1="17" x2="20" y2="17" />
    </svg>
  )
}

function GoFoodIcon() {
  // Delivery scooter with a rear cargo box
  return (
    <svg {...ICON_BASE}>
      <circle cx="9" cy="28" r="4.5" />
      <circle cx="27" cy="28" r="4.5" />
      {/* Frame */}
      <path d="M 13.5 28 L 12 19 L 21 16 L 25 28" />
      {/* Front fork */}
      <path d="M 21 16 L 27 23" />
      {/* Handlebar */}
      <path d="M 17 16 L 22 13 L 29 13" />
      {/* Cargo box (rear) */}
      <rect x="5" y="10" width="11" height="9" rx="1" />
      <line x1="5" y1="15" x2="16" y2="15" />
    </svg>
  )
}

function GrabFoodIcon() {
  // Takeout bag with handles and a stripe
  return (
    <svg {...ICON_BASE}>
      {/* Bag body */}
      <path d="M 10 16 L 8 31 C 8 32.1 8.9 33 10 33 H 26 C 27.1 33 28 32.1 28 31 L 26 16 Z" />
      {/* Handles */}
      <path d="M 14 16 C 14 11 15.8 9 18 9 C 20.2 9 22 11 22 16" />
      {/* Stripe */}
      <line x1="8" y1="22" x2="28" y2="22" />
      {/* Fold lines */}
      <line x1="12" y1="16" x2="11" y2="33" />
      <line x1="24" y1="16" x2="25" y2="33" />
    </svg>
  )
}

function StorefrontIcon() {
  // Simplified shop front: roof peak, windows, central door
  return (
    <svg {...ICON_BASE}>
      {/* Building body */}
      <rect x="4" y="16" width="28" height="17" rx="0.5" />
      {/* Roof pediment */}
      <path d="M 2 17 L 18 6 L 34 17" />
      {/* Left window */}
      <rect x="6" y="19" width="7" height="6" rx="0.5" />
      {/* Right window */}
      <rect x="23" y="19" width="7" height="6" rx="0.5" />
      {/* Door */}
      <rect x="13" y="24" width="10" height="9" rx="0.5" />
      {/* Door knob */}
      <circle cx="21" cy="28.5" r="1" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Channel {
  id: string
  name: string
  label: string
  desc: string
  cta: string | null
  href: string | null
  Icon: ComponentType
  iconRing: string   // border + icon color class
  iconBg: string
  ctaVariant: 'green' | 'outline' | null
}

const CHANNELS: Channel[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    label: 'Chat langsung',
    desc: 'Pesan kapan saja, kami balas dalam hitungan menit.',
    cta: 'Chat Sekarang',
    href: 'https://wa.me/',
    Icon: WhatsAppIcon,
    iconBg: 'bg-green-500/10',
    iconRing: 'border-green-500/30 text-green-600',
    ctaVariant: 'green',
  },
  {
    id: 'gofood',
    name: 'GoFood',
    label: 'Order online',
    desc: 'Pesan via GoFood, diantar langsung oleh mitra driver.',
    cta: 'Buka GoFood',
    href: 'https://gofood.co.id/',
    Icon: GoFoodIcon,
    iconBg: 'bg-emerald-400/10',
    iconRing: 'border-emerald-500/30 text-emerald-600',
    ctaVariant: 'outline',
  },
  {
    id: 'grabfood',
    name: 'GrabFood',
    label: 'Order online',
    desc: 'Pesan via GrabFood, bebas pilih waktu pengiriman.',
    cta: 'Buka GrabFood',
    href: 'https://grabfood.com/',
    Icon: GrabFoodIcon,
    iconBg: 'bg-teal-400/10',
    iconRing: 'border-teal-500/30 text-teal-600',
    ctaVariant: 'outline',
  },
  {
    id: 'pickup',
    name: 'Pickup',
    label: 'Datang ke kami',
    desc: 'Jl. [PLACEHOLDER: alamat]. Buka setiap hari pukul 07.00–12.00 WIB.',
    cta: null,
    href: null,
    Icon: StorefrontIcon,
    iconBg: 'bg-ink/6',
    iconRing: 'border-muted text-ink/60',
    ctaVariant: null,
  },
]

// ─── CTA button ───────────────────────────────────────────────────────────────

function CtaButton({
  label,
  href,
  variant,
}: {
  label: string
  href: string
  variant: 'green' | 'outline'
}) {
  const base =
    'mt-auto inline-flex items-center justify-center rounded-full px-5 py-2.5 font-body font-semibold text-sm tracking-wide transition-colors duration-200'

  const styles = {
    green: 'bg-green-500 text-white hover:bg-green-600',
    outline: 'border border-ink/20 text-ink hover:bg-ink hover:text-cream',
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${styles[variant]}`}>
      {label}
    </a>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function HowToOrder() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGLineElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const grid = gridRef.current
    const line = lineRef.current
    if (reducedMotion || !grid || !line) return

    const ctx = gsap.context(() => {
      // ── Horizontal connecting line: measure → dasharray → animate ──────────
      // Set x2 to actual container pixel width so getTotalLength() is exact.
      const width = grid.offsetWidth
      line.setAttribute('x2', String(width))
      const length = line.getTotalLength() // = width (horizontal line)

      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          end: 'center 38%',
          scrub: 1.3,
        },
      })

      // ── Card stagger: fade + slide up ──────────────────────────────────────
      gsap.from(cardRefs.current, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
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
    <section
      ref={sectionRef}
      id="cara-order"
      className="py-24 md:py-32"
      style={{ backgroundColor: '#F5F1EC' }}   // warm off-white, slightly richer than cream
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <div className="mb-14">
          <p className="font-body text-[11px] font-semibold tracking-[0.22em] text-red uppercase mb-3">
            Cara Order
          </p>
          <h2 className="font-display text-4xl font-bold text-ink md:text-5xl">
            Mudah Pesan, Dimana Saja.
          </h2>
        </div>

        {/* Card grid + horizontal connecting line */}
        <div ref={gridRef} className="relative">

          {/* SVG connecting line — desktop only, sits at icon-circle center (top 48px) */}
          <svg
            className="hidden lg:block absolute pointer-events-none"
            style={{ top: '48px', left: 0, width: '100%', height: '2px', overflow: 'visible' }}
            aria-hidden="true"
          >
            <line
              ref={lineRef}
              x1="0"
              y1="1"
              x2="0"          // set dynamically in useLayoutEffect
              y2="1"
              stroke="#E8E0D5"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {CHANNELS.map((ch, i) => (
              <div
                key={ch.id}
                ref={el => { cardRefs.current[i] = el }}
                className={[
                  'relative flex flex-col gap-4 p-6 rounded-2xl',
                  'bg-cream border border-muted',
                  'transition-shadow duration-300',
                  'hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)]',
                ].join(' ')}
              >
                {/* Icon circle */}
                <div
                  className={[
                    'relative z-10',               // sits above the SVG line
                    'w-12 h-12 rounded-full border flex items-center justify-center',
                    ch.iconBg,
                    ch.iconRing,
                  ].join(' ')}
                >
                  <ch.Icon />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1 flex-1">
                  <h3 className="font-display text-lg font-bold text-ink leading-tight">
                    {ch.name}
                  </h3>
                  <p className="font-body text-[11px] font-semibold tracking-[0.12em] text-red/80 uppercase mb-1">
                    {ch.label}
                  </p>
                  <p className="font-body text-sm text-ink/55 leading-relaxed">
                    {ch.desc}
                  </p>
                </div>

                {/* CTA or address note */}
                {ch.cta !== null && ch.href !== null && ch.ctaVariant !== null && (
                  <CtaButton
                    label={ch.cta}
                    href={ch.href}
                    variant={ch.ctaVariant}
                  />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

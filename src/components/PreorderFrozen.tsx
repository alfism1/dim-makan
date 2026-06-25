import { useLayoutEffect, useRef, type ComponentType } from 'react'
import gsap from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ─── Step icons (20×20 viewBox, inherits stroke from parent) ─────────────────

function MenuListIcon() {
  return (
    <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="14" height="16" rx="2" />
      <line x1="6.5" y1="7" x2="13.5" y2="7" />
      <line x1="6.5" y1="10.5" x2="13.5" y2="10.5" />
      <line x1="6.5" y1="14" x2="10.5" y2="14" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="16" height="14" rx="2" />
      <line x1="2" y1="9" x2="18" y2="9" />
      <line x1="6.5" y1="2" x2="6.5" y2="6" />
      <line x1="13.5" y1="2" x2="13.5" y2="6" />
      {/* Small "1" digit hinting at H-1 */}
      <path d="M 8.5 13 L 10.5 11.5 L 10.5 16" />
    </svg>
  )
}

function DeliveryIcon() {
  return (
    <svg viewBox="0 0 22 20" width="19" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Truck body */}
      <rect x="1" y="6" width="13" height="10" rx="1" />
      {/* Cab */}
      <path d="M 14 8.5 L 17.5 8.5 L 20 12 L 20 16 L 14 16" />
      {/* Wheels */}
      <circle cx="4.5" cy="18" r="1.8" />
      <circle cx="11" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  )
}

// ─── Freezer / steam tip icons ────────────────────────────────────────────────

function SnowflakeIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="10" y1="2" x2="10" y2="18" />
      <line x1="2" y1="10" x2="18" y2="10" />
      <line x1="4.5" y1="4.5" x2="15.5" y2="15.5" />
      <line x1="15.5" y1="4.5" x2="4.5" y2="15.5" />
      <line x1="10" y1="2" x2="7.5" y2="4.5" />
      <line x1="10" y1="2" x2="12.5" y2="4.5" />
      <line x1="10" y1="18" x2="7.5" y2="15.5" />
      <line x1="10" y1="18" x2="12.5" y2="15.5" />
    </svg>
  )
}

function SteamIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      {/* Steamer base */}
      <rect x="2" y="14" width="16" height="4" rx="1" />
      {/* Steam wisps */}
      <path d="M 6 11 C 7 9 5 7 6 5" />
      <path d="M 10 11 C 11 9 9 7 10 5" />
      <path d="M 14 11 C 15 9 13 7 14 5" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Step {
  label: string
  desc: string
  Icon: ComponentType
}

const STEPS: Step[] = [
  {
    label: 'Pilih Menu',
    desc: 'Jelajahi menu dan pilih favoritmu lewat WhatsApp atau Instagram kami.',
    Icon: MenuListIcon,
  },
  {
    label: 'Order H-1',
    desc: 'Konfirmasi pesanan sehari sebelum, kami siapkan segar dari pagi hari.',
    Icon: CalendarIcon,
  },
  {
    label: 'Diantar Segar',
    desc: 'Tiba di pintumu tepat waktu, masih hangat dalam kemasan insulated kami.',
    Icon: DeliveryIcon,
  },
]

// Height of each connecting line SVG — fixed so we know the dasharray exactly.
const CONN_H = 52

// ─── Section ──────────────────────────────────────────────────────────────────

export default function PreorderFrozen() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const connector1Ref = useRef<SVGLineElement>(null)
  const connector2Ref = useRef<SVGLineElement>(null)
  const dividerRef = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      // ── Timeline connector lines: stroke-dashoffset draw ──────────────────
      const connectors = [connector1Ref.current, connector2Ref.current]
      connectors.forEach(el => {
        if (!el) return
        gsap.fromTo(
          el,
          { strokeDashoffset: CONN_H },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 74%',
              end: 'center 40%',
              scrub: 1.4,
            },
          },
        )
      })

      // ── Vertical divider: scale from top ─────────────────────────────────
      // scaleY 0→1 reveals the dashed line progressively as user scrolls
      if (dividerRef.current) {
        gsap.from(dividerRef.current, {
          scaleY: 0,
          transformOrigin: '50% 0%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 68%',
            end: 'bottom 55%',
            scrub: 1.6,
          },
        })
      }

      // ── Panel entrance slides ─────────────────────────────────────────────
      const enterConfig = {
        opacity: 0,
        duration: 0.88,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      } as const

      gsap.from(leftRef.current, { ...enterConfig, x: -48 })
      gsap.from(rightRef.current, { ...enterConfig, x: 48, delay: 0.14 })
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="pre-order"
      className="bg-cream py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Overline */}
        <p className="font-body text-[11px] font-semibold tracking-[0.22em] text-red uppercase mb-14">
          Pre-order &amp; Frozen
        </p>

        {/* Two-column layout */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-0 items-start">

          {/* ── Vertical dashed SVG divider (desktop only) ── */}
          <div
            className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-px pointer-events-none"
            aria-hidden="true"
          >
            <svg
              ref={dividerRef}
              width="2"
              height="100%"
              preserveAspectRatio="none"
              overflow="visible"
            >
              <line
                x1="1" y1="0" x2="1" y2="100%"
                stroke="#E8E0D5"
                strokeWidth="1.5"
                strokeDasharray="6 5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* ── Left: Pre-order ── */}
          <div ref={leftRef} className="md:pr-14">
            <h3 className="font-display text-3xl font-bold text-ink leading-tight mb-8 md:text-4xl">
              Pesan Hari Ini,
              <br />
              Nikmati Besok.
            </h3>

            {/* 3-step timeline */}
            <div>
              {STEPS.map((step, i) => (
                <div key={step.label}>
                  {/* Step row */}
                  <div className="flex items-start gap-4">
                    {/* Step circle */}
                    <div className="flex-none w-9 h-9 rounded-full border-2 border-red/30 bg-red/5 flex items-center justify-center text-red">
                      <step.Icon />
                    </div>
                    {/* Step text */}
                    <div className="pb-2">
                      <h4 className="font-body font-semibold text-ink text-[0.95rem] mb-1">
                        {step.label}
                      </h4>
                      <p className="font-body text-sm text-ink/55 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Connector line between steps */}
                  {i < STEPS.length - 1 && (
                    <div className="ml-[17px]">
                      <svg
                        width="2"
                        height={CONN_H}
                        overflow="visible"
                        aria-hidden="true"
                      >
                        <line
                          ref={i === 0 ? connector1Ref : connector2Ref}
                          x1="1" y1="0" x2="1" y2={CONN_H}
                          stroke="#E8E0D5"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeDasharray={CONN_H}
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className={[
                'mt-10 inline-flex items-center justify-center',
                'px-7 py-3.5 rounded-full',
                'bg-red text-cream font-body font-semibold text-sm tracking-wide',
                'hover:bg-red-dark transition-colors duration-200',
              ].join(' ')}
            >
              Pre-order via WhatsApp
            </a>
          </div>

          {/* ── Right: Frozen dimsum ── */}
          <div ref={rightRef} className="md:pl-14">
            <h3 className="font-display text-3xl font-bold text-ink leading-tight mb-5 md:text-4xl">
              Bawa Pulang,
              <br />
              Kukus Kapanpun.
            </h3>

            <p className="font-body text-[0.95rem] leading-[1.78] text-ink/65 mb-7">
              Dimsum beku kami tahan hingga 30 hari di freezer tanpa kehilangan
              rasa. Langsung kukus 12–15 menit dari kondisi beku — hasilnya
              masih kenyal dan segar seperti baru dibuat. Tersedia dalam kemasan
              10 pcs per jenis, cocok untuk stok mingguan atau kado yang
              berbeda dari biasanya.
            </p>

            {/* Storage & reheat tips */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-ink/4 border border-muted">
                <span className="text-ink/50">
                  <SnowflakeIcon />
                </span>
                <div>
                  <p className="font-body text-xs font-semibold text-ink">Freezer</p>
                  <p className="font-body text-xs text-ink/50">Hingga 30 hari</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-ink/4 border border-muted">
                <span className="text-ink/50">
                  <SteamIcon />
                </span>
                <div>
                  <p className="font-body text-xs font-semibold text-ink">Kukus</p>
                  <p className="font-body text-xs text-ink/50">12–15 menit</p>
                </div>
              </div>
            </div>

            {/* Availability badge — pulsing CSS animation */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-green-500/8 border border-green-500/20 mb-9">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-55" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500" />
              </span>
              <span className="font-body text-sm font-medium text-green-700">
                Tersedia setiap hari
              </span>
            </div>

            {/* CTA */}
            <div>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'inline-flex items-center justify-center',
                  'px-7 py-3.5 rounded-full',
                  'border border-ink/20 text-ink font-body font-semibold text-sm tracking-wide',
                  'hover:bg-ink hover:text-cream transition-all duration-200',
                ].join(' ')}
              >
                Tanya Stok
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

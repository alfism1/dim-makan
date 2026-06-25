import { useLayoutEffect, useRef } from 'react'
import gsap from '@/lib/gsap'
import { ScrollTrigger } from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Package {
  id: string
  name: string
  tagline: string
  pax: string
  items: string[]
  price: string | null
  priceNote: string
  popular: boolean
  cta: string
}

const PACKAGES: Package[] = [
  {
    id: 'arisan',
    name: 'Paket Arisan',
    tagline: 'Untuk pertemuan kecil yang hangat',
    pax: '25–50 pax',
    items: [
      '5 jenis dimsum pilihan',
      'Hakau, Siomay & Egg Tart',
      'Kukusan + serving tray',
      'Pesan min. 2 hari sebelumnya',
    ],
    price: 'Rp 350.000',
    priceNote: '/ 25 pax, sudah termasuk perlengkapan sajian',
    popular: false,
    cta: 'Pesan via WhatsApp',
  },
  {
    id: 'kantor',
    name: 'Paket Kantor',
    tagline: 'Untuk rapat dan gathering tim',
    pax: '50–100 pax',
    items: [
      '8 jenis dimsum premium',
      'Termasuk Cheong Fun & Turnip Cake',
      'Set up & serving langsung di lokasi',
      'Packaging branded Dim Makan',
      'Pesan min. 3 hari sebelumnya',
    ],
    price: 'Rp 650.000',
    priceNote: '/ 50 pax, termasuk tim penyajian',
    popular: true,
    cta: 'Pesan via WhatsApp',
  },
  {
    id: 'acara',
    name: 'Paket Acara',
    tagline: 'Untuk pernikahan, ulang tahun & event besar',
    pax: '100+ pax',
    items: [
      'Menu custom sesuai tema acara',
      'Chef langsung ke lokasi',
      'Live cooking station',
      'Dekorasi & display meja makan',
    ],
    price: null,
    priceNote: 'Hubungi kami untuk penawaran khusus',
    popular: false,
    cta: 'Hubungi Kami',
  },
]

// ─── Bullet icon ──────────────────────────────────────────────────────────────

function BulletCheck() {
  return (
    <svg
      viewBox="0 0 14 14"
      width="12"
      height="12"
      fill="none"
      className="mt-[3px] shrink-0"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M 4 7 L 6.2 9.2 L 10 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Catering() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      // Build one shared ScrollTrigger so all three cards react to the same
      // scroll position, then stagger with per-card delay.
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      })

      cardRefs.current.forEach((card, i) => {
        if (!card) return

        gsap.from(card, {
          y: 72,
          rotation: (i - 1) * 7,   // −7° → 0° → +7°
          opacity: 0,
          scale: 0.93,
          transformOrigin: 'bottom center',
          duration: 0.9,
          delay: i * 0.11,
          ease: 'back.out(1.1)',
          scrollTrigger: trigger,
        })
      })
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="catering"
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: '#C0392B' }}
    >
      {/* Soft radial highlight — lifts center without breaking the red */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 20%, rgba(255,255,255,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="font-body text-[11px] font-semibold tracking-[0.22em] text-cream/45 uppercase mb-4">
            Catering
          </p>
          <h2 className="font-display text-4xl font-bold text-cream md:text-5xl lg:text-[3.25rem] mb-4">
            Untuk Acara Spesialmu
          </h2>
          <p className="font-body text-base text-cream/60 max-w-sm mx-auto leading-relaxed">
            Dari arisan keluarga hingga event perusahaan — kami siap hadir.
          </p>
        </div>

        {/* Package cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4 lg:gap-6 items-start">
          {PACKAGES.map((pkg, i) => (
            <div
              key={pkg.id}
              ref={el => { cardRefs.current[i] = el }}
              className={[
                'relative flex flex-col rounded-2xl',
                'transition-shadow duration-300',
                pkg.popular
                  ? [
                      'border-2 border-gold',
                      'bg-white/10',
                      'shadow-[0_20px_50px_rgba(0,0,0,0.25)]',
                      'md:-mt-4 md:pb-4',          // popular card taller than siblings
                    ].join(' ')
                  : 'border border-white/18 bg-white/6 hover:bg-white/10',
                'p-7',
                pkg.popular ? 'pt-10' : '',        // extra top pad for badge clearance
              ].join(' ')}
            >
              {/* "Terpopuler" badge */}
              {pkg.popular && (
                <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap bg-gold text-ink text-[11px] font-bold tracking-[0.06em] px-4 py-1.5 rounded-full shadow-md">
                  ★ Terpopuler
                </div>
              )}

              {/* Pax range pill */}
              <div
                className={[
                  'self-start mb-5 px-3 py-1 rounded-full',
                  'font-body text-xs font-semibold tracking-wide',
                  pkg.popular
                    ? 'bg-gold/20 text-gold'
                    : 'bg-white/10 text-cream/70',
                ].join(' ')}
              >
                {pkg.pax}
              </div>

              {/* Name + tagline */}
              <h3 className="font-display text-2xl font-bold text-cream mb-1.5">
                {pkg.name}
              </h3>
              <p className="font-body text-sm text-cream/55 mb-7 leading-relaxed">
                {pkg.tagline}
              </p>

              {/* Inclusion bullets */}
              <ul className="flex-1 space-y-3 mb-8">
                {pkg.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <span
                      className={pkg.popular ? 'text-gold' : 'text-cream/50'}
                    >
                      <BulletCheck />
                    </span>
                    <span className="font-body text-sm text-cream/75 leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Price block */}
              <div className="mb-7">
                {pkg.price !== null ? (
                  <>
                    <p
                      className={[
                        'font-display text-3xl font-bold',
                        pkg.popular ? 'text-gold' : 'text-cream',
                      ].join(' ')}
                    >
                      {pkg.price}
                    </p>
                    <p className="font-body text-xs text-cream/40 mt-1 leading-snug">
                      {pkg.priceNote}
                    </p>
                  </>
                ) : (
                  <p className="font-body text-sm italic text-gold/90 leading-relaxed">
                    {pkg.priceNote}
                  </p>
                )}
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  'inline-flex items-center justify-center w-full',
                  'rounded-full py-3 px-6',
                  'font-body font-semibold text-sm tracking-wide',
                  'transition-all duration-200',
                  pkg.popular
                    ? 'bg-gold text-ink hover:bg-gold/85 shadow-md'
                    : 'border border-cream/30 text-cream hover:bg-cream/10',
                ].join(' ')}
              >
                {pkg.cta}
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

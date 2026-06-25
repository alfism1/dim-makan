import { useLayoutEffect, useRef } from 'react'
import gsap from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ─── Icons ────────────────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="6" />
      <circle cx="12" cy="12" r="5" />
      {/* Dot — filled, overrides parent fill="none" */}
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const reducedMotion = useReducedMotion()
  const footerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      gsap.from(footerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          // play once — reversing a footer fade looks odd
          toggleActions: 'play none none none',
        },
      })
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <footer
      ref={footerRef}
      style={{ backgroundColor: '#8B2319' }}
    >
      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-20">

        {/* Headline */}
        <div className="mb-10">
          <h2
            className="font-display font-bold text-cream leading-[1.05] tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
          >
            Lapar?
            <br />
            Kami Siap.
          </h2>
          <p className="font-body text-base text-cream/55 mt-5 max-w-sm leading-relaxed">
            Pesan sekarang — dimsum segar diantar ke pintumu hari ini.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'inline-flex items-center justify-center',
              'px-7 py-3.5 rounded-full',
              'bg-green-500 text-white font-body font-semibold text-sm tracking-wide',
              'hover:bg-green-600 transition-colors duration-200',
            ].join(' ')}
          >
            WhatsApp
          </a>
          <a
            href="https://gofood.co.id/"
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'inline-flex items-center justify-center',
              'px-7 py-3.5 rounded-full',
              'border border-cream/30 text-cream font-body font-semibold text-sm tracking-wide',
              'hover:bg-cream/10 transition-colors duration-200',
            ].join(' ')}
          >
            GoFood
          </a>
          <a
            href="https://grabfood.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'inline-flex items-center justify-center',
              'px-7 py-3.5 rounded-full',
              'border border-cream/30 text-cream font-body font-semibold text-sm tracking-wide',
              'hover:bg-cream/10 transition-colors duration-200',
            ].join(' ')}
          >
            GrabFood
          </a>
        </div>

        {/* Info grid */}
        <div className="mt-16 pt-10 border-t border-cream/12 grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16">

          {/* Operating hours */}
          <div>
            <p className="font-body text-[11px] font-semibold tracking-[0.2em] text-cream/40 uppercase mb-4">
              Jam Operasional
            </p>
            <p className="font-body text-cream/80 text-[0.9rem] leading-relaxed">
              Senin – Minggu
              <br />
              07.00 – 12.00 WIB
            </p>
            <p className="font-body text-cream/45 text-xs mt-3 leading-relaxed">
              Pesanan WhatsApp ditutup pukul 20.00 WIB
              <br />
              (untuk pengiriman esok pagi)
            </p>
          </div>

          {/* Delivery area */}
          <div>
            <p className="font-body text-[11px] font-semibold tracking-[0.2em] text-cream/40 uppercase mb-4">
              Area Pengiriman
            </p>
            <p className="font-body text-cream/80 text-[0.9rem] leading-relaxed">
              Jakarta Selatan · Jakarta Pusat
              <br />
              BSD City &amp; Tangerang Selatan
            </p>
            <p className="font-body text-cream/45 text-xs mt-3 leading-relaxed">
              Tersedia via GoFood &amp; GrabFood
              <br />
              untuk area di luar jangkauan pengiriman langsung
            </p>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-cream/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Instagram link */}
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={[
              'inline-flex items-center gap-2',
              'font-body text-sm text-cream/45',
              'hover:text-cream/80 transition-colors duration-200',
            ].join(' ')}
          >
            <InstagramIcon />
            @dimmakan
          </a>

          {/* Copyright */}
          <p className="font-body text-xs text-cream/30">
            © 2025 Dim Makan. Dibuat dengan &hearts; di Jakarta.
          </p>

        </div>
      </div>
    </footer>
  )
}

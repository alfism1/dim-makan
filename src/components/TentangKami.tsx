import { useLayoutEffect, useRef } from 'react'
import gsap from '@/lib/gsap'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// ─── SVG founder signature ────────────────────────────────────────────────────
// Four-path hand-drawn style: capital initial loop → flowing middle → ascending
// tail → red underline flourish.

function FounderSignature() {
  return (
    <svg
      viewBox="0 0 180 72"
      width="180"
      height="72"
      fill="none"
      aria-label="Tanda tangan pendiri"
    >
      {/* Capital initial — a looping "D" form */}
      <path
        d="M 16 46 C 13 24 21 9 31 12 C 44 16 46 35 41 46 C 39 55 30 59 22 54 C 19 51 17 47 19 43"
        stroke="#1A1A1A"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Middle letters — two humped bumps, pen stays down */}
      <path
        d="M 41 28 C 57 20 70 38 75 34 C 81 28 82 43 74 46 C 88 40 108 24 122 35 C 130 41 126 54 115 51"
        stroke="#1A1A1A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Ascending tail that loops back — final flourish */}
      <path
        d="M 115 51 C 132 44 152 26 164 37 C 168 42 165 52 157 50"
        stroke="#1A1A1A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Red underline — ties the signature together */}
      <path
        d="M 10 64 Q 90 59 168 63"
        stroke="#C0392B"
        strokeWidth="0.85"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function TentangKami() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      const shared = {
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      } as const

      gsap.from(leftRef.current, { ...shared, x: -56 })
      gsap.from(rightRef.current, { ...shared, x: 56, delay: 0.12 })
    })

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="tentang-kami"
      className="relative bg-cream overflow-hidden"
      style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 22px,
          rgba(26,26,26,0.022) 22px,
          rgba(26,26,26,0.022) 23px
        )`,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">

        {/* ── Left: pull quote ── */}
        <div ref={leftRef}>
          {/* Overline label */}
          <p className="font-body text-[11px] font-semibold tracking-[0.22em] text-red uppercase mb-8">
            Tentang Kami
          </p>

          {/* Decorative opening guillemet */}
          <div className="relative">
            <span
              className="absolute -top-5 -left-1 font-display leading-none text-red/15 select-none pointer-events-none"
              style={{ fontSize: '7rem' }}
              aria-hidden="true"
            >
              &ldquo;
            </span>

            <blockquote className="relative font-display italic leading-[1.18] text-ink text-[2rem] sm:text-[2.4rem] md:text-[2.6rem] lg:text-[3rem]">
              Setiap lipatan menyimpan cerita.
            </blockquote>
          </div>

          {/* Red rule */}
          <div className="mt-10 h-px w-14 bg-red" />

          {/* Sub-attribution under the rule */}
          <p className="mt-4 font-body text-xs text-ink/40 tracking-wide">
            Sejak 2017 · Rumah kami, meja makan Anda
          </p>
        </div>

        {/* ── Right: brand story + signature ── */}
        <div ref={rightRef} className="flex flex-col gap-6">
          <div className="space-y-5">
            <p className="font-body text-[0.95rem] leading-[1.75] text-ink/80">
              Dim Makan lahir dari dapur kecil di rumah kami — tempat kami belajar
              bahwa dimsum yang baik tidak bisa terburu-buru. Satu per satu, dengan
              tangan, dengan sabar.
            </p>

            <p className="font-body text-[0.95rem] leading-[1.75] text-ink/80">
              Setiap bakpao, hakau, dan siomay kami buat sendiri karena mesin tidak
              bisa merasakan kapan adonan sudah sempurna. Kami mengukus segar tiap
              pagi dan tidak pernah menyimpan yang sudah lewat hari — prinsip yang
              kami pegang sejak hari pertama.
            </p>

            <p className="font-body text-[0.95rem] leading-[1.75] text-ink/80">
              Terima kasih sudah mempercayakan momen makan siang, arisan, dan makan
              bersama keluarga Anda kepada kami. Ini bukan sekadar bisnis — ini cara
              kami berbagi cinta lewat setiap lipatan.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-muted mt-2" />

          {/* Signature block */}
          <div className="flex flex-col gap-1">
            <FounderSignature />
            <p className="font-body text-xs text-ink/40 tracking-wide mt-1">
              Ibu Sri Wahyuni · Pendiri, Dim Makan
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const NAV_LINKS = [
  { label: 'Menu', href: '#menu' },
  { label: 'Tentang Kami', href: '#tentang-kami' },
  { label: 'Catering', href: '#catering' },
  { label: 'Pre-order', href: '#pre-order' },
  { label: 'Cara Order', href: '#cara-order' },
] as const

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const scrollTo = (href: string) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
      return
    }
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' })
    }
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setIsOpen(false)
    scrollTo(href)
  }

  return (
    <nav
      className={[
        'sticky top-0 z-50 transition-[border-color,background-color] duration-300',
        scrolled
          ? 'bg-cream/90 backdrop-blur-md border-b border-muted'
          : 'bg-cream',
      ].join(' ')}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a
          href="#"
          onClick={(e) => handleLinkClick(e, '#')}
          className="font-display text-2xl font-bold text-red tracking-tight select-none"
        >
          Dim Makan
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => handleLinkClick(e, href)}
                className={[
                  'relative font-body text-sm font-medium text-ink',
                  'transition-colors duration-200 hover:text-red',
                  'after:absolute after:bottom-[-3px] after:left-0',
                  'after:h-px after:w-0 after:bg-red after:rounded-full',
                  'after:transition-[width] after:duration-300',
                  'hover:after:w-full',
                ].join(' ')}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-drawer"
          className="md:hidden relative flex flex-col justify-center items-center w-10 h-10 gap-[5px] cursor-pointer"
        >
          <span
            className={[
              'block w-[22px] h-[1.5px] bg-ink rounded-full',
              'transition-all duration-300 ease-in-out origin-center',
              isOpen ? 'translate-y-[6.5px] rotate-45' : '',
            ].join(' ')}
          />
          <span
            className={[
              'block w-[22px] h-[1.5px] bg-ink rounded-full',
              'transition-all duration-300 ease-in-out',
              isOpen ? 'opacity-0 scale-x-0' : '',
            ].join(' ')}
          />
          <span
            className={[
              'block w-[22px] h-[1.5px] bg-ink rounded-full',
              'transition-all duration-300 ease-in-out origin-center',
              isOpen ? '-translate-y-[6.5px] -rotate-45' : '',
            ].join(' ')}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            key="mobile-drawer"
            initial={reducedMotion ? {} : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reducedMotion ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden md:hidden border-t border-muted"
          >
            <ul
              className="flex flex-col px-6 py-5 gap-1"
              role="list"
              onClick={() => setIsOpen(false)}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => handleLinkClick(e, href)}
                    className={[
                      'block font-body text-base font-medium text-ink',
                      'hover:text-red transition-colors duration-200',
                      'py-2.5 border-b border-muted/60 last:border-0',
                    ].join(' ')}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

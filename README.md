# Dim Makan — Landing Page

Dim Makan is a single-page marketing site for a handmade dimsum home business based in Jakarta. The page showcases the menu, catering packages, pre-order/frozen options, and ordering channels (WhatsApp, GoFood, GrabFood), with a fully animated experience built on GSAP ScrollTrigger, Framer Motion, and a Three.js steam-particle canvas in the hero.

## Tech Stack

- **React 19** + **TypeScript 6** (strict)
- **Vite 8** + `@vitejs/plugin-react`
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **GSAP 3** (ScrollTrigger, ScrollToPlugin, TextPlugin, Flip)
- **Framer Motion 12**
- **React Three Fiber 9** + **Three.js 0.184**
- **oxlint** for linting

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (HMR)
npm run build        # Type-check + production build → dist/
npm run preview      # Serve the dist/ build locally
npm run lint         # Run oxlint
```

## Content Placeholders

The following values are stubbed and must be replaced before going live:

| Location | File | What to fill in |
|---|---|---|
| WhatsApp CTA (Hero) | `src/components/Hero.tsx:281` | `https://wa.me/<phone>` — add the business WhatsApp number |
| WhatsApp CTA (HowToOrder) | `src/components/HowToOrder.tsx:107` | `https://wa.me/<phone>` — same number |
| WhatsApp CTA (Catering, ×3 packages) | `src/components/Catering.tsx:257` | `https://wa.me/<phone>` |
| WhatsApp CTA (PreorderFrozen, ×2) | `src/components/PreorderFrozen.tsx:267,333` | `https://wa.me/<phone>` |
| WhatsApp CTA (Footer) | `src/components/Footer.tsx:81` | `https://wa.me/<phone>` |
| Pickup address | `src/components/HowToOrder.tsx:141` | Replace `Jl. [PLACEHOLDER: alamat]` with real street address |
| Instagram profile URL | `src/components/Footer.tsx:167` | Replace `https://instagram.com/` with `https://instagram.com/dimmakan` (or actual handle) |
| Instagram handle text | `src/components/Footer.tsx:177` | Confirm `@dimmakan` matches the actual Instagram handle |
| GoFood store URL | Multiple files | Replace `https://gofood.co.id/` with the actual store deep-link |
| GrabFood store URL | Multiple files | Replace `https://grabfood.com/` with the actual store deep-link |
| Founder signature name | `src/components/TentangKami.tsx:161` | Confirm "Ibu Sri Wahyuni" is correct |
| Copyright year | `src/components/Footer.tsx:182` | Update `© 2025` each year, or make it dynamic |

import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap'

import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import TentangKami from '@/components/TentangKami'
import Menu from '@/components/Menu'
import Catering from '@/components/Catering'
import PreorderFrozen from '@/components/PreorderFrozen'
import HowToOrder from '@/components/HowToOrder'
import WhyHandmade from '@/components/WhyHandmade'
import Galeri from '@/components/Galeri'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

function App() {
  useEffect(() => {
    // Explicitly target window as the scroller (GSAP's default, but stated clearly
    // so any nested custom scroll containers don't inherit a wrong default).
    ScrollTrigger.defaults({ scroller: window })

    return () => {
      // Kill all ScrollTrigger instances when the app unmounts.
      // Individual components clean up their own via gsap.context().revert();
      // this is the final safety net (important during HMR and React StrictMode).
      ScrollTrigger.killAll()
    }
  }, [])

  return (
    <div id="app">
      {/*
        Section IDs must match Navbar NAV_LINKS hrefs:
          #menu          ← Menu.tsx
          #tentang-kami  ← TentangKami.tsx
          #catering      ← Catering.tsx
          #pre-order     ← PreorderFrozen.tsx   (fixed from "preorder")
          #cara-order    ← HowToOrder.tsx
      */}
      <Navbar />
      <Hero />
      <TentangKami />
      <Menu />
      <Catering />
      <PreorderFrozen />
      <HowToOrder />
      <WhyHandmade />
      <Galeri />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default App

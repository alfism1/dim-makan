import { useEffect, useState } from 'react'

export function useReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)'

  const [prefersReduced, setPrefersReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return prefersReduced
}

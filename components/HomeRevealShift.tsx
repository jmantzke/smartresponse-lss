'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { revealTrigger } from '@/components/headerReveal'

// Home-page content shift that runs in sync with the scroll-in GlobalHeader.
// Once the page scrolls past the reveal threshold (revealTrigger, shared with
// the header + rail glyph), the wrapped content translates by `shift` — used to
// slide the left-rail text up under the descended header and to nudge the main
// content. It reverses when the header retracts. Put transition classes in
// `className` so both the descend and retract directions animate; only the
// translate utility(s) live in `shift`.
export default function HomeRevealShift({
  children,
  className,
  shift,
}: {
  children: ReactNode
  className?: string
  shift: string
}) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const onScroll = () =>
      setRevealed(window.scrollY > 0 && window.scrollY >= revealTrigger() - 1)
    onScroll() // sync initial state (e.g. loaded already scrolled)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll) // trigger depends on viewport/doc height
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      className={[className, revealed ? shift : '']
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

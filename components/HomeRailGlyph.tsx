'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { REVEAL_AT } from '@/components/headerReveal'

// Home page left-rail Enfineitz glyph. It cross-fades with the scroll-in
// GlobalHeader: once the page scrolls past the header reveal threshold
// (REVEAL_AT) the glyph fades out (so it doesn't compete with the header brand
// sliding in); when the header retracts — via scroll-to-top or a header click —
// the glyph fades back in. Uses the same easing/duration as the header slide.
export default function HomeRailGlyph({ className }: { className?: string }) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY >= REVEAL_AT)
    onScroll() // sync initial state (e.g. when loaded already scrolled)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Image
      src="/icons/efz-glyph.svg"
      alt="Enfineitz"
      width={124}
      height={121}
      aria-hidden={hidden}
      className={[
        'transition-opacity duration-[250ms] ease-[cubic-bezier(0.33,1,0.68,1)]',
        hidden ? 'opacity-0' : 'opacity-100',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CornerDecoration from '@/components/CornerDecoration'
import { revealTrigger } from '@/components/headerReveal'

// ─── GlobalHeader ─────────────────────────────────────────────────────────────
// Horizontal header bar used by the Article and Case Study templates.
// Layout: [home-link glyph · "ENFINEITZ" breadcrumb] ← justify-between → [corner]
//
// Hub-and-spoke navigation: the glyph + "ENFINEITZ" label are a single brand
// component (Figma GlobalBrand 956:3766) that links back to the hub (home) and
// shares one hover state — the two-tone glyph crossfades to an all-white mark
// and the label shifts --crumb-rest (#ffa632) → --crumb-hover (#fff0c4).
//
// Sticky: the header is pinned to the top of the viewport (page content scrolls
// behind it on its page-alt background). The bottom hairline only appears once
// the page has scrolled — mirroring the Figma Scroll=True/False variants
// (Scroll=False hides the border, Scroll=True shows border-b #2a2f32).
//
// Responsive (matches Figma template/article/biography XS→XL):
//   • header padding:  py-12 (xs) · py-16 (sm) · py-24 (md+)
//   • corner deco:     30 (xs) · 32 (sm) · 40 (md/lg) · 48 (xl)
//
// Figma: global-header (213:349) · brand (956:3766) · scroll variants (169:240)
//
// `revealOnScroll` (home page): instead of being sticky, the header is fixed
// and hidden just above the viewport. It slides in with easing once the page
// has scrolled past REVEAL_AT (200px, see components/headerReveal.ts). Clicking
// the brand — or anywhere on the header — smoothly scrolls back to the top, and
// the header retracts off-screen as the scroll returns below the threshold.
// Figma could not prototype this (the interaction/show-header token was the
// placeholder for it). The home page's left-rail glyph shares REVEAL_AT to
// cross-fade in sync (fades out as the header appears, back in on retract).

export default function GlobalHeader({
  revealOnScroll = false,
}: {
  revealOnScroll?: boolean
} = {}) {
  const [scrolled, setScrolled] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 0)
      // Reveal past the threshold; the 1px tolerance lets short pages (where the
      // trigger collapses to the page bottom) still fire on fractional scroll.
      if (revealOnScroll) setRevealed(y > 0 && y >= revealTrigger() - 1)
    }
    onScroll() // sync initial state (e.g. when loaded already scrolled)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll) // trigger depends on viewport/doc height
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [revealOnScroll])

  // Reveal mode: clicking the header scrolls back to the top; the scroll
  // listener then retracts the header once y drops below the threshold.
  const scrollToTop = () => {
    if (!revealOnScroll || !revealed) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header
      onClick={revealOnScroll ? scrollToTop : undefined}
      className={[
        revealOnScroll
          ? // Slide the header down from the top with a smooth, brief ease-out
            // (easeOutCubic): quick to start, gently decelerating, no overshoot.
            // The same transition runs in reverse when the header retracts.
            // NB: Tailwind v4 `-translate-y-*` uses the CSS `translate` property
            // (not the `transform` shorthand), so we transition `translate`.
            'fixed top-0 left-0 right-0 z-30 cursor-pointer transition-[translate,border-color] duration-[250ms] ease-[cubic-bezier(0.33,1,0.68,1)]'
          : 'sticky top-0 z-30 transition-colors duration-150',
        // Reveal mode starts hidden above the viewport and slides to y=0.
        revealOnScroll && !revealed ? '-translate-y-full' : 'translate-y-0',
        'flex items-start justify-between w-full shrink-0',
        'bg-[var(--surface-page-alt)]',
        // Keep a 1px border always to avoid layout shift; toggle its color so
        // the hairline only shows once scrolled (Scroll=False → transparent).
        'border-b',
        scrolled ? 'border-[#2a2f32]' : 'border-transparent',
      ].join(' ')}
      aria-label="Site header"
    >
      {/* Left: home link combining the glyph + brand label into one hover group.
          The whole group (efz-glyph + ENFINEITZ label) links home. In reveal
          mode we suppress navigation so the click just scrolls to the top. */}
      <Link
        href="/"
        aria-label="Enfineitz home"
        onClick={revealOnScroll ? (e) => e.preventDefault() : undefined}
        className="group flex items-center gap-8 px-24 py-12 sm:py-16 md:py-24"
      >
        {/* Glyph: two-tone rest mark crossfades to an all-white mark on hover */}
        <span className="relative shrink-0 h-[39px] w-[40px]">
          <Image
            src="/icons/efz-glyph.svg"
            alt=""
            width={40}
            height={39}
            className="absolute left-0 top-0 transition-opacity duration-150 group-hover:opacity-0"
          />
          <Image
            src="/icons/efz-glyph-hover.svg"
            alt=""
            width={40}
            height={39}
            className="absolute left-0 top-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          />
        </span>
        <span className="font-display font-[600] text-[18px] uppercase tracking-[2px] text-[var(--crumb-rest)] transition-colors duration-150 group-hover:text-[var(--crumb-hover)] whitespace-nowrap">
          Enfineitz
        </span>
      </Link>

      {/* Right: top-right corner decoration */}
      <CornerDecoration
        position="top-right"
        className="size-30 sm:size-32 md:size-40 xl:size-48 shrink-0"
      />
    </header>
  )
}

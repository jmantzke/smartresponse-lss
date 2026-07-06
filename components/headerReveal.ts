// Scroll distance (px) at which the home page GlobalHeader slides in and the
// left-rail glyph cross-fades out. The threshold is breakpoint-specific (the
// smaller layouts descend a little earlier). Kept in its own module so the
// header, rail glyph, and left-rail content shift share one source of truth
// without a React component re-exporting a plain value (breaks Fast Refresh).
//   XS (<480px) 170 · SM (480–767) 178 · MD/LG/XL (≥768) 194
export const REVEAL_AT = 194 // MD / LG / XL (also the SSR default)

function thresholdForWidth(width: number): number {
  if (width < 480) return 170 // XS
  if (width < 768) return 178 // SM
  return 194 // MD / LG / XL
}

// Effective scroll position (px) that triggers the reveal. On pages too short
// to scroll a full threshold px (e.g. the home grid on a tall desktop window),
// fall back to the page's maximum scroll so the header/glyph stay reachable at
// the bottom instead of never appearing.
export function revealTrigger(): number {
  if (typeof window === 'undefined') return REVEAL_AT
  const threshold = thresholdForWidth(window.innerWidth)
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight
  return Math.min(threshold, Math.max(0, maxScroll))
}

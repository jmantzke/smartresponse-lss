// Scroll distance (px) at which the home page GlobalHeader slides in and the
// left-rail glyph cross-fades out. Kept in its own module so both the header
// and the rail glyph share one source of truth without a React component
// re-exporting a plain value (which breaks Fast Refresh).
export const REVEAL_AT = 200

// Effective scroll position (px) that triggers the reveal. On pages too short
// to scroll a full REVEAL_AT px (e.g. the home grid on a tall desktop window),
// fall back to the page's maximum scroll so the header/glyph stay reachable at
// the bottom instead of never appearing.
export function revealTrigger(): number {
  if (typeof window === 'undefined') return REVEAL_AT
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight
  return Math.min(REVEAL_AT, Math.max(0, maxScroll))
}

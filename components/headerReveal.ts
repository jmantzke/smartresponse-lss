// Scroll distance (px) at which the home page GlobalHeader slides in and the
// left-rail glyph cross-fades out. Kept in its own module so both the header
// and the rail glyph share one source of truth without a React component
// re-exporting a plain value (which breaks Fast Refresh).
export const REVEAL_AT = 90

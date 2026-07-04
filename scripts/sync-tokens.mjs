#!/usr/bin/env node
/**
 * sync-tokens.mjs
 * Reads tokens/enfineitz-tokens.json (Token Studio W3C export format)
 * and regenerates app/globals.css and tailwind.config.js.
 *
 * Usage:  node scripts/sync-tokens.mjs
 * Or add to package.json scripts:  "tokens": "node scripts/sync-tokens.mjs"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Load token file ────────────────────────────────────────────────────────

const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens/enfineitz-tokens.json'), 'utf8'));

// ─── Flatten all tokens into a dot-path map ─────────────────────────────────
// e.g. "global/global.colors.primary.100" → { $value: "#fff8e3", $type: "color" }

function flatten(obj, prefix = '') {
  const out = {};
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && '$value' in val) {
      out[fullKey] = val;
    } else if (val && typeof val === 'object') {
      Object.assign(out, flatten(val, fullKey));
    }
  }
  return out;
}

const flat = flatten(raw);

// ─── Resolve {path.to.ref} references (one level deep) ──────────────────────

// Token Studio refs use the *group name* within the file, not the full path.
// e.g. {colors.primary.600} lives under "global/global.colors.primary.600"
// We build a short-path lookup that strips the top-level group prefix.

function buildShortMap(flatMap) {
  const short = {};
  for (const [fullKey, token] of Object.entries(flatMap)) {
    // strip "global/global." and "color roles/dark mode." etc. prefixes
    const shortKey = fullKey.replace(/^[^.]+\/[^.]+\./, '');
    short[shortKey] = token;
  }
  return short;
}

const shortMap = buildShortMap(flat);

function resolveRef(ref, depth = 0) {
  if (depth > 8) return ref; // guard against circular refs
  const match = String(ref).match(/^\{(.+)\}$/);
  if (!match) return ref;
  const key = match[1];
  const token = shortMap[key];
  if (!token) return ref; // unresolvable — return as-is
  const val = token.$value;
  if (typeof val === 'string' && val.startsWith('{')) return resolveRef(val, depth + 1);
  return val;
}

function resolve(token) {
  const v = token.$value;
  if (typeof v === 'string' && v.startsWith('{')) return resolveRef(v);
  return v;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function px(n) { return `${n}px`; }
function em(n) { return `${n}em`; }

// Letter-spacing from the token file is stored as integer px offset.
// CSS letter-spacing for display fonts is better expressed as em.
// Figma's convention: negative = tighter, positive = looser, unit is px at 16px base.
// We convert to em by dividing by 100 (Figma tracks it per-100px, so 1px ≈ 0.01em).
function lsToEm(val) {
  if (val === 0) return '0';
  return `${(val / 100).toFixed(4).replace(/\.?0+$/, '')}em`;
}

// ─── Extract primitive colours ───────────────────────────────────────────────

const G = raw['global/global'];
const colors = G.colors;

function colorScale(group) {
  return Object.fromEntries(
    Object.entries(group)
      .filter(([, v]) => v && '$value' in v)
      .map(([k, v]) => [k, v.$value])
  );
}

const primary   = colorScale(colors.primary);
const neutral   = colorScale(colors.neutral);
const secondary = colorScale(colors.secondary);

// ─── Extract spacing primitives ─────────────────────────────────────────────

const spacingPrim = G.spacing.primitive;
const spacingValues = {};
for (const [k, v] of Object.entries(spacingPrim)) {
  if (v && '$value' in v) spacingValues[String(v.$value)] = v.$value;
}
// Build sorted unique spacing scale
const spacingScale = [...new Set(
  Object.values(spacingPrim)
    .filter(v => v && '$value' in v)
    .map(v => v.$value)
)].sort((a, b) => a - b);

// ─── Extract border radii ────────────────────────────────────────────────────

const radii = G.spacing.radii;
const borderRadius = {
  'none':  px(resolve(radii.zero)),
  'xs':    px(resolve(radii.xs)),
  'sm':    px(resolve(radii.sm)),
  'msm':   px(resolve(radii.msm)),
  'md':    px(resolve(radii.md)),
  'lg':    px(resolve(radii.lg)),
  'round': `${radii.round.$value}px`,
};

// ─── Extract breakpoints ─────────────────────────────────────────────────────

const bp = G.breakpoints.screen;

// ─── Extract typography scale ────────────────────────────────────────────────

const typo = G.typography;
// fontSize scale from typo.size (resolved primitives)
function typoScale(key) {
  const t = typo[key] || {};
  return {
    fontSize:      t.fontSize?.$value ?? null,
    fontWeight:    t.fontWeight?.$value ?? null,
    lineHeight:    t.lineHeight?.$value ?? null,
    letterSpacing: t.letterSpacing?.$value ?? 0,
  };
}

const scales = {
  label:    typoScale('label'),
  caption:  typoScale('caption'),
  'body sm': typoScale('body sm'),
  body:     typoScale('body'),
  'body lg': typoScale('body lg'),
  h5:       typoScale('h5'),
  h4:       typoScale('h4'),
  h3:       typoScale('h3'),
  h2:       typoScale('h2'),
  h1:       typoScale('h1'),
  hero2:    typoScale('hero2'),
  hero1:    typoScale('hero1'),
};

// ─── Extract semantic colour roles ───────────────────────────────────────────

const dark  = raw['color roles/dark mode'];
const light = raw['color roles/light mode'];

function resolveColor(tokenPath, modeObj) {
  // Walk dot-separated path into the mode object
  const parts = tokenPath.split('.');
  let cur = modeObj;
  for (const p of parts) {
    if (!cur || !cur[p]) return null;
    cur = cur[p];
  }
  if (!cur || !('$value' in cur)) return null;
  return resolveRef(cur.$value);
}

// Map our CSS var names → token paths in the mode objects
const semanticMap = {
  '--surface-page':       ['surface.page',     'surface.page'],
  '--surface-1':          ['surface.surface-1','surface.surface-1'],
  '--surface-2':          ['surface.surface-2','surface.surface-2'],
  '--surface-3':          ['surface.surface-3','surface.surface-3'],
  '--surface-page-alt':   ['surface.page-alt', 'surface.page-alt'],
  '--surface-card-rest':  ['surface.card.rest','surface.card.rest'],
  '--surface-card-hover': ['surface.card.hover','surface.card.hover'],

  '--text-body':            ['typography.body',           'typography.body'],
  '--text-header':          ['typography.header',         'typography.header'],
  '--text-header-reversed': ['typography.header-reversed','typography.header-reversed'],
  '--text-caption':         ['typography.caption',        'typography.caption'],
  '--text-slash':           ['typography.slash',          'typography.slash'],
  '--text-brand-enfineitz': ['typography.brand.enfineitz','typography.brand.enfineitz'],
  '--text-brand-stil':      ['typography.brand.stil',     'typography.brand.stil'],

  '--border-card-rest':     ['border.card.rest',  'border.card.rest'],
  '--border-card-hover':    ['border.card.hover', 'border.card.hover'],

  '--accent-decorative-corner': ['accent.decorative-corner','accent.decorative-corner'],

  '--link-rest':    ['interaction.link.rest',        'interaction.link.rest'],
  '--link-hover':   ['interaction.link.hover',       'interaction.link.hover'],
  '--link-active':  ['interaction.link.active',      'interaction.link.active'],
  '--crumb-rest':   ['interaction.breadcrumb.rest',  'interaction.breadcrumb.rest'],
  '--crumb-static': ['interaction.breadcrumb.static','interaction.breadcrumb.static'],
  '--crumb-hover':  ['interaction.breadcrumb.hover', 'interaction.breadcrumb.hover'],
  '--crumb-active': ['interaction.breadcrumb.active','interaction.breadcrumb.active'],
};

function resolveSemanticColor(cssVar, modeKey) {
  const [darkPath, lightPath] = semanticMap[cssVar];
  const path = modeKey === 'dark' ? darkPath : lightPath;
  const modeObj = modeKey === 'dark' ? dark : light;
  const val = resolveColor(path, modeObj);
  // if resolveColor failed (token not in this mode), fall back to primitive lookup
  if (!val) return null;
  return val;
}

// ─── Build globals.css ───────────────────────────────────────────────────────

function colorEntry(cssVar, mode) {
  const val = resolveSemanticColor(cssVar, mode);
  return val ? `  ${cssVar}: ${val};` : null;
}

function buildCssVarBlock(mode) {
  return Object.keys(semanticMap)
    .map(v => colorEntry(v, mode))
    .filter(Boolean)
    .join('\n');
}

// Primitive colour entries for :root
function primBlock(scale, prefix) {
  return Object.entries(scale)
    .map(([k, v]) => `  --color-${prefix}-${k}: ${v};`)
    .join('\n');
}

const css = `@import "tailwindcss";
@config '../tailwind.config.js';

/* Bridge next/font variable to Tailwind's font utilities */
@theme inline {
  --font-body: var(--font-ibm-plex-sans), "Helvetica", "Arial", sans-serif;
}

/* ─── Font stacks ──────────────────────────────────────────────────────────────
   Headers (H1–H5): Heimat Stencil → IBM Plex Sans → Helvetica → Arial → sans-serif
   Everything else: IBM Plex Sans → Helvetica → Arial → sans-serif                */
@layer base {
  body {
    font-family: var(--font-ibm-plex-sans), "Helvetica", "Arial", sans-serif;
  }
  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: "heimat-stencil", var(--font-ibm-plex-sans), "Helvetica", "Arial", sans-serif;
  }
}

/* ─── Primitive color tokens (auto-generated from tokens/enfineitz-tokens.json) ── */
:root {
  /* Primary */
${primBlock(primary, 'primary')}

  /* Neutral */
${primBlock(neutral, 'neutral')}

  /* Secondary */
${primBlock(secondary, 'secondary')}
}

/* ─── Semantic color roles — light mode ─────────────────────────────────────── */
:root {
${buildCssVarBlock('light')}
}

/* ─── Semantic color roles — dark mode ──────────────────────────────────────── */
.dark {
${buildCssVarBlock('dark')}
}
`;

// ─── Hand-authored CSS footer (preserved across regenerations) ───────────────
// These rules are NOT derived from tokens. They are appended verbatim after the
// generated token blocks so `npm run tokens` no longer wipes them.
const cssFooter = `
/* ─── Social icons ───────────────────────────────────────────────────────────
   Rendered as CSS masks so the glyph is painted with \`currentColor\`, letting
   each icon inherit the link text color in every state (rest/hover) — matching
   the Figma navigation component where icon and label share the
   interaction/link color. */
.nav-social-icon {
  display: block;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  background-color: currentColor;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: contain;
  mask-size: contain;
}
.nav-social-icon--linkedin {
  -webkit-mask-image: url('/icons/linkedin.svg');
  mask-image: url('/icons/linkedin.svg');
}
.nav-social-icon--email {
  -webkit-mask-image: url('/icons/email.svg');
  mask-image: url('/icons/email.svg');
}
.nav-social-icon--behance {
  -webkit-mask-image: url('/icons/behance.svg');
  mask-image: url('/icons/behance.svg');
}
.nav-social-icon--soundcloud {
  -webkit-mask-image: url('/icons/soundcloud.svg');
  mask-image: url('/icons/soundcloud.svg');
}

/* ─── Page background ─────────────────────────────────────────────────────────
   Radial gradient from neutral.700 → neutral.900, anchored near the top-left. */
.page-gradient {
  background-image: radial-gradient(
    farthest-corner at 200px 0px,
    var(--color-neutral-700) 54%,
    var(--color-neutral-900) 100%
  );
}

/* ─── Layout tokens (hand-authored — not generated by sync-tokens) ───────────
   Right-side clearance reserved on the home identity paragraph so its wrapped
   lines clear the decorative top-right corner that hangs off the wordmark. */
:root {
  --identity-corner-clearance: 15px;
}
`;

// ─── Build tailwind.config.js ────────────────────────────────────────────────

// Font size scale: [size, { lineHeight, letterSpacing }]
function fsSeries() {
  const nameMap = {
    'label':    'label',
    'caption':  'caption',
    'body sm':  'body-sm',
    'body':     'body',
    'body lg':  'body-lg',
    'h5':       'h5',
    'h4':       'h4',
    'h3':       'h3',
    'h2':       'h2',
    'h1':       'h1',
    'hero2':    'hero2',
    'hero1':    'hero1',
  };
  return Object.entries(nameMap)
    .map(([tokenKey, twKey]) => {
      const s = scales[tokenKey];
      if (!s || !s.fontSize) return null;
      const lh = s.lineHeight ? `'${px(s.lineHeight)}'` : "'normal'";
      const ls = s.letterSpacing !== 0 ? `'${lsToEm(s.letterSpacing)}'` : "'0'";
      return `        '${twKey}': ['${px(s.fontSize)}', { lineHeight: ${lh}, letterSpacing: ${ls} }],`;
    })
    .filter(Boolean)
    .join('\n');
}

// Spacing scale: all unique primitive values
function spacingSeries() {
  return spacingScale
    .map(v => `        '${v}': '${px(v)}',`)
    .join('\n');
}

// Breakpoints
const screens = `      xs: '${px(bp['xs-min-width'].$value)}',
      sm: '${px(bp['sm-min-width'].$value)}',
      md: '${px(bp['md-min-width'].$value)}',
      lg: '${px(bp['lg-min-width'].$value)}',
      xl: '${px(bp['xl-min-width'].$value)}',`;

const tailwind = `/** @type {import('tailwindcss').Config} */
/* AUTO-GENERATED — do not edit by hand. Run: node scripts/sync-tokens.mjs */

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  darkMode: 'class',

  theme: {
    screens: {
${screens}
    },

    extend: {
      colors: {
        primary: {
${Object.keys(primary).map(k => `          ${k}: 'var(--color-primary-${k})',`).join('\n')}
        },
        neutral: {
${Object.keys(neutral).map(k => `          ${k}: 'var(--color-neutral-${k})',`).join('\n')}
        },
        secondary: {
${Object.keys(secondary).map(k => `          ${k}: 'var(--color-secondary-${k})',`).join('\n')}
        },
        white: '#ffffff',
        black: '#000000',

        surface: {
          page:         'var(--surface-page)',
          1:            'var(--surface-1)',
          2:            'var(--surface-2)',
          3:            'var(--surface-3)',
          'page-alt':   'var(--surface-page-alt)',
          'card-rest':  'var(--surface-card-rest)',
          'card-hover': 'var(--surface-card-hover)',
        },
        text: {
          body:              'var(--text-body)',
          header:            'var(--text-header)',
          caption:           'var(--text-caption)',
          'header-reversed': 'var(--text-header-reversed)',
          slash:             'var(--text-slash)',
        },
        border: {
          'card-rest':  'var(--border-card-rest)',
          'card-hover': 'var(--border-card-hover)',
        },
        accent: {
          'decorative-corner': 'var(--accent-decorative-corner)',
        },
        interaction: {
          'link-rest':    'var(--link-rest)',
          'link-hover':   'var(--link-hover)',
          'link-active':  'var(--link-active)',
          'crumb-rest':   'var(--crumb-rest)',
          'crumb-static': 'var(--crumb-static)',
          'crumb-hover':  'var(--crumb-hover)',
          'crumb-active': 'var(--crumb-active)',
        },
      },

      fontFamily: {
        display: ['heimat-stencil', 'var(--font-ibm-plex-sans)', 'Helvetica', 'Arial', 'sans-serif'],
        body:    ['var(--font-ibm-plex-sans)', 'Helvetica', 'Arial', 'sans-serif'],
      },

      fontSize: {
        // Auto-generated from tokens/enfineitz-tokens.json
${fsSeries()}
      },

      fontWeight: {
        'display-extralight': '200',
        'display-light':      '300',
        'display-regular':    '400',
        'display-medium':     '500',
        'display-bold':       '600',
        'body-regular':       '400',
        'body-medium':        '500',
        'body-bold':          '700',
      },

      lineHeight: {
        'none':    '1',
        'tight':   '1.1',
        'snug':    '1.25',
        'normal':  '1.5',
        'relaxed': '1.625',
        'loose':   '2',
      },

      letterSpacing: {
        'tighter': '-0.04em',
        'tight':   '-0.02em',
        'normal':  '0',
        'wide':    '0.01em',
        'wider':   '0.05em',
        'widest':  '0.1em',
      },

      spacing: {
        // Auto-generated from tokens/enfineitz-tokens.json spacing primitives
${spacingSeries()}
      },

      borderRadius: {
${Object.entries(borderRadius).map(([k, v]) => `        '${k}': '${v}',`).join('\n')}
      },

      width: {
        'card':       '300px',
        'badge-cert': '70px',
        'nav-col-xl': '340px',
      },
      height: {
        'card':       '180px',
        'badge-cert': '70px',
        'screen-ref': '900px',
      },

      maxWidth: {
        'case-study': '1200px',
        'body':       '1376px',
        'caption':    '800px',
        'image':      '1000px',
      },
    },
  },

  plugins: [],
};
`;

// ─── Write files ─────────────────────────────────────────────────────────────

const cssPath      = path.join(ROOT, 'app/globals.css');
const tailwindPath = path.join(ROOT, 'tailwind.config.js');

fs.writeFileSync(cssPath, css + cssFooter, 'utf8');
console.log(`✓ Wrote ${path.relative(ROOT, cssPath)}`);

fs.writeFileSync(tailwindPath, tailwind, 'utf8');
console.log(`✓ Wrote ${path.relative(ROOT, tailwindPath)}`);

console.log('\nDone. Run `npm run dev` or `npm run build` to apply changes.');

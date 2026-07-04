import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import caseStudies from '@/content/case-studies.json'
import bioData from '@/content/bio.json'
import CaseStudyCard from '@/components/CaseStudyCard'
import Navigation from '@/components/Navigation'
import CornerDecoration from '@/components/CornerDecoration'
import CurrentYear from '@/components/CurrentYear'
import GlobalHeader from '@/components/GlobalHeader'
import HomeRailGlyph from '@/components/HomeRailGlyph'

// ─── Home Page ─────────────────────────────────────────────────────────────────
// Hub page — card grid of all case studies. Rebuilt to match the Figma
// "template-home" responsive set:
//   XS 904:2309 · SM 904:1636 · MD 904:1546 · LG 902:2007 · XL 904:1382
//
// Layout switches at the `md` breakpoint (768px):
//   • below md → stacked header (inline brand · summary · horizontal nav)
//   • md and up → two-column (left nav rail + right main content)

const IDENTITY =
  'A curated selection of UX case studies from Jürgen Mantzke, Product Designer'

const publishedStudies = caseStudies.filter((study) => study.published)

export const metadata: Metadata = {
  title: 'UX Case Studies | Jurgen Mantzke',
  description:
    'UX case studies by Jurgen Mantzke, focused on transforming complex domains into clear, direction‑setting product foundations.',
  openGraph: {
    title: 'UX Case Studies | Jurgen Mantzke',
    description:
      'UX case studies by Jurgen Mantzke, focused on transforming complex domains into clear, direction‑setting product foundations.',
    url: 'https://case-studies.enfineitz.com',
    images: [{ url: '/og/placeholder.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UX Case Studies | Jurgen Mantzke',
    description:
      'UX case studies by Jurgen Mantzke, focused on transforming complex domains into clear, direction‑setting product foundations.',
    images: ['/og/placeholder.png'],
  },
  alternates: {
    canonical: 'https://case-studies.enfineitz.com',
  },
}

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen page-gradient">
      <GlobalHeader revealOnScroll />
      <StackedLayout />
      <TwoColumnLayout />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// STACKED LAYOUT — xs / sm (below md)
// ════════════════════════════════════════════════════════════════════════════

function StackedLayout() {
  return (
    <div className="relative flex flex-col gap-8 items-center md:hidden">
      {/* Decorative page corners */}
      <CornerDecoration
        position="top-left"
        className="absolute top-0 left-0 size-30 sm:size-32 pointer-events-none z-10"
      />
      <CornerDecoration
        position="top-right"
        className="absolute top-[76px] sm:top-[119px] right-0 size-30 sm:size-32 pointer-events-none z-10"
      />
      <CornerDecoration
        position="bottom-right"
        className="absolute bottom-0 right-0 size-30 sm:size-32 pointer-events-none z-10"
      />

      {/* ── Header ── */}
      <header className="flex flex-col gap-24 w-full px-8 py-24 sm:p-16">
        {/* Brand: glyph + wordmark + slogan */}
        <div className="flex gap-4 sm:gap-16 items-start">
          <Glyph className="w-[32px] h-[31px] sm:w-[60px] sm:h-[58px] shrink-0" />
          <div className="flex flex-col gap-4 items-start">
            <Wordmark
              className={[
                'gap-2 sm:gap-4',
                'text-[32px] sm:text-[48px] leading-none tracking-tighter',
                'font-[600] sm:font-[200]',
              ].join(' ')}
            />
            <p
              className={[
                'font-body font-normal',
                'text-[11px] sm:text-[14px] leading-[16px] sm:leading-[30px]',
                'text-[var(--text-caption)]',
                'max-w-[17.5rem] sm:max-w-none',
              ].join(' ')}
            >
              {IDENTITY}
            </p>
          </div>
        </div>

        {/* Brand summary */}
        <div className="w-full px-12 sm:px-24">
          <p
            className={[
              'font-body font-medium',
              'text-[12px] leading-[22px] tracking-normal',
              'text-[var(--text-body)]',
            ].join(' ')}
          >
            {bioData.brandSummary}
          </p>
        </div>

        {/* Horizontal navigation: page links | contact links */}
        <div className="flex flex-wrap gap-12 items-start w-full">
          <nav
            className="flex flex-col gap-16 items-start flex-1 min-w-[8.75rem]"
            aria-label="Site navigation"
          >
            <PageLink href="/bio">About me</PageLink>
            <PageLink href="/enfineitz">What is Enfineitz?</PageLink>
          </nav>
          <div className="flex flex-col gap-16 items-start flex-1 min-w-[8.75rem]">
            <ContactLink
              href="https://www.linkedin.com/in/enfineitz/"
              iconClass="nav-social-icon--linkedin"
              label="LinkedIn"
            />
            <ContactLink
              href="mailto:jurgen@enfineitz.com"
              iconClass="nav-social-icon--email"
              label="jurgen@enfineitz.com"
            />
            <ContactLink
              href="https://www.behance.net/bunyip21"
              iconClass="nav-social-icon--behance"
              label="Bēhance"
            />
            <ContactLink
              href="https://soundcloud.com/jurgen-mantzke-752342688/sets/human-nature-is-europa?si=a6c7460b97e340aa99f938bd67302d89&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
              iconClass="nav-social-icon--soundcloud"
              label="Soundcloud"
            />
          </div>
        </div>
      </header>

      {/* ── Card grid ── */}
      <CardGrid className="gap-8 px-8 py-16 sm:p-16" />

      {/* ── Copyright ── */}
      <p className="py-16 font-body font-normal text-[11px] leading-none text-[var(--text-caption)] whitespace-nowrap">
        ©<CurrentYear from={new Date().getFullYear()} /> Enfineitz LLC
      </p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TWO-COLUMN LAYOUT — md / lg / xl
// ════════════════════════════════════════════════════════════════════════════

function TwoColumnLayout() {
  return (
    // overflow-x-clip: the top-right corner uses `50vw` positioning, and CSS
    // viewport units include the scrollbar-gutter width. Once the page scrolls
    // vertically a classic scrollbar appears and pushes the corner ~½ a
    // scrollbar-width past the content edge, creating a horizontal scrollbar.
    // `clip` trims that sub-pixel overflow without creating a scroll container
    // (so the sticky left rail keeps working).
    <div className="relative hidden md:flex justify-center w-full min-h-screen overflow-x-clip">
      {/* Decorative page corners (viewport edges) */}
      <CornerDecoration
        position="top-left"
        className="absolute top-0 left-0 size-40 xl:size-48 pointer-events-none z-10"
      />
      <CornerDecoration
        position="bottom-right"
        className="absolute bottom-0 right-0 size-40 xl:size-48 pointer-events-none z-10"
      />

      {/* Body wrapper — margins per breakpoint; capped + centered at xl */}
      <div
        className={[
          'flex w-full gap-24 items-start',
          'px-16 lg:px-32 xl:px-64',
          'xl:max-w-[1376px]',
        ].join(' ')}
      >
        {/* ── Left rail ── */}
        <aside
          className={[
            'relative flex flex-col gap-24 items-start shrink-0',
            'pt-64 h-screen sticky top-0',
            'md:min-w-[185px] md:max-w-[231px]',
            'lg:min-w-[194px] lg:max-w-[340px]',
            'xl:min-w-[340px] xl:max-w-[340px]',
          ].join(' ')}
        >
          <HomeRailGlyph className="w-[124px] h-[121px] shrink-0" />

          <div className="w-full pr-16">
            <p
              className={[
                'font-body font-medium',
                'text-[12px] leading-[22px] tracking-normal',
                'text-[var(--text-body)]',
              ].join(' ')}
            >
              {bioData.brandSummary}
            </p>
          </div>

          <Navigation displayCaseStudies={false} />

          <CornerDecoration
            position="bottom-right"
            className="absolute bottom-0 right-0 size-40 xl:size-48 pointer-events-none"
          />
        </aside>

        {/* ── Main content ── */}
        <main className="relative flex flex-col flex-1 min-w-0 gap-30 min-h-screen">
          <CornerDecoration
            position="top-left"
            className="absolute top-0 left-0 size-40 xl:size-48 pointer-events-none"
          />

          {/* Top body: brand name + identity */}
          <div className="flex flex-col gap-4 items-start justify-end h-[302px] lg:h-[335px] w-full shrink-0">
            {/* Wordmark anchors the top-right corner: corner top === wordmark bottom
                (0px flex-like gap), while staying flush to the viewport's right edge. */}
            <div className="relative w-full">
              <Wordmark className="gap-4 leading-none text-[60px] lg:text-[96px] font-[200] tracking-tight lg:tracking-tighter" />
              <CornerDecoration
                position="top-right"
                className="absolute top-full -right-16 lg:-right-32 xl:right-[calc(624px-50vw)] size-40 xl:size-48 pointer-events-none z-10"
              />
            </div>
            <p
              className={[
                'font-body font-normal',
                'text-[18px] leading-[30px] tracking-tight',
                'text-[var(--text-caption)]',
                'max-w-[calc(100%-var(--identity-corner-clearance))]',
              ].join(' ')}
            >
              {IDENTITY}
            </p>
          </div>

          {/* Card grid — pb-48 (spacing.margin.xl) matches the Figma
              card-grid frame's 48px bottom padding below the last row. */}
          <CardGrid className="gap-8 pb-48" />
        </main>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SHARED PIECES
// ════════════════════════════════════════════════════════════════════════════

// Enfineitz glyph — size controlled via className
function Glyph({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/efz-glyph.svg"
      alt="Enfineitz"
      width={124}
      height={121}
      className={className}
    />
  )
}

// Brand wordmark — "Enfineitz" (brand orange) + "Stil" (brand neutral)
// Sizing / weight / casing supplied by the caller via className.
function Wordmark({ className }: { className?: string }) {
  return (
    <div
      className={['flex items-center font-display whitespace-nowrap', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-[var(--text-brand-enfineitz)]">Enfineitz</span>
      <span className="text-[var(--text-brand-stil)]">Stil</span>
    </div>
  )
}

// Card grid — fixed 2-column grid at every breakpoint (Figma card-grid).
function CardGrid({ className }: { className?: string }) {
  return (
    <section aria-label="Case study portfolio" className="w-full">
      <div
        className={['grid grid-cols-2 items-start w-full', className]
          .filter(Boolean)
          .join(' ')}
      >
        {publishedStudies.map((study) => (
          <CaseStudyCard
            key={study.slug}
            slug={study.slug}
            title={study.title}
            summary={study.summary}
            coverImage={study.coverImage}
            coverAlt={study.coverAlt}
            tags={study.tags}
            year={study.year}
          />
        ))}
      </div>
    </section>
  )
}

// Page link — mozilla-headline Medium, 14px, tracking loose
function PageLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={[
        'font-display font-[600]',
        'text-body-lg tracking-wide',
        'text-[var(--link-rest)] hover:text-[var(--link-hover)]',
        'py-2 transition-colors duration-150 whitespace-nowrap',
      ].join(' ')}
    >
      {children}
    </Link>
  )
}

// Contact link — 16px masked icon + display Bold label. The whole row is a
// single link; the icon is a CSS mask painted with currentColor so it inherits
// the link color (orange --link-rest) in every state, matching the other
// breakpoints' navigation.
function ContactLink({
  href,
  iconClass,
  label,
}: {
  href: string
  iconClass: string
  label: string
}) {
  const isMail = href.startsWith('mailto')
  return (
    <a
      href={href}
      target={isMail ? undefined : '_blank'}
      rel={isMail ? undefined : 'noopener noreferrer'}
      className={[
        'flex gap-8 items-center py-2 w-full shrink-0',
        'font-display font-[600]',
        'text-body-lg tracking-wide',
        'text-[var(--link-rest)] hover:text-[var(--link-hover)]',
        'transition-colors duration-150',
      ].join(' ')}
    >
      <span className={`nav-social-icon ${iconClass}`} aria-hidden="true" />
      {label}
    </a>
  )
}

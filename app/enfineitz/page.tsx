import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import GlobalHeader from '@/components/GlobalHeader'
import CornerDecoration from '@/components/CornerDecoration'
import ManifestoImage from '@/components/ManifestoImage'
import enfineitzContent from '@/content/enfineitz.json'

// ─── What is Enfineitz? (Article template · Manifesto) ───────────────────────
// Rebuilt to match the Figma "template/manifesto" responsive set:
//   XS 922:2759 · SM 922:2681 · MD 922:2597 · LG 916:2051 · XL 916:1913
//
// Shares the article shell with the Biography page. Layout switches at the
// `md` breakpoint (768px):
//   • below md → stacked (header · horizontal nav · title · hero image + body)
//   • md and up → two-column (hero image + body article, right nav rail)
//
// Difference vs. the bio template: the LG breakpoint is full-width (no
// max-width cap); MD caps at 1023px and XL caps at 1376px.

export const metadata: Metadata = {
  title: 'The Enfineitz Manifesto | Jurgen Mantzke',
  description:
    'An overview of the Enfineitz design philosophy — applying boundless creativity to complex systems.',
  keywords: [
    'enfineitz',
    'manifesto',
    'design',
    'philosophy',
    'product design',
    'qualitative user research',
    'visual design',
    'gestalt principles',
    'artificial intelligence',
    'Agile',
    'SCRUM',
    'application',
    'software',
  ],
  openGraph: {
    title: 'The Enfineitz Manifesto | Jurgen Mantzke',
    description:
      'An overview of the Enfineitz design philosophy — applying boundless creativity to complex systems.',
    url: 'https://case-studies.enfineitz.com/enfineitz',
    images: [{ url: '/og/manifesto.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Enfineitz Manifesto | Jurgen Mantzke',
    description:
      'An overview of the Enfineitz design philosophy — applying boundless creativity to complex systems.',
    images: ['/og/manifesto.png'],
  },
  alternates: {
    canonical: 'https://case-studies.enfineitz.com/enfineitz',
  },
}

const section = enfineitzContent.sections[0] as {
  paragraphs: string[]
  heading?: string
}

export default function EnfineitzPage() {
  return (
    <div className="relative w-full min-h-screen page-gradient">
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
    <div className="relative flex flex-col md:hidden gap-16 items-center min-h-screen w-full">
      <GlobalHeader />

      {/* Title block — horizontal navigation + page title */}
      <div className="flex flex-col gap-24 items-start px-12 sm:px-16 w-full">
        <Navigation layout="horizontal" displayManifesto={false} showCopyright={false} />
        <PageTitle className="font-display text-[24px] font-[600] sm:text-[48px] sm:font-[200] tracking-[0.01em] sm:tracking-tight" />
      </div>

      {/* Below — hero image + manifesto body */}
      <div className="relative flex flex-col flex-1 items-center px-12 py-8 sm:p-16 w-full">
        <CornerDecoration
          position="top-right"
          className="absolute top-0 right-0 size-30 sm:size-32 pointer-events-none"
        />

        <ManifestoContent />
      </div>

      {/* Page bottom-left corner */}
      <CornerDecoration
        position="bottom-left"
        className="absolute bottom-0 left-0 size-30 sm:size-32 pointer-events-none"
      />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TWO-COLUMN LAYOUT — md / lg / xl
// ════════════════════════════════════════════════════════════════════════════

function TwoColumnLayout() {
  return (
    <div className="relative hidden md:flex flex-col gap-24 items-center min-h-screen w-full">
      <GlobalHeader />

      {/* Title — centered; MD caps at 1023, LG is full-width, XL caps at 1376 */}
      <div className="w-full max-w-[1023px] lg:max-w-none xl:max-w-[1376px] px-16 lg:px-32 xl:px-0">
        <PageTitle className="font-display text-[60px] font-[200] tracking-tight" />
      </div>

      {/* Top-right corner of the body */}
      <CornerDecoration
        position="top-right"
        className="absolute top-[207px] xl:top-[191px] right-0 size-40 xl:size-48 pointer-events-none z-10"
      />

      {/* Body — content column + navigation rail */}
      <div className="flex flex-1 gap-20 lg:gap-24 items-start justify-center w-full max-w-[1023px] lg:max-w-none xl:max-w-[1376px] px-16 lg:px-32 xl:px-0">
        <ManifestoContent className="flex-1 min-w-0" />

        {/* Navigation rail */}
        <aside
          className={[
            'relative flex flex-col self-stretch items-start justify-between',
            'md:min-w-[185px] md:max-w-[231px]',
            'lg:min-w-[194px] lg:max-w-[340px]',
            'xl:min-w-[340px] xl:max-w-[340px]',
            'flex-1',
          ].join(' ')}
        >
          <Navigation displayManifesto={false} />

          {/* Rail bottom corner */}
          <div className="flex items-end w-full shrink-0">
            <CornerDecoration
              position="bottom-left"
              className="size-40 xl:size-48 shrink-0 pointer-events-none"
            />
          </div>
        </aside>
      </div>

      {/* Page bottom-left corner */}
      <CornerDecoration
        position="bottom-left"
        className="absolute bottom-0 left-0 size-40 xl:size-48 pointer-events-none"
      />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// SHARED PIECES
// ════════════════════════════════════════════════════════════════════════════

function PageTitle({ className }: { className?: string }) {
  return (
    <div
      className={['flex items-center gap-4 leading-none whitespace-nowrap', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-[var(--text-slash)]">/</span>
      <span className="text-[var(--text-header-reversed)]">{enfineitzContent.title}</span>
    </div>
  )
}

// Hero image + indented manifesto paragraph block.
function ManifestoContent({ className }: { className?: string }) {
  return (
    <div
      className={['flex flex-col gap-30 items-start w-full pb-48', className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Hero image — rotating captioned artwork */}
      <ManifestoImage />

      {/* Manifesto body — indented, right-aligned within the content column */}
      <div className="flex flex-col items-end pl-64 w-full">
        <div className="w-full max-w-[700px]">
          {section.paragraphs.map((para, i) => (
            <p
              key={i}
              className="font-body font-normal text-[14px] leading-[30px] text-[var(--text-body)] mb-12 last:mb-0"
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}


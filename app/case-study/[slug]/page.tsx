import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import GlobalHeader from '@/components/GlobalHeader'
import CornerDecoration from '@/components/CornerDecoration'
import CaseStudyContent from '@/components/CaseStudyContent'
import caseStudies from '@/content/case-studies.json'
import {
  getCaseStudyContent,
  type CaseStudyBlock,
} from '@/content/case-studies/contentMap'

// ─── Types ────────────────────────────────────────────────────────────────────
// The case study template is identical for every case study, save for two
// unique pieces: the page title and the authored content (a JSON file of
// content blocks, rendered by <CaseStudyContent />). The shell mirrors the
// shared article template (bio / manifesto): a stacked layout below `md` and a
// two-column layout (content + navigation rail) at `md` and up.

type CaseStudyIndexEntry = {
  slug: string
  title: string
  pageTitle?: string
  client: string
  role: string
  year: number
  published: boolean
  tags: string[]
  coverImage: string
  coverAlt: string
  summary: string
  ogImage?: string
}

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return (caseStudies as CaseStudyIndexEntry[])
    .filter((s) => s.published)
    .map((s) => ({ slug: s.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
// Per-study metadata: each case study gets its own title, canonical URL, and
// (when assigned) Open Graph image. Studies without an `ogImage` fall back to
// the shared placeholder. Descriptions remain generic for now.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = (caseStudies as CaseStudyIndexEntry[]).find(
    (s) => s.slug === slug,
  )

  const title = `${study?.pageTitle ?? study?.title ?? 'Case Study'} | Jurgen Mantzke`
  const description =
    'A UX case study by Jurgen Mantzke. This page will be updated with a full description later.'
  const url = `https://case-studies.enfineitz.com/case-study/${slug}`
  const ogImage = study?.ogImage ?? '/og/placeholder.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study = (caseStudies as CaseStudyIndexEntry[]).find(
    (s) => s.slug === slug,
  )

  if (!study || !study.published) notFound()

  // Authored content blocks. Case studies still awaiting their JSON file fall
  // back to a single summary block so their card link doesn't 404.
  const blocks: CaseStudyBlock[] = getCaseStudyContent(slug)?.content ?? [
    { type: 'summary', subtitle: study.summary, body: '' },
  ]

  return (
    <div className="relative w-full min-h-screen page-gradient">
      <StackedLayout title={study.pageTitle ?? study.title} blocks={blocks} />
      <TwoColumnLayout title={study.pageTitle ?? study.title} blocks={blocks} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// STACKED LAYOUT — xs / sm (below md)
// ════════════════════════════════════════════════════════════════════════════

function StackedLayout({
  title,
  blocks,
}: {
  title: string
  blocks: CaseStudyBlock[]
}) {
  return (
    <div className="relative flex flex-col md:hidden gap-16 items-center min-h-screen w-full">
      <GlobalHeader />

      {/* Title block — horizontal navigation + page title */}
      <div className="flex flex-col gap-24 items-start px-8 sm:px-16 w-full">
        <Navigation layout="horizontal" showCopyright={false} />
        <PageTitle
          title={title}
          className="font-display text-[24px] font-[600] sm:text-[48px] sm:font-[200] tracking-[0.01em] sm:tracking-tight"
        />
      </div>

      {/* Below — case study content */}
      <div className="relative flex flex-col flex-1 items-center p-8 sm:p-16 w-full">
        <CornerDecoration
          position="top-right"
          className="absolute top-0 right-0 size-30 sm:size-32 pointer-events-none"
        />

        <CaseStudyContent blocks={blocks} />
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

function TwoColumnLayout({
  title,
  blocks,
}: {
  title: string
  blocks: CaseStudyBlock[]
}) {
  return (
    <div className="relative hidden md:flex flex-col gap-24 items-center min-h-screen w-full">
      <GlobalHeader />

      {/* Title — centered; MD caps at 1023, LG is full-width, XL caps at 1376 */}
      <div className="w-full max-w-[1023px] lg:max-w-none xl:max-w-[1376px] px-16 lg:px-32 xl:px-0">
        <PageTitle
          title={title}
          className="font-display text-[60px] font-[200] tracking-tight"
        />
      </div>

      {/* Body region — a full-width, `relative` positioning context that spans
          the viewport. This lets the top-right corner sit flush against the
          viewport's right edge (`right-0`) while its `top-0` still tracks the
          top of the content column. The inner wrapper keeps the column centered
          and width-capped. */}
      <div className="relative flex flex-1 justify-center w-full">
        {/* Top-right corner — flush to the viewport's right edge; `top-0`
            tracks the top of the content column at every breakpoint. */}
        <CornerDecoration
          position="top-right"
          className="absolute top-0 right-0 size-40 xl:size-48 pointer-events-none z-10"
        />

        {/* Content column + navigation rail */}
        <div className="flex gap-20 lg:gap-24 items-start justify-center w-full max-w-[1023px] lg:max-w-none xl:max-w-[1376px] px-16 lg:px-32 xl:px-0">
          <CaseStudyContent blocks={blocks} className="flex-1 min-w-0" />

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
            <Navigation />

            {/* Rail bottom corner */}
            <div className="flex items-end w-full shrink-0">
              <CornerDecoration
                position="bottom-left"
                className="size-40 xl:size-48 shrink-0 pointer-events-none"
              />
            </div>
          </aside>
        </div>
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

function PageTitle({
  title,
  className,
}: {
  title: string
  className?: string
}) {
  return (
    <div
      className={['flex items-center gap-4 leading-none whitespace-nowrap', className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-[var(--text-slash)]">/</span>
      <span className="text-[var(--text-header-reversed)]">{title}</span>
    </div>
  )
}

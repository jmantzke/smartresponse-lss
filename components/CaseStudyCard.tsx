import Image from 'next/image'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CaseStudyCardProps = {
  slug: string
  title: string
  summary: string
  coverImage: string
  coverAlt: string
  tags?: string[]
  year?: number
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CaseStudyCard({
  slug,
  title,
  summary,
  coverImage,
}: CaseStudyCardProps) {
  return (
    <Link
      href={`/case-study/${slug}`}
      className={[
        'group block',
        // Fills its 2-column grid cell; capped at max-width 900 (Figma card-grid)
        'w-full min-w-0 max-w-[900px]',
        'rounded-msm',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link-hover)]',
      ].join(' ')}
      aria-label={`View case study: ${title}`}
    >
      <article
        className={[
          // Base layout — surface/card/rest, rounded-msm (16px), clipped
          'relative flex flex-col overflow-clip rounded-msm',
          // Responsive card height: XS 140 · SM 160 · MD+ 180
          'h-[140px] sm:h-[160px] md:h-[180px]',
          // Responsive card margins: XS 20 · SM+ 32
          'p-20 sm:p-32',
          // Rest / hover surface (tokens)
          'bg-[var(--surface-card-rest)] group-hover:bg-[var(--surface-card-hover)]',
          'transition-colors duration-200 ease-in-out',
        ].join(' ')}
      >
        {/* ── Decorative background — anchored bottom-right (Figma card-bkg) ── */}
        <div
          className="absolute bottom-0 right-0 h-[167px] w-[317px] overflow-clip pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute bottom-[-0.33px] right-0 h-[186px] w-[245px]">
            <Image
              src={coverImage}
              alt=""
              fill
              sizes="245px"
              className="object-cover"
            />
          </div>
        </div>

        {/* ── Title + subtitle (Figma title block) ── */}
        <div
          className={[
            'relative z-10 flex flex-col w-full',
            // title-subtitle-gap: XS 12 · SM 18 · MD+ 24
            'gap-12 sm:gap-18 md:gap-24',
            // interaction/link/active → white (dark theme)
            'text-[var(--link-active)]',
          ].join(' ')}
        >
          {/* Title — heimat-stencil Bold (600), font-size/50 (18px), tracking-tight.
              Rest → orange (link/rest); hover → white (link/active). */}
          <h3 className="font-display font-[600] text-[18px] leading-none tracking-tight text-[var(--link-rest)] group-hover:text-[var(--link-active)] transition-colors duration-200">
            {title}
          </h3>

          {/* Subtitle — Figma "Card-label": ibm-plex-sans Regular, font-size/30
              (14px), line-height/card-sub (18px). */}
          <p className="font-body font-normal text-[14px] leading-[18px]">
            {summary}
          </p>
        </div>
      </article>
    </Link>
  )
}

import Image from 'next/image'
import type { CaseStudyBlock } from '@/content/case-studies/contentMap'

// ─── Case study content renderer ────────────────────────────────────────────
// Renders the authored content blocks (hero · summary · gallery · section)
// from a case study's JSON file. The shared article shell (header, page title,
// navigation rail, corners) lives in the template page; this component is the
// unique, data-driven body for each case study.

type CaseStudyContentProps = {
  blocks: CaseStudyBlock[]
  className?: string
}

export default function CaseStudyContent({
  blocks,
  className,
}: CaseStudyContentProps) {
  return (
    <div
      className={['flex flex-col gap-30 items-start w-full pb-48', className]
        .filter(Boolean)
        .join(' ')}
    >
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'hero':
            return (
              <div key={i} className="flex flex-col gap-12 items-start w-full">
                <Figure
                  src={block.image.src}
                  alt={block.image.alt}
                  aspect={block.image.aspect}
                  priority
                  sizes="(max-width: 768px) 100vw, 1012px"
                />
              </div>
            )

          case 'summary':
            return (
              <div
                key={i}
                className="flex flex-col gap-16 items-start w-full text-[var(--text-body)]"
              >
                {block.subtitle && (
                  <p className="font-body font-normal text-[20px] leading-[36px] tracking-tight w-full">
                    {block.subtitle}
                  </p>
                )}
                {block.body &&
                  (Array.isArray(block.body) ? (
                    <div className="max-w-[700px] w-full">
                      {block.body.map((para, pi) => (
                        <p
                          key={pi}
                          className="font-body font-normal text-[14px] leading-[30px] mb-12 last:mb-0"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="font-body font-normal text-[14px] leading-[30px] max-w-[700px] w-full">
                      {block.body}
                    </p>
                  ))}
              </div>
            )

          case 'gallery':
            return (
              <div
                key={i}
                className="content-start flex flex-wrap gap-16 items-start w-full"
              >
                {block.figures.map((figure, fi) => (
                  <figure
                    key={fi}
                    className="flex flex-col flex-1 gap-12 items-start min-w-[200px] max-w-[600px] lg:max-w-[1000px]"
                  >
                    <Figure
                      src={figure.src}
                      alt={figure.alt}
                      aspect={figure.aspect}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {figure.caption && (
                      <figcaption className="font-body font-normal text-[11px] leading-normal min-w-[200px] max-w-[345px] lg:max-w-[380px] text-[var(--text-caption)] w-full">
                        {figure.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )

          case 'section':
            return (
              <div
                key={i}
                className="flex flex-col gap-16 items-start w-full text-[var(--text-body)]"
              >
                {block.heading && (
                  <h2 className="font-display font-[600] text-[24px] leading-normal tracking-[1px] w-full">
                    {block.heading}
                  </h2>
                )}
                <div className="max-w-[700px] w-full">
                  {block.paragraphs.map((para, pi) =>
                    typeof para === 'string' ? (
                      <p
                        key={pi}
                        className="font-body font-normal text-[14px] leading-[30px] mb-12 last:mb-0"
                      >
                        {para}
                      </p>
                    ) : (
                      <p
                        key={pi}
                        className="font-body font-normal text-[20px] leading-[36px] tracking-tight mb-12 last:mb-0"
                      >
                        {para.subheading}
                      </p>
                    ),
                  )}
                </div>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}

// Responsive image sized by its intrinsic aspect ratio (parsed from the
// "w/h" string). width/height set the aspect ratio; `w-full h-auto` keeps it
// fluid. No cropping occurs because the container matches the source ratio.
function Figure({
  src,
  alt,
  aspect,
  sizes,
  priority = false,
}: {
  src: string
  alt: string
  aspect: string
  sizes: string
  priority?: boolean
}) {
  const [width, height] = aspect.split('/').map(Number)
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className="w-full h-auto rounded-msm"
    />
  )
}

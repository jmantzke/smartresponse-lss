import Image from 'next/image'
import type { ReactNode } from 'react'
import GlobalHeader from '@/components/GlobalHeader'

// ─── ErrorPage ────────────────────────────────────────────────────────────────
// Shared shell for all error/status screens (403, 404, 408, 415, 500, 502, 503,
// runtime error). Mirrors the Figma error component (1076:3797): the shattered
// enfineitz-glyph-large illustration sits behind a right-aligned text block. The
// big status code renders either as its pixel-matched numeral SVG (codeImage) or
// as display-font text (code). Heading + message + optional actions follow.

type CodeImage = { src: string; width: number; height: number; alt: string }

type Props = {
  /** Pre-rendered numeral SVG (used by the 404 page for pixel fidelity). */
  codeImage?: CodeImage
  /** Status code rendered as display-font text when no codeImage is supplied. */
  code?: string
  heading: string
  message: string
  /** Optional actions (e.g. a retry button or home link). */
  children?: ReactNode
}

export default function ErrorPage({
  codeImage,
  code,
  heading,
  message,
  children,
}: Props) {
  return (
    <div className="relative flex flex-col min-h-screen w-full page-gradient">
      <GlobalHeader />

      <main className="flex flex-1 items-center justify-center px-16 sm:px-24 py-48 w-full">
        <div className="relative w-full max-w-[906px]">
          {/* Decorative shattered-glyph illustration — scales with container */}
          <Image
            src="/images/errors/glyph.svg"
            alt=""
            width={805}
            height={783}
            aria-hidden="true"
            className="pointer-events-none select-none w-full h-auto"
          />

          {/* Text block, vertically centered over the right of the glyph */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-12 md:gap-24 items-start xl:items-end w-[209px] sm:w-[325px] md:w-[400px] lg:w-[524px]">
            {codeImage ? (
              <Image
                src={codeImage.src}
                alt={codeImage.alt}
                width={codeImage.width}
                height={codeImage.height}
                className="w-[199px] sm:w-[279px] md:w-[386px] lg:w-[460px] xl:w-[524px] h-auto"
              />
            ) : code ? (
              <p className="font-display font-[200] leading-none tracking-tighter text-[var(--text-body)] text-[72px] sm:text-[104px] md:text-[140px] lg:text-[168px] xl:text-[190px] text-left xl:text-right">
                {code}
              </p>
            ) : null}

            <h1 className="font-display leading-none text-[var(--text-body)] font-[600] text-[32px] tracking-[1px] md:font-[200] md:text-[48px] md:tracking-tight lg:text-[60px] text-left xl:text-right">
              {heading}
            </h1>

            <p className="font-body leading-[30px] text-[var(--text-body)] text-[14px] md:text-[18px] md:tracking-tight text-left xl:text-right">
              {message}
            </p>

            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

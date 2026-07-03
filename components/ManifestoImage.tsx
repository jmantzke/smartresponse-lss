'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

// ─── Manifesto slide-show ────────────────────────────────────────────────────
// A fixed-height, full-width image that fills the ManifestoContent column and
// displays a rotating selection of original artwork, each with its own caption.
//
// Behaviour (per Figma node 1115:4585):
//   • Picks a random image on mount — this covers a browser refresh as well as
//     leaving and returning to the page (the static export remounts on nav).
//   • Rotates to another random image every 15 minutes.
//   • Re-picks when the tab becomes visible again ("leave and return").
//
// Fixed heights come from the `containers/images/manifesto-height` token, which
// differs per breakpoint: XS 160 · SM 180 · MD 300 · LG/XL 420.
//
// Each image is cropped with object-cover; `position` is the object-position
// focal point taken from the absolute crop in the Figma mockups.

type ManifestoSlide = {
  src: string
  alt: string
  caption: string
  position: string
}

const slides: ManifestoSlide[] = [
  {
    src: '/images/manifesto/elk-treed-manifesto-2.png',
    alt: 'A stylised elk standing among trees',
    caption: 'I created this image as a wallpaper for my desktop, using Adobe Illustrator.',
    position: 'right bottom',
  },
  {
    src: '/images/manifesto/66RT-manifesto.png',
    alt: 'An abstract industrial typographic wallpaper design',
    caption: 'This was a wallpaper design with a random industrial concept.',
    position: 'center',
  },
  {
    src: '/images/manifesto/1215-manifesto.png',
    alt: 'Weathered, painted sign textures arranged as a composition',
    caption: 'This was a weather-worn sign I found and modified to use as a desktop wallpaper.',
    position: 'center',
  },
  {
    src: '/images/manifesto/A340-SAA-manifesto.png',
    alt: 'A painting of a wide-body jet airliner',
    caption:
      'This painting was created with Adobe Fresco on an iPad with an Apple Pencil. I meant to paint an Airbus A-340, but this resembles more closely an A-330. Fäk Papüß is a Teutonic interpretation of “Fake Papoose”, which is what I name my music project.',
    position: 'center',
  },
  {
    src: '/images/manifesto/alpenglow-manifesto.png',
    alt: 'A stylised mountain range lit by alpenglow',
    caption:
      'I painted this as a light-and-shadow study of alpenglow. Painted in Adobe Fresco on an iPad with an Apple Pencil.',
    position: 'right 34%',
  },
  {
    src: '/images/manifesto/curated-industrial-manifesto.png',
    alt: 'Industrial machinery collage cover art',
    caption: 'This image was created as cover art for my Curated Industrial playlist in Spotify.',
    position: 'center 80%',
  },
  {
    src: '/images/manifesto/edinburgh-doves-manifesto.png',
    alt: 'Doves flying over Edinburgh rooftops',
    caption: 'This painting was created in Sketchbook Pro on an Amazon Fire Tablet.',
    position: 'center',
  },
  {
    src: '/images/manifesto/everstuff-owl-manifesto.png',
    alt: 'A geometric owl album-cover artwork',
    caption:
      'This image was commissioned as an album cover for Fletcher Christian, on his debut album “Everstuff”. I created this in Adobe Illustrator.',
    position: 'center bottom',
  },
  {
    src: '/images/manifesto/grey_owl_mantzke_2025_manifesto.png',
    alt: 'A painted portrait of a grey owl',
    caption:
      'Another owl! I created this in Adobe Fresco and Photoshop, and I mean it as fine art for my dining room.',
    position: 'center',
  },
  {
    src: '/images/manifesto/hexidecimals-manifesto.png',
    alt: 'An abstract geometric design',
    caption:
      'This random design was created in Adobe Illustrator and is a great example of design for design’s sake.',
    position: 'center',
  },
  {
    src: '/images/manifesto/kingdom-city-manifesto.png',
    alt: 'A painted animation background of a city',
    caption:
      'I painted this with Adobe Fresco on an iPad with an Apple Pencil. It was intended as an animation background for one of my son’s short films.',
    position: 'center top',
  },
  {
    src: '/images/manifesto/springbok-manifesto.png',
    alt: 'A light-and-motion study of a springbok',
    caption:
      'This light, shadow and motion study of a Springbok was drawn in Adobe Illustrator on an iPad with an Apple Pencil.',
    position: 'center',
  },
  {
    src: '/images/manifesto/wanna-fight-abstract-tech-manifesto.png',
    alt: 'An abstract technological illustration',
    caption: 'This image was drawn in Sketchbook Pro on an Amazon Fire Tablet.',
    position: 'center top',
  },
  {
    src: '/images/manifesto/cord-manifesto.png',
    alt: 'A painting of a 1937 Cord Model 810 automobile',
    caption:
      'A Tintin-inspired 1937 Cord Model 810 or 812, painted with Sketchbook Pro on an Amazon Fire tablet, 2018.',
    position: 'center',
  },
]

const DISCLAIMER_LINE_1 =
  'These images from my galleries of art and design are never AI-generated.'
const DISCLAIMER_LINE_2 =
  'The image will refresh every 15 minutes, or when you leave and return to this page.'
const ROTATE_MS = 15 * 60 * 1000

function pickRandom(exclude: number): number {
  if (slides.length <= 1) return 0
  let next = exclude
  while (next === exclude) {
    next = Math.floor(Math.random() * slides.length)
  }
  return next
}

export default function ManifestoImage({ className }: { className?: string }) {
  // Deterministic first paint (index 0) keeps SSG markup and hydration in sync;
  // the effect below swaps in a random image once mounted on the client.
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // Randomise after the first paint so the server-rendered markup and the
    // initial client render stay in sync (no hydration mismatch).
    const raf = window.requestAnimationFrame(() => setIndex(pickRandom(-1)))

    const interval = window.setInterval(() => {
      setIndex((current) => pickRandom(current))
    }, ROTATE_MS)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        setIndex((current) => pickRandom(current))
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const slide = slides[index]

  return (
    <figure
      className={['flex flex-col gap-16 items-end w-full shrink-0 m-0', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="relative w-full h-[160px] sm:h-[180px] md:h-[300px] lg:h-[420px] rounded-msm overflow-hidden shrink-0">
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1012px"
          className="object-cover"
          style={{ objectPosition: slide.position }}
        />
      </div>

      <figcaption className="flex gap-8 items-start w-full max-w-[600px] font-body font-normal text-[11px] leading-[16px]">
        <svg
          className="h-[16px] md:h-[20px] lg:h-[28px] aspect-[9/14] shrink-0"
          viewBox="0 0 26 41"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M26 12.8904L24.6106 14.268H23.0994L13 4.2476L2.90062 14.268H1.38938L0 12.8904L10.855 2.1238L13 0L15.145 2.1238L26 12.8822V12.8904ZM11.4806 40.4014L12.0819 41H13.91L14.5113 40.4014V8.282H11.4806V40.4014Z"
            fill="var(--text-header, #f39806)"
          />
        </svg>
        <div className="flex flex-col gap-16 items-start flex-1 min-w-0 text-left">
          <p className="w-full text-[var(--text-body)]">{slide.caption}</p>
          <p className="w-full text-[var(--text-slash)]">
            {DISCLAIMER_LINE_1}
            <br />
            {DISCLAIMER_LINE_2}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}

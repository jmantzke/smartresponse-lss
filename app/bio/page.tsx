import Image from 'next/image'
import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import GlobalHeader from '@/components/GlobalHeader'
import CornerDecoration from '@/components/CornerDecoration'
import bioData from '@/content/bio.json'

// ─── About me (Article template · Biography) ─────────────────────────────────
// Rebuilt to match the Figma "template/article/biography" responsive set:
//   XS 914:3158 · SM 913:2996 · MD 912:2874 · LG 909:2697 · XL 909:2794
//
// Layout switches at the `md` breakpoint (768px):
//   • below md → stacked (header · horizontal nav · title · portrait + bio,
//                certificates row, site credit)
//   • md and up → two-column (portrait + bio article + certificate column,
//                 right navigation rail)

export const metadata: Metadata = {
  title: 'About | Jurgen Mantzke',
  description:
    'Background and experience of Jurgen Mantzke, a systems‑level UX/Product Designer specializing in complex domains.',
  keywords: [
    'enterprise',
    'design',
    'user experience',
    'product design',
    'qualitative user research',
    'visual design',
    'gestalt principles',
    'design system',
    'Figma',
    'nonprofit',
    'aviation',
    'prototype',
    'artificial intelligence',
    'Agile',
    'SCRUM',
    'application',
    'software',
  ],
  openGraph: {
    title: 'About | Jurgen Mantzke',
    description:
      'Background and experience of Jurgen Mantzke, a systems‑level UX/Product Designer specializing in complex domains.',
    url: 'https://case-studies.enfineitz.com/bio',
    images: [{ url: '/og/enfineitz.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About | Jurgen Mantzke',
    description:
      'Background and experience of Jurgen Mantzke, a systems‑level UX/Product Designer specializing in complex domains.',
    images: ['/og/enfineitz.png'],
  },
  alternates: {
    canonical: 'https://case-studies.enfineitz.com/bio',
  },
}

const NYT_URL = 'http://www.nytimes.com/2008/06/14/business/14offline.html'

type Cert = {
  name: string
  issuer: string
  year: number
  certNumber?: string
  badge: string
  badgeAlt: string
  verifyUrl: string
  verifyLabel: string
}

const certifications = bioData.certifications as Cert[]

export default function BioPage() {
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
        <Navigation layout="horizontal" displayAbout={false} showCopyright={false} />
        <PageTitle className="font-display text-[24px] font-[600] sm:text-[48px] sm:font-[200] tracking-[0.01em] sm:tracking-tight" />
      </div>

      {/* Below — portrait + bio, certificates, site credit */}
      <div className="relative flex flex-col flex-1 items-center px-12 py-8 sm:p-16 w-full">
        <CornerDecoration
          position="top-right"
          className="absolute top-0 right-0 size-30 sm:size-32 pointer-events-none"
        />

        <div className="flex gap-16 items-start w-full pb-48">
          <Portrait />

          <div className="flex flex-col flex-1 min-w-0 gap-20 items-start">
            <Paragraphs />

            {/* Certificates — horizontal row */}
            <div className="flex gap-16 items-start justify-center w-full">
              {certifications.map((cert) => (
                <div key={cert.name} className="w-[82px] h-[160px] shrink-0">
                  <CertBadge cert={cert} />
                </div>
              ))}
            </div>

            {/* Site credit */}
            <div className="flex items-center justify-center pt-8 w-full">
              <CredentialsLine />
            </div>
          </div>
        </div>
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

      {/* Title — centered, capped per breakpoint */}
      <div className="w-full max-w-[1023px] lg:max-w-[1375px] xl:max-w-[1376px] px-16 lg:px-32 xl:px-0">
        <PageTitle className="font-display text-[60px] font-[200] tracking-tight" />
      </div>

      {/* Top-right corner of the body */}
      <CornerDecoration
        position="top-right"
        className="absolute top-[207px] xl:top-[191px] right-0 size-40 xl:size-48 pointer-events-none z-10"
      />

      {/* Body — content column + navigation rail */}
      <div className="flex flex-1 gap-20 lg:gap-24 items-start justify-center w-full max-w-[1023px] lg:max-w-[1375px] xl:max-w-[1376px] px-16 lg:px-32 xl:px-0">
        {/* Content — portrait + bio article + certificate column */}
        <div className="flex gap-32 items-start flex-1 min-w-0 lg:flex-none lg:w-[688px] xl:w-[1012px] pb-48">
          <Portrait className="w-[96px] h-[96px] lg:w-[128px] lg:h-[128px]" />

          <div className="flex flex-1 min-w-0 gap-30 items-start">
            <Paragraphs />

            {/* Certificates — vertical column */}
            <div className="flex flex-col gap-16 items-start max-w-[110px] min-w-[88px] shrink-0">
              {certifications.map((cert) => (
                <CertBadge key={cert.name} cert={cert} />
              ))}
              <CredentialsLine className="pt-24" />
            </div>
          </div>
        </div>

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
          <Navigation displayAbout={false} />

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
      <span className="text-[var(--text-header-reversed)]">{bioData.name}</span>
    </div>
  )
}

function Portrait({ className }: { className?: string }) {
  return (
    <div className={['shrink-0', className].filter(Boolean).join(' ')}>
      <div className="relative w-[72px] h-[72px] md:w-[96px] md:h-[96px] lg:w-[128px] lg:h-[128px] xl:w-[128px] xl:h-[128px] rounded-round overflow-hidden">
        <Image
          src={bioData.photo}
          alt={bioData.photoAlt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 128px, (min-width: 768px) 96px, 72px"
        />
      </div>
    </div>
  )
}

function Paragraphs() {
  return (
    <div className="flex-1 min-w-0 max-w-[700px]">
      {bioData.paragraphs.map((para, i) => (
        <p
          key={i}
          className="font-body font-normal text-[14px] leading-[30px] text-[var(--text-body)] mb-12 last:mb-0"
        >
          {renderParagraph(para)}
        </p>
      ))}
    </div>
  )
}

function CertBadge({ cert }: { cert: Cert }) {
  // Certs with a certNumber (e.g. NN/g) link to a public "people" directory
  // rather than a direct credential URL, so the tooltip tells the user which
  // number to enter once they arrive.
  const verifyHint = cert.certNumber
    ? `${cert.verifyLabel}: on the ${cert.issuer} page, enter certificate #${cert.certNumber}`
    : cert.verifyLabel
  return (
    <a
      href={cert.verifyUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={verifyHint}
      aria-label={verifyHint}
      className="flex flex-col gap-16 items-start"
    >
      <div className="relative w-[70px] h-[70px] shrink-0">
        <Image
          src={cert.badge}
          alt={cert.badgeAlt}
          width={800}
          height={800}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="font-body font-normal text-[11px] leading-[16px] text-[var(--text-caption)]">
        {cert.name}, {cert.year}
        {cert.certNumber && (
          <>
            <br />
            Certificate #{cert.certNumber}
          </>
        )}
      </p>
    </a>
  )
}

function CredentialsLine({ className }: { className?: string }) {
  return (
    <p
      className={[
        'font-body font-normal text-[11px] leading-[16px] text-[var(--text-slash)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {bioData.siteCredit}
    </p>
  )
}

// Linkifies the "New York Times" reference inside the first bio paragraph,
// matching the Figma design's italic, underlined link.
function renderParagraph(text: string) {
  const marker = 'New York Times'
  const idx = text.indexOf(marker)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <a
        href={NYT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="italic underline decoration-from-font hover:text-[var(--link-hover)]"
      >
        {marker}
      </a>
      {text.slice(idx + marker.length)}
    </>
  )
}


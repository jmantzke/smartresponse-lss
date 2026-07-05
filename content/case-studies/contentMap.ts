import alaskaAirlines from './alaska-airlines-flight-attendant-training.json'
import alaskaPilotVacationTrading from './alaska-airlines-pilot-vacation-trading.json'
import ecommerceBrandingKit from './ecommerce-branding-kit.json'
import wanderlist from './wanderlist.json'
import boeingNgpsSearch from './boeing-ngps-search.json'
import ngpsAircraftDetailRedesign from './ngps-aircraft-detail-redesign.json'
import alaskaPersonalDropRequest from './alaska-airlines-personal-drop-request.json'
import smartResponseFieldStudies from './smartresponse-field-studies.json'

// ─── Case study content block types ─────────────────────────────────────────
// Each case study's body is authored as a JSON file of content blocks. The
// template page (app/case-study/[slug]/page.tsx) renders these via
// <CaseStudyContent />.

export type HeroBlock = {
  type: 'hero'
  image: { src: string; alt: string; aspect: string }
}

export type SummaryBlock = {
  type: 'summary'
  subtitle: string
  body: string
}

export type GalleryFigure = {
  src: string
  alt: string
  aspect: string
  caption?: string
}

export type GalleryBlock = {
  type: 'gallery'
  figures: GalleryFigure[]
}

// A section paragraph is either body copy (string) or an inline subheading
// (object), which renders at a larger size within the section.
export type SectionParagraph = string | { subheading: string }

export type SectionBlock = {
  type: 'section'
  heading: string
  paragraphs: SectionParagraph[]
}

export type CaseStudyBlock = HeroBlock | SummaryBlock | GalleryBlock | SectionBlock

export type CaseStudyContentData = {
  slug: string
  title: string
  content: CaseStudyBlock[]
}

// Slug → authored content. Add new case studies here as their JSON files land.
const contentBySlug: Record<string, CaseStudyContentData> = {
  'alaska-airlines-flight-attendant-training':
    alaskaAirlines as CaseStudyContentData,
  'alaska-airlines-pilot-vacation-trading':
    alaskaPilotVacationTrading as CaseStudyContentData,
  'ecommerce-branding-kit': ecommerceBrandingKit as CaseStudyContentData,
  wanderlist: wanderlist as CaseStudyContentData,
  'boeing-ngps-search': boeingNgpsSearch as CaseStudyContentData,
  'ngps-aircraft-detail-redesign':
    ngpsAircraftDetailRedesign as CaseStudyContentData,
  'alaska-airlines-personal-drop-request':
    alaskaPersonalDropRequest as CaseStudyContentData,
  'smartresponse-field-studies':
    smartResponseFieldStudies as CaseStudyContentData,
}

export function getCaseStudyContent(
  slug: string,
): CaseStudyContentData | undefined {
  return contentBySlug[slug]
}

import Link from 'next/link'
import CurrentYear from '@/components/CurrentYear'

// ─── Navigation ────────────────────────────────────────────────────────────────
// Shared navigation panel — used in the Home left rail, the Article/Case Study
// right rail (vertical), and the Article stacked header (horizontal).
// Contains: page links, social links, and an optional copyright line.
// The glyph and brand summary are rendered by the page template, NOT here.
//
// Each spoke hides its own page link via the display* flags so the current
// page is never linked to itself (hub-and-spoke model):
//   • Home      → displayCaseStudies={false}
//   • About me  → displayAbout={false}
//   • Manifesto → displayManifesto={false}

export default function Navigation({
  displayAbout = true,
  displayManifesto = true,
  displayCaseStudies = true,
  layout = 'vertical',
  showCopyright = true,
}: {
  displayAbout?: boolean
  displayManifesto?: boolean
  displayCaseStudies?: boolean
  layout?: 'vertical' | 'horizontal'
  showCopyright?: boolean
} = {}) {
  const pageLinks = (
    <nav className="flex flex-col gap-16 items-start" aria-label="Site navigation">
      {displayAbout && <NavLink href="/bio">About me</NavLink>}
      {displayManifesto && <NavLink href="/enfineitz">What is Enfineitz?</NavLink>}
      {displayCaseStudies && <NavLink href="/">Case studies</NavLink>}
      <SocialLink
        href="https://www.upwork.com/freelancers/enfineitz"
        iconClass="nav-social-icon--upwork"
        label="Upwork"
      />
    </nav>
  )

  const socialLinks = (
    <>
      <SocialLink
        href="https://www.linkedin.com/in/enfineitz/"
        iconClass="nav-social-icon--linkedin"
        label="LinkedIn"
      />
      <SocialLink
        href="mailto:jurgen@enfineitz.com"
        iconClass="nav-social-icon--email"
        label="Jürgen"
      />
      <SocialLink
        href="https://www.behance.net/bunyip21"
        iconClass="nav-social-icon--behance"
        label="Bēhance"
      />
      <SocialLink
        href="https://soundcloud.com/jurgen-mantzke-752342688/sets/human-nature-is-europa?si=a6c7460b97e340aa99f938bd67302d89&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
        iconClass="nav-social-icon--soundcloud"
        label="Soundcloud"
      />
    </>
  )

  // ── Horizontal: two side-by-side columns (Article stacked header, xs/sm) ──
  if (layout === 'horizontal') {
    return (
      <div className="flex flex-wrap gap-12 items-start w-full">
        <div className="flex-1 min-w-[8.75rem]">{pageLinks}</div>
        <div className="flex flex-col gap-16 items-start flex-1 min-w-[8.75rem]">
          {socialLinks}
        </div>
        {showCopyright && <Copyright />}
      </div>
    )
  }

  // ── Vertical: stacked rail (Home left rail, Article/Case Study right rail) ──
  return (
    <div className="flex flex-col gap-64 items-start w-full">
      {pageLinks}
      <div className="flex flex-col gap-24 items-start w-[235px] shrink-0">
        {socialLinks}
      </div>
      {showCopyright && <Copyright />}
    </div>
  )
}

// ─── Copyright ────────────────────────────────────────────────────────────────

function Copyright() {
  return (
    <div className="flex items-center py-16 w-full shrink-0">
      <p
        className={[
          'font-body font-normal',
          'text-label leading-none tracking-normal',
          'text-[var(--text-caption)]',
          'whitespace-nowrap',
        ].join(' ')}
      >
        ©<CurrentYear from={new Date().getFullYear()} /> Enfineitz LLC
      </p>
    </div>
  )
}

// ─── Nav Link ─────────────────────────────────────────────────────────────────
// mozilla-headline Medium, 14px, tracking loose (1px)

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={[
        'font-display font-[600]',
        'text-body-lg tracking-wide',
        'text-[var(--link-rest)]',
        'hover:text-[var(--link-hover)]',
        'py-2',                       // margin/3xs = 2px vertical padding
        'transition-colors duration-150',
        'whitespace-nowrap',
      ].join(' ')}
    >
      {children}
    </Link>
  )
}

// ─── Social Link ──────────────────────────────────────────────────────────────
// Icon + link — mozilla-headline Medium, 14px, tracking wide.
// The icon is a CSS mask painted with currentColor, so it shares the link text
// color in every state (rest/hover). The whole row is a single link.

function SocialLink({
  href,
  iconClass,
  label,
}: {
  href: string
  iconClass: string
  label: string
}) {
  return (
    <a
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
      className={[
        'flex gap-8 items-center shrink-0',
        'font-display font-[600]',
        'text-body-lg tracking-wide',
        'text-[var(--link-rest)]',
        'hover:text-[var(--link-hover)]',
        'py-2',
        'transition-colors duration-150',
        'whitespace-nowrap',
      ].join(' ')}
    >
      {/* Social icons live in /public/icons/ as 16×16 SVGs; recolored via mask. */}
      <span className={`nav-social-icon ${iconClass}`} aria-hidden="true" />
      {label}
    </a>
  )
}

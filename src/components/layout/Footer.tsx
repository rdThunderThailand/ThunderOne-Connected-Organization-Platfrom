import Link from "next/link";
import type { SVGProps } from "react";

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 8.5H3.56v12h3.38v-12Z" />
      <path d="M5.25 7A2 2 0 1 0 5.25 3a2 2 0 0 0 0 4Z" />
      <path d="M20.5 20.5h-3.37v-5.87c0-1.47-.52-2.47-1.84-2.47-1 0-1.6.68-1.87 1.34-.1.24-.12.57-.12.9v6.1H9.92s.05-10.97 0-12h3.38v1.44c.45-.7 1.25-1.7 3.29-1.7 2.53 0 4.41 1.66 4.41 5.12v7.14Z" />
    </svg>
  );
}

function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.95C17.9 4.75 12 4.75 12 4.75s-5.9 0-7.64.49A2.75 2.75 0 0 0 2.42 7.19 28.6 28.6 0 0 0 2 12a28.6 28.6 0 0 0 .42 4.81 2.75 2.75 0 0 0 1.94 1.95c1.74.49 7.64.49 7.64.49s5.9 0 7.64-.49a2.75 2.75 0 0 0 1.94-1.95A28.6 28.6 0 0 0 22 12a28.6 28.6 0 0 0-.42-4.81ZM10.02 15.02V8.98L15.5 12l-5.48 3.02Z" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

const footerNav = [
  {
    title: "SOLUTIONS",
    links: [
      { label: "Digital Signage & Media", href: "/solutions/digital-signage-media" },
      { label: "Communication", href: "/solutions/communication" },
      { label: "Thunder Care", href: "/solutions/thunder-care" },
      { label: "Asset Intelligence", href: "/solutions/asset-intelligence" },
    ],
  },
  {
    title: "PLATFORM",
    links: [
      { label: "Overview", href: "/platform" },
      { label: "Experience", href: "/platform/experience" },
      { label: "Intelligence & Automation", href: "/platform/intelligence-automation" },
      { label: "Integrations", href: "/platform/integrations" },
      { label: "Security", href: "/platform/security" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Knowledge", href: "/resources/knowledge" },
      { label: "Customer Stories", href: "/resources/customer-stories" },
      { label: "Documentation", href: "/resources/documentation" },
      { label: "Support", href: "/resources/support" },
    ],
  },
  {
    title: "PARTNERS",
    links: [{ label: "Partner with ThunderOne", href: "/partners" }],
  },
  {
    title: "ABOUT",
    links: [
      { label: "About ThunderOne", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/thunderone", icon: LinkedInIcon },
  { label: "YouTube", href: "https://www.youtube.com/@thunderone", icon: YouTubeIcon },
  { label: "Facebook", href: "https://www.facebook.com/thunderone", icon: FacebookIcon },
];

export function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-300">
      <div className="px-10 py-6">
        <div className="flex flex-wrap gap-x-8 gap-y-10 lg:flex-nowrap lg:gap-5">
          <div className="w-full lg:w-56 lg:shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-brand-navy">
                T1
              </span>
              <span className="text-lg font-bold text-white">
                Thunder<span className="text-brand-blue">One</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Empowered People.
              <br />
              Connected Organization.
            </p>
          </div>

          {footerNav.map((column) => (
            <div key={column.title} className="w-1/2 sm:w-1/3 lg:w-auto lg:flex-1">
              <h3 className="text-xs font-semibold tracking-wider text-slate-400">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-300 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="w-1/2 sm:w-1/3 lg:w-auto lg:flex-1">
            <h3 className="text-xs font-semibold tracking-wider text-slate-400">FOLLOW US</h3>
            <div className="mt-4 flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-600 text-slate-300 hover:border-white hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
            <Link
              href="https://docs.thunderone.asia"
              target="_blank"
              rel="noreferrer"
              className="mt-6 block text-sm font-medium text-white hover:text-brand-blue"
            >
              docs.thunderone.asia
            </Link>
          </div>


        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ThunderOne. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/pdpa" className="hover:text-white">
              PDPA
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

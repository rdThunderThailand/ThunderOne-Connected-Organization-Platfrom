"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe, Menu, MessageCircle, X } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  {
    label: "Solutions",
    href: "/solutions",
    children: [
      { label: "Digital Signage & Media", href: "/solutions/digital-signage-media" },
      { label: "Communication", href: "/solutions/communication" },
      { label: "Thunder Care", href: "/solutions/thunder-care" },
      { label: "Asset Intelligence", href: "/solutions/asset-intelligence" },
    ],
  },
  {
    label: "Use Cases",
    href: "/use-cases",
    children: [
      { label: "Corporate & Enterprise", href: "/use-cases/corporate-enterprise" },
      { label: "Retail & Hospitality", href: "/use-cases/retail-hospitality" },
      { label: "Manufacturing & Industrial", href: "/use-cases/manufacturing-industrial" },
      { label: "Healthcare", href: "/use-cases/healthcare" },
    ],
  },
  {
    label: "Platform",
    href: "/platform",
    children: [
      { label: "Overview", href: "/platform" },
      { label: "Experience", href: "/platform/experience" },
      { label: "Intelligence & Automation", href: "/platform/intelligence-automation" },
      { label: "Integrations", href: "/platform/integrations" },
      { label: "Security", href: "/platform/security" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Knowledge", href: "/resources/knowledge" },
      { label: "Customer Stories", href: "/resources/customer-stories" },
      { label: "Documentation", href: "/resources/documentation" },
      { label: "Support", href: "/resources/support" },
    ],
  },
  { label: "Partners", href: "/partners" },
  { label: "About", href: "/about" },
];

const languages = ["TH", "EN"];

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState(languages[0]);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <nav ref={navRef} className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy text-sm font-bold text-white">
            T1
          </span>
          <span className="text-lg font-bold text-brand-navy">
            Thunder<span className="text-brand-blue">One</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu((current) => (current === item.label ? null : item.label))
                  }
                  className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-brand-blue"
                  aria-expanded={openMenu === item.label}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openMenu === item.label ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm font-medium text-slate-700 hover:text-brand-blue"
                >
                  {item.label}
                </Link>
              )}

              {item.children && openMenu === item.label && (
                <div className="absolute left-0 top-full mt-3 w-64 rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setOpenMenu(null)}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((open) => !open)}
              className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-brand-blue hover:text-brand-blue"
              aria-expanded={langOpen}
            >
              <Globe className="h-4 w-4" />
              {language}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-24 rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setLanguage(lang);
                      setLangOpen(false);
                    }}
                    className="block w-full rounded-lg px-3 py-1.5 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/login"
            className="rounded-full border border-brand-navy px-5 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-50"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            พูดคุยกับเรา
            <MessageCircle className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex items-center justify-center rounded-lg p-2 text-slate-700 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="py-1">
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 text-sm font-semibold text-slate-800"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-slate-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-1.5 text-sm text-slate-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4">
            <Link
              href="/login"
              className="rounded-full border border-brand-navy px-5 py-2 text-center text-sm font-semibold text-brand-navy"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-2 text-sm font-semibold text-white"
            >
              พูดคุยกับเรา
              <MessageCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

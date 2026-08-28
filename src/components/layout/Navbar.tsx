"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Globe, Menu, MessageCircle, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import thunderOneLogo from "@/components/logo/Horizontal TextBlack.svg";

type NavItem = {
  key: string;
  label: string;
  href: string;
  children?: { key: string; label: string; href: string }[];
};

const localeLabels: Record<string, string> = {
  th: "TH",
  en: "EN",
};

export function Navbar() {
  const t = useTranslations("Navbar");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      key: "solutions",
      label: t("solutions"),
      href: "/solutions",
      children: [
        {
          key: "digital-signage-media",
          label: t("solutionsDigitalSignageMedia"),
          href: "/solutions/digital-signage-media",
        },
        {
          key: "communication",
          label: t("solutionsCommunication"),
          href: "/solutions/communication",
        },
        {
          key: "thunder-care",
          label: tCommon("thunderCare"),
          href: "/solutions/thunder-care",
        },
        {
          key: "asset-intelligence",
          label: t("solutionsAssetIntelligence"),
          href: "/solutions/asset-intelligence",
        },
      ],
    },
    {
      key: "use-cases",
      label: t("useCases"),
      href: "/use-cases",
      children: [
        {
          key: "corporate-enterprise",
          label: t("useCasesCorporateEnterprise"),
          href: "#/use-cases/corporate-enterprise",
        },
        {
          key: "retail-hospitality",
          label: t("useCasesRetailHospitality"),
          href: "#/use-cases/retail-hospitality",
        },
        {
          key: "manufacturing-industrial",
          label: t("useCasesManufacturingIndustrial"),
          href: "#/use-cases/manufacturing-industrial",
        },
        {
          key: "healthcare",
          label: t("useCasesHealthcare"),
          href: "#/use-cases/healthcare",
        },
      ],
    },
    {
      key: "platform",
      label: t("platform"),
      href: "/platform",
      children: [
        { key: "overview", label: t("platformOverview"), href: "#/platform" },
        { key: "experience", label: t("platformExperience"), href: "#/platform/experience" },
        {
          key: "intelligence-automation",
          label: t("platformIntelligenceAutomation"),
          href: "#/platform/intelligence-automation",
        },
        {
          key: "integrations",
          label: t("platformIntegrations"),
          href: "#/platform/integrations",
        },
        { key: "security", label: t("platformSecurity"), href: "#/platform/security" },
      ],
    },
    {
      key: "resources",
      label: t("resources"),
      href: "/resources",
      children: [
        { key: "knowledge", label: t("resourcesKnowledge"), href: "#/resources/knowledge" },
        {
          key: "customer-stories",
          label: t("resourcesCustomerStories"),
          href: "#/resources/customer-stories",
        },
        {
          key: "documentation",
          label: t("resourcesDocumentation"),
          href: "#/resources/documentation",
        },
        { key: "support", label: t("resourcesSupport"), href: "#/resources/support" },
      ],
    },
    { key: "partners", label: t("partners"), href: "#/partners" },
    { key: "about", label: t("about"), href: "#/about" },
  ];

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const openTalkToUs = useTalkToUsStore((s) => s.open);

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
        <Link href="/" className="flex shrink-0 items-center">
          <Image src={thunderOneLogo} alt="ThunderOne" className="h-12 w-auto" priority />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <div key={item.key} className="relative">
              {item.children ? (
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu((current) => (current === item.key ? null : item.key))
                  }
                  className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-brand-blue"
                  aria-expanded={openMenu === item.key}
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openMenu === item.key ? "rotate-180" : ""
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

              {item.children && openMenu === item.key && (
                <div className="absolute left-0 top-full mt-3 w-64 rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
                  {item.children.map((child) => (
                    <Link
                      key={child.key}
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
              {localeLabels[locale] ?? locale.toUpperCase()}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-24 rounded-xl border border-slate-100 bg-white p-1 shadow-lg">
                {routing.locales.map((loc) => (
                  <Link
                    key={loc}
                    href={pathname}
                    locale={loc}
                    onClick={() => setLangOpen(false)}
                    className="block w-full rounded-lg px-3 py-1.5 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-blue"
                  >
                    {localeLabels[loc] ?? loc.toUpperCase()}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="https://app.thunderone.asia"
            className="rounded-full border border-brand-navy px-5 py-2 text-sm font-semibold text-brand-navy hover:bg-slate-50"
          >
            {t("login")}
          </Link>
          <button
            type="button"
            onClick={openTalkToUs}
            className="flex items-center gap-2 rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-blue"
          >
            {t("contact")}
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex items-center justify-center rounded-lg p-2 text-slate-700 lg:hidden"
          aria-label={t("toggleMenu")}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.key} className="py-1">
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
                        key={child.key}
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
              href="#/login"
              className="rounded-full border border-brand-navy px-5 py-2 text-center text-sm font-semibold text-brand-navy"
            >
              {t("login")}
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openTalkToUs();
              }}
              className="flex items-center justify-center gap-2 rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-blue"
            >
              {t("contact")}
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

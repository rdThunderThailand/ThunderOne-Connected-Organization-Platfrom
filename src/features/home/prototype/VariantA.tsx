"use client";

// PROTOTYPE — throwaway, not production
// Variant A: "Guided Narrative" — keeps the real page's 8-section story in
// the same order, but fixes the responsive/layout gaps found in review:
// a consistent sm/md/lg breakpoint ladder (not just lg), alternating
// section backgrounds for rhythm, a sticky in-page progress rail (lg+),
// and a floating mobile CTA bar that appears once the hero scrolls away.

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Box,
  BriefcaseMedical,
  Building2,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileText,
  Headset,
  Layers,
  Megaphone,
  MessageCircle,
  Monitor,
  Package,
  Sparkles,
  Target,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HeroOrbitDiagram, type OrbitNode } from "@/components/diagrams/HeroOrbitDiagram";
import type {
  CtaContent,
  HeroContent,
  IntegrationContent,
  PersonaContent,
  PersonaGroup,
  PerspectiveContent,
  PerspectiveRole,
  ProblemContent,
  ShowcaseContent,
  ShowcaseTabKey,
  SolutionsContent,
} from "../types";

type VariantAProps = {
  hero: HeroContent;
  problem: ProblemContent;
  persona: PersonaContent;
  perspective: PerspectiveContent;
  solutions: SolutionsContent;
  showcase: ShowcaseContent;
  integration: IntegrationContent;
  cta: CtaContent;
};

const SECTION_IDS = [
  "hero",
  "problem",
  "persona",
  "perspective",
  "solutions",
  "showcase",
  "integration",
  "cta",
] as const;

const HERO_NODE_ORDER: { key: keyof HeroContent["diagramNodes"]; icon: LucideIcon; badgeClassName: string }[] = [
  { key: "people", icon: Users, badgeClassName: "bg-sky-500" },
  { key: "space", icon: Building2, badgeClassName: "bg-orange-500" },
  { key: "asset", icon: Box, badgeClassName: "bg-blue-600" },
  { key: "device", icon: Package, badgeClassName: "bg-indigo-500" },
  { key: "service", icon: Headset, badgeClassName: "bg-violet-600" },
  { key: "communication", icon: Megaphone, badgeClassName: "bg-blue-500" },
  { key: "work", icon: ClipboardCheck, badgeClassName: "bg-emerald-500" },
];

const CONTEXT_ICONS: { key: keyof ProblemContent["contextItems"]; icon: LucideIcon }[] = [
  { key: "people", icon: UserPlus },
  { key: "work", icon: BriefcaseMedical },
  { key: "data", icon: FileText },
  { key: "communication", icon: MessageCircle },
  { key: "system", icon: Layers },
  { key: "space", icon: Building2 },
  { key: "asset", icon: Target },
];

const PERSONA_STYLES: { key: "freeMe" | "helpMe" | "connectUs"; icon: LucideIcon; accent: string }[] = [
  { key: "freeMe", icon: Clock, accent: "text-emerald-600 bg-emerald-50" },
  { key: "helpMe", icon: Sparkles, accent: "text-brand-blue bg-brand-blue/10" },
  { key: "connectUs", icon: Users, accent: "text-purple-600 bg-purple-50" },
];

const ROLE_PHOTOS: { key: "executive" | "manager" | "people"; src: string }[] = [
  { key: "executive", src: "/images/perspective/executive.jpg" },
  { key: "manager", src: "/images/perspective/manager.jpg" },
  { key: "people", src: "/images/perspective/people.jpg" },
];

const SOLUTION_ICONS: LucideIcon[] = [Monitor, Megaphone, Headset, Box];

const SHOWCASE_TAB_KEYS: ShowcaseTabKey[] = ["executive", "manager", "myWork", "communication", "care"];

const PARTNER_NAMES = ["SAP", "Oracle", "Salesforce", "Workday", "Microsoft 365", "Google Workspace"];

function SectionShell({
  id,
  bg,
  register,
  children,
}: {
  id: string;
  bg: "white" | "slate";
  register: (id: string) => (el: HTMLElement | null) => void;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      ref={register(id)}
      className={`scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-8 ${
        bg === "white" ? "bg-white" : "bg-slate-50"
      }`}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function VariantA({ hero, problem, persona, perspective, solutions, showcase, integration, cta }: VariantAProps) {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [pastHero, setPastHero] = useState(false);
  const [showcaseTab, setShowcaseTab] = useState<ShowcaseTabKey>("executive");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleScroll() {
      setPastHero(window.scrollY > 500);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function register(id: string) {
    return (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    };
  }

  const heroNodes: OrbitNode[] = HERO_NODE_ORDER.map(({ key, icon, badgeClassName }) => ({
    key,
    icon,
    badgeClassName,
    label: hero.diagramNodes[key],
  }));

  const dashboard = showcase.dashboards[showcaseTab];

  return (
    <div className="relative">
      <nav
        aria-label="Section progress"
        className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
      >
        {SECTION_IDS.map((id) => (
          <a key={id} href={`#${id}`} className="group flex items-center gap-2" aria-current={activeSection === id ? "true" : undefined}>
            <span
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                activeSection === id ? "bg-brand-blue" : "bg-slate-300 group-hover:bg-slate-400"
              }`}
            />
            <span
              className={`pointer-events-none whitespace-nowrap rounded-full bg-brand-navy px-2.5 py-1 text-xs font-semibold text-white shadow-md transition-opacity ${
                activeSection === id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {id}
            </span>
          </a>
        ))}
      </nav>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur transition-transform lg:hidden ${
          pastHero ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <Link
          href="/platform"
          className="flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white"
        >
          {hero.ctaPrimary}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <SectionShell id="hero" bg="white" register={register}>
        <div className="grid gap-10 sm:gap-12 md:py-4 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-500">{hero.trustedBy}</p>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-navy sm:text-4xl md:text-5xl">
              <span className="block">{hero.titleLine1}</span>
              <span className="block">{hero.titleLine2}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-slate-600 sm:text-lg">{hero.description}</p>
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Link href="/platform" className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                {hero.ctaPrimary}
              </Link>
              <Link href="/contact" className="rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-50">
                {hero.ctaSecondary}
              </Link>
            </div>
          </div>
          <HeroOrbitDiagram nodes={heroNodes} caption={hero.diagramCaption} />
        </div>
      </SectionShell>

      <SectionShell id="problem" bg="slate" register={register}>
        <div className="grid gap-10 md:grid-cols-[minmax(0,420px)_1fr] md:items-center">
          <div>
            <span className="text-sm font-semibold text-brand-blue">{problem.badge}</span>
            <h2 className="mt-4 text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">
              <span className="block">{problem.titleLine1}</span>
              <span className="block">{problem.titleLine2}</span>
            </h2>
          </div>
          <div>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {CONTEXT_ICONS.map(({ key, icon: Icon }) => (
                <div key={key} className="flex w-20 flex-col items-center gap-2 text-center sm:w-24">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy shadow-sm sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <span className="text-xs font-medium text-slate-600">{problem.contextItems[key]}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-lg font-bold text-brand-blue sm:text-xl">{problem.tagline}</p>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="persona" bg="white" register={register}>
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{persona.badge}</span>
        <div className="mt-4 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {PERSONA_STYLES.map(({ key, icon: Icon, accent }) => {
            const group: PersonaGroup = persona[key];
            return (
              <div key={key} className="rounded-2xl border border-slate-200 p-6 text-center">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className={`mt-4 text-xs font-semibold uppercase tracking-wider ${accent.split(" ")[0]}`}>{group.label}</p>
                <h3 className="mt-1 text-sm font-semibold text-brand-navy">{group.title}</h3>
                <ul className="mt-4 space-y-2 text-left">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${accent.split(" ")[0]}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </SectionShell>

      <SectionShell id="perspective" bg="slate" register={register}>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{perspective.title}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {ROLE_PHOTOS.map(({ key, src }) => {
            const role: PerspectiveRole = perspective[key];
            return (
              <div key={key} className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex-1 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">{role.role}</p>
                  <p className="mt-1 text-sm font-semibold text-brand-navy">{role.question}</p>
                  <ul className="mt-3 space-y-1.5">
                    {role.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative hidden w-24 shrink-0 sm:block">
                  <Image src={src} alt="" fill className="object-cover" sizes="6rem" />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center text-lg font-bold text-brand-blue sm:text-xl">{perspective.tagline}</p>
      </SectionShell>

      <SectionShell id="solutions" bg="white" register={register}>
        <div className="grid gap-10 md:grid-cols-[minmax(0,280px)_1fr] md:items-start">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{solutions.badge}</span>
            <h2 className="mt-4 text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">{solutions.title}</h2>
            <p className="mt-4 text-slate-600">{solutions.description}</p>
            <Link href="/solutions" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline">
              {solutions.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {solutions.items.map((item, index) => {
              const Icon = SOLUTION_ICONS[index % SOLUTION_ICONS.length];
              return (
                <Link key={item.title} href={item.link} className="group flex flex-col rounded-2xl border border-slate-200 p-5 hover:border-brand-blue">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-xs font-bold tracking-wide text-brand-navy">{item.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-brand-navy">{item.tagline}</p>
                  <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-blue">
                    {item.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </SectionShell>

      <SectionShell id="showcase" bg="slate" register={register}>
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{showcase.badge}</span>
        <h2 className="mt-4 text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">{showcase.title}</h2>
        <p className="mt-4 max-w-2xl text-slate-600">{showcase.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {SHOWCASE_TAB_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setShowcaseTab(key)}
              aria-pressed={showcaseTab === key}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                showcaseTab === key ? "bg-brand-navy text-white" : "border border-slate-200 text-slate-600 hover:border-brand-blue"
              }`}
            >
              {showcase.tabs[key]}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-lg font-bold text-brand-navy">{dashboard.greeting}</p>
          <p className="text-sm text-slate-500">{dashboard.subtitle}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-slate-50 p-3 text-center">
              <p className="text-lg font-bold text-emerald-600">{dashboard.progressValue}</p>
              <p className="mt-1 text-[11px] text-slate-500">{dashboard.progressLabel}</p>
            </div>
            {dashboard.metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl bg-slate-50 p-3">
                <p className="text-lg font-bold text-brand-navy">{metric.value}</p>
                <p className="mt-1 text-[11px] font-medium text-slate-500">{metric.label}</p>
                <p className="text-[10px] text-slate-400">{metric.sublabel}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-slate-500">{dashboard.highlightsTitle}</p>
              <ul className="mt-2 space-y-1.5">
                {dashboard.highlights.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-xs">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-[10px] text-slate-400">{item.meta}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">{dashboard.decisionsTitle}</p>
              <ul className="mt-2 space-y-1.5">
                {dashboard.decisions.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-xs">
                    <span className="text-slate-600">{item.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell id="integration" bg="white" register={register}>
        <div className="grid gap-8 md:grid-cols-[minmax(0,300px)_1fr] md:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{integration.badge}</span>
            <h2 className="mt-4 text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">{integration.title}</h2>
            <p className="mt-4 text-slate-600">{integration.description}</p>
            <Link href="/platform" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline">
              {integration.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <div className="flex flex-wrap gap-3">
              {PARTNER_NAMES.map((name) => (
                <span key={name} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm">
                  {name}
                </span>
              ))}
              <span className="rounded-2xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-500">
                {integration.otherSystemsLabel}
              </span>
            </div>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-brand-navy shadow-sm">
              <Sparkles className="h-4 w-4 text-brand-blue" />
              {integration.pillLabel}
            </span>
          </div>
        </div>
      </SectionShell>

      <section id="cta" ref={register("cta")} className="scroll-mt-24 bg-brand-navy px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">{cta.title}</h2>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">{cta.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-100">
              {cta.ctaPrimary}
            </Link>
            <a href="#" className="flex items-center gap-2 rounded-full bg-[#06C755] px-6 py-3 text-sm font-semibold text-white hover:bg-[#05b34c]">
              <MessageCircle className="h-4 w-4" />
              {cta.ctaLine}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

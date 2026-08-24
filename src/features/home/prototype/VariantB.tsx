"use client";

// PROTOTYPE — throwaway, not production
// Variant B: "Persona-First" — the hero opens with a 3-way persona picker
// (Executive / Manager / People). Choosing one foregrounds the matching
// perspective, benefit card, and solution downstream, and pre-selects the
// matching showcase tab. A sticky left icon-rail (desktop only) replaces
// the full-width stacked-band feel with an app-shell-like structure.

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Layers,
  MessageCircle,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type {
  CtaContent,
  HeroContent,
  IntegrationContent,
  PersonaContent,
  PerspectiveContent,
  ProblemContent,
  ShowcaseContent,
  ShowcaseTabKey,
  SolutionsContent,
} from "../types";

type VariantBProps = {
  hero: HeroContent;
  problem: ProblemContent;
  persona: PersonaContent;
  perspective: PerspectiveContent;
  solutions: SolutionsContent;
  showcase: ShowcaseContent;
  integration: IntegrationContent;
  cta: CtaContent;
};

type PersonaKey = "executive" | "manager" | "people";

const PERSONA_TILES: { key: PersonaKey; icon: LucideIcon }[] = [
  { key: "executive", icon: Briefcase },
  { key: "manager", icon: Users },
  { key: "people", icon: UserPlus },
];

const PERSONA_TO_BENEFIT: Record<PersonaKey, "freeMe" | "helpMe" | "connectUs"> = {
  executive: "connectUs",
  manager: "helpMe",
  people: "freeMe",
};

const PERSONA_TO_SHOWCASE_TAB: Record<PersonaKey, ShowcaseTabKey> = {
  executive: "executive",
  manager: "manager",
  people: "myWork",
};

const BENEFIT_STYLES: { key: "freeMe" | "helpMe" | "connectUs"; accent: string }[] = [
  { key: "freeMe", accent: "text-emerald-600 bg-emerald-50" },
  { key: "helpMe", accent: "text-brand-blue bg-brand-blue/10" },
  { key: "connectUs", accent: "text-purple-600 bg-purple-50" },
];

const RAIL_ITEMS: { id: string; icon: LucideIcon }[] = [
  { id: "perspective", icon: Users },
  { id: "problem", icon: Layers },
  { id: "persona", icon: Sparkles },
  { id: "solutions", icon: Boxes },
  { id: "showcase", icon: BarChart3 },
  { id: "integration", icon: Building2 },
  { id: "cta", icon: MessageCircle },
];

const PARTNER_NAMES = ["SAP", "Oracle", "Salesforce", "Workday", "Microsoft 365", "Google Workspace"];

export function VariantB({ hero, problem, persona, perspective, solutions, showcase, integration, cta }: VariantBProps) {
  const [selectedPersona, setSelectedPersona] = useState<PersonaKey>("executive");
  const [showcaseTab, setShowcaseTab] = useState<ShowcaseTabKey>("executive");
  const [showOtherRoles, setShowOtherRoles] = useState(false);

  function selectPersona(key: PersonaKey) {
    setSelectedPersona(key);
    setShowcaseTab(PERSONA_TO_SHOWCASE_TAB[key]);
    setShowOtherRoles(false);
  }

  const selectedRole = perspective[selectedPersona];
  const otherRoleKeys = (["executive", "manager", "people"] as PersonaKey[]).filter((key) => key !== selectedPersona);
  const matchedBenefit = PERSONA_TO_BENEFIT[selectedPersona];
  const matchedSolutionIndex = Math.min(
    (["executive", "manager", "people"] as PersonaKey[]).indexOf(selectedPersona),
    solutions.items.length - 1,
  );
  const dashboard = showcase.dashboards[showcaseTab];

  return (
    <div className="bg-white">
      <section className="border-b border-slate-100 px-4 py-14 sm:px-6 sm:py-16 md:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold text-slate-500">{hero.trustedBy}</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-navy sm:text-4xl md:text-5xl">
            <span className="block">{hero.titleLine1}</span>
            <span className="block">{hero.titleLine2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-slate-600 sm:text-lg">{hero.description}</p>

          <p className="mt-10 text-xs font-semibold uppercase tracking-wide text-brand-blue">
            {perspective.title}
          </p>
          <div className="mx-auto mt-4 grid max-w-3xl gap-4 sm:grid-cols-3">
            {PERSONA_TILES.map(({ key, icon: Icon }) => {
              const role = perspective[key];
              const isActive = selectedPersona === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectPersona(key)}
                  aria-pressed={isActive}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-left transition-colors sm:items-start ${
                    isActive ? "border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/30" : "border-slate-200 hover:border-brand-blue/50"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-center text-sm font-bold text-brand-navy sm:text-left">{role.role}</span>
                  <span className="text-center text-xs text-slate-500 sm:text-left">{role.question}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/platform" className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              {hero.ctaPrimary}
            </Link>
            <Link href="/contact" className="rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-50">
              {hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:grid lg:grid-cols-[72px_1fr] lg:gap-8 lg:px-8 lg:py-14">
        <aside className="hidden lg:sticky lg:top-24 lg:flex lg:h-fit lg:flex-col lg:items-center lg:gap-4">
          {RAIL_ITEMS.map(({ id, icon: Icon }) => (
            <a
              key={id}
              href={`#${id}`}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-brand-blue hover:text-brand-blue"
              aria-label={id}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </aside>

        <div className="flex flex-col gap-14 sm:gap-16">
          <section id="perspective" className="scroll-mt-24">
            <div className="rounded-2xl border border-brand-blue/30 bg-brand-blue/5 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">{selectedRole.role}</p>
              <p className="mt-1 text-lg font-bold text-brand-navy sm:text-xl">{selectedRole.question}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {selectedRole.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowOtherRoles((value) => !value)}
              className="mt-4 flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-brand-navy"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showOtherRoles ? "rotate-180" : ""}`} />
              {showOtherRoles ? "Hide other roles" : "See other roles"}
            </button>

            {showOtherRoles && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {otherRoleKeys.map((key) => {
                  const role = perspective[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selectPersona(key)}
                      className="rounded-xl border border-slate-200 p-4 text-left hover:border-brand-blue"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{role.role}</p>
                      <p className="mt-1 text-sm font-semibold text-brand-navy">{role.question}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section id="problem" className="scroll-mt-24 rounded-2xl bg-slate-50 p-6 sm:p-8">
            <span className="text-sm font-semibold text-brand-blue">{problem.badge}</span>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">
              <span className="block">{problem.titleLine1}</span>
              <span className="block">{problem.titleLine2}</span>
            </h2>
            <p className="mt-4 text-lg font-bold text-brand-blue">{problem.tagline}</p>
          </section>

          <section id="persona" className="scroll-mt-24">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{persona.badge}</span>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {BENEFIT_STYLES.map(({ key, accent }) => {
                const group = persona[key];
                const isMatched = key === matchedBenefit;
                return (
                  <div
                    key={key}
                    className={`relative rounded-2xl border p-6 ${
                      isMatched ? "border-brand-blue shadow-md" : "border-slate-200"
                    }`}
                  >
                    {isMatched && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-blue px-3 py-1 text-[10px] font-bold text-white shadow">
                        Recommended for {selectedRole.role}
                      </span>
                    )}
                    <p className={`text-xs font-semibold uppercase tracking-wider ${accent.split(" ")[0]}`}>{group.label}</p>
                    <h3 className="mt-1 text-sm font-semibold text-brand-navy">{group.title}</h3>
                    <ul className="mt-3 space-y-2">
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
          </section>

          <section id="solutions" className="scroll-mt-24">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{solutions.badge}</span>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">{solutions.title}</h2>
            <p className="mt-3 max-w-2xl text-slate-600">{solutions.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {solutions.items.map((item, index) => (
                <Link
                  key={item.title}
                  href={item.link}
                  className={`group relative flex flex-col rounded-2xl border p-5 hover:border-brand-blue ${
                    index === matchedSolutionIndex ? "border-brand-blue" : "border-slate-200"
                  }`}
                >
                  {index === matchedSolutionIndex && (
                    <span className="absolute -top-2 right-4 rounded-full bg-brand-blue px-2.5 py-0.5 text-[10px] font-bold text-white">
                      For you
                    </span>
                  )}
                  <h3 className="text-xs font-bold tracking-wide text-brand-navy">{item.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-brand-navy">{item.tagline}</p>
                  <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-blue">
                    {item.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section id="showcase" className="scroll-mt-24">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{showcase.badge}</span>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">{showcase.title}</h2>
            <p className="mt-1 text-xs text-slate-400">Showing the {showcase.tabs[showcaseTab]} view — matched to {selectedRole.role}</p>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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
          </section>

          <section id="integration" className="scroll-mt-24 rounded-2xl bg-slate-50 p-6 sm:p-8">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{integration.badge}</span>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">{integration.title}</h2>
            <p className="mt-3 max-w-2xl text-slate-600">{integration.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {PARTNER_NAMES.map((name) => (
                <span key={name} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm">
                  {name}
                </span>
              ))}
            </div>
            <Link href="/platform" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline">
              {integration.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>

      <section id="cta" className="scroll-mt-24 bg-brand-navy px-4 py-16 sm:px-6 md:py-20">
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

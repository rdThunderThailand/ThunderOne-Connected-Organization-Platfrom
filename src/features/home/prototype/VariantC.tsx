"use client";

// PROTOTYPE — throwaway, not production
// Variant C: "Bento Grid" — breaks away from stacked full-width bands.
// Everything from Problem through Integration is composed into one
// asymmetric CSS grid of mixed-width tiles. CTA stays a standalone
// full-width banner at the end — it's the conversion moment, not a tile.

import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Box,
  BriefcaseMedical,
  Building2,
  Check,
  ChevronRight,
  Clock,
  FileText,
  Headset,
  Layers,
  Megaphone,
  MessageCircle,
  Monitor,
  Sparkles,
  Target,
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

type VariantCProps = {
  hero: HeroContent;
  problem: ProblemContent;
  persona: PersonaContent;
  perspective: PerspectiveContent;
  solutions: SolutionsContent;
  showcase: ShowcaseContent;
  integration: IntegrationContent;
  cta: CtaContent;
};

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

const SOLUTION_ICONS: LucideIcon[] = [Monitor, Megaphone, Headset, Box];

const SHOWCASE_TAB_KEYS: ShowcaseTabKey[] = ["executive", "manager", "myWork", "communication", "care"];

const PARTNER_NAMES = ["SAP", "Oracle", "Salesforce", "Workday", "Microsoft 365", "Google Workspace"];

function Tile({ span, className, children }: { span: string; className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 ${span} ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function VariantC({ hero, problem, persona, perspective, solutions, showcase, integration, cta }: VariantCProps) {
  const [showcaseTab, setShowcaseTab] = useState<ShowcaseTabKey>("executive");
  const dashboard = showcase.dashboards[showcaseTab];

  return (
    <div className="bg-white">
      <section className="px-4 py-14 sm:px-6 sm:py-16 md:py-18 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold text-slate-500">{hero.trustedBy}</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-brand-navy sm:text-4xl md:text-5xl">
            <span className="block">{hero.titleLine1}</span>
            <span className="block">{hero.titleLine2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-slate-600 sm:text-lg">{hero.description}</p>
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

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          <Tile span="sm:col-span-2 lg:col-span-4">
            <span className="text-sm font-semibold text-brand-blue">{problem.badge}</span>
            <h2 className="mt-2 text-xl font-bold leading-snug text-brand-navy sm:text-2xl">
              <span className="block">{problem.titleLine1}</span>
              <span className="block">{problem.titleLine2}</span>
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {CONTEXT_ICONS.map(({ key, icon: Icon }) => (
                <span
                  key={key}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  <Icon className="h-3.5 w-3.5 text-brand-navy" />
                  {problem.contextItems[key]}
                </span>
              ))}
            </div>
          </Tile>

          <div className="col-span-full">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{persona.badge}</span>
          </div>

          {PERSONA_STYLES.map(({ key, icon: Icon, accent }) => {
            const group = persona[key];
            return (
              <Tile key={key} span="lg:col-span-1">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <p className={`mt-3 text-[11px] font-semibold uppercase tracking-wider ${accent.split(" ")[0]}`}>{group.label}</p>
                <h3 className="mt-1 text-sm font-semibold text-brand-navy">{group.title}</h3>
                <ul className="mt-3 space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accent.split(" ")[0]}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Tile>
            );
          })}

          <div className="flex flex-col justify-center rounded-2xl bg-brand-navy p-5 text-white sm:p-6 lg:col-span-1">
            <Sparkles className="h-5 w-5 text-brand-blue" />
            <p className="mt-3 text-sm font-bold leading-snug">{problem.tagline}</p>
          </div>

          <div className="col-span-full">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{perspective.title}</span>
          </div>

          <Tile span="sm:col-span-2 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">{perspective.executive.role}</p>
            <p className="mt-1 text-base font-semibold text-brand-navy">{perspective.executive.question}</p>
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {perspective.executive.items.map((item) => (
                <li key={item} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Tile>

          {(["manager", "people"] as const).map((key) => {
            const role = perspective[key];
            return (
              <Tile key={key} span="lg:col-span-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-blue">{role.role}</p>
                <p className="mt-1 text-sm font-semibold text-brand-navy">{role.question}</p>
                <ul className="mt-3 space-y-1.5">
                  {role.items.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-blue" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Tile>
            );
          })}

          <div className="col-span-full flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{solutions.badge}</span>
              <h2 className="mt-1 text-xl font-bold leading-snug text-brand-navy sm:text-2xl">{solutions.title}</h2>
            </div>
            <Link href="/solutions" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-blue hover:underline">
              {solutions.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {solutions.items.map((item, index) => {
            const Icon = SOLUTION_ICONS[index % SOLUTION_ICONS.length];
            return (
              <Tile key={item.title} span="lg:col-span-1" className="group hover:border-brand-blue">
                <Link href={item.link} className="flex h-full flex-col">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue text-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="mt-3 text-[11px] font-bold tracking-wide text-brand-navy">{item.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-brand-navy">{item.tagline}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-brand-blue">
                    {item.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Tile>
            );
          })}

          <Tile span="sm:col-span-2 lg:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{showcase.badge}</span>
                <h2 className="mt-1 text-xl font-bold leading-snug text-brand-navy sm:text-2xl">{showcase.title}</h2>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SHOWCASE_TAB_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setShowcaseTab(key)}
                    aria-pressed={showcaseTab === key}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      showcaseTab === key ? "bg-brand-navy text-white" : "border border-slate-200 text-slate-600 hover:border-brand-blue"
                    }`}
                  >
                    {showcase.tabs[key]}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <p className="text-lg font-bold text-emerald-600">{dashboard.progressValue}</p>
                <p className="mt-1 text-[11px] text-slate-500">{dashboard.progressLabel}</p>
              </div>
              {dashboard.metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-lg font-bold text-brand-navy">{metric.value}</p>
                  <p className="mt-1 text-[11px] font-medium text-slate-500">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ul className="space-y-1.5">
                {dashboard.highlights.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-xs">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-[10px] text-slate-400">{item.meta}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1.5">
                {dashboard.decisions.map((item) => (
                  <li key={item.label} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-xs">
                    <span className="text-slate-600">{item.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                  </li>
                ))}
              </ul>
            </div>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-400">
              <BarChart3 className="h-3.5 w-3.5" />
              {dashboard.highlightsTitle} · {dashboard.decisionsTitle}
            </span>
          </Tile>

          <Tile span="lg:col-span-1">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{integration.badge}</span>
            <h3 className="mt-1 text-sm font-bold text-brand-navy">{integration.title}</h3>
            <div className="mt-3 flex flex-col gap-1.5">
              {PARTNER_NAMES.map((name) => (
                <span key={name} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                  {name}
                </span>
              ))}
            </div>
            <Link href="/platform" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline">
              {integration.cta}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Tile>
        </div>
      </div>

      <section className="bg-brand-navy px-4 py-16 sm:px-6 md:py-20">
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

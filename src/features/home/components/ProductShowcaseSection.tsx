"use client";

// === Product Showcase Section: badge + heading + description + role tab
// switcher on the left, an illustrative dashboard mockup (sidebar, topbar,
// metrics, highlight/decision lists) plus a phone mockup on the right ===

// TODO: replace the mock dashboard/phone content with real product
// screenshots per tab once design assets are available.

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Briefcase,
  ChevronRight,
  Headset,
  Home,
  MessageCircle,
  Settings,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { ShowcaseContent, ShowcaseDashboard, ShowcaseTabKey } from "../types";

const TAB_KEYS: ShowcaseTabKey[] = ["executive", "manager", "myWork", "communication", "care"];

type ProductShowcaseSectionProps = {
  content: ShowcaseContent;
};

function ProgressRing({ value }: { value: number }) {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full"
      style={{ background: `conic-gradient(#10b981 ${value * 3.6}deg, #e2e8f0 0deg)` }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[10px] font-bold text-emerald-600">
        {value}%
      </div>
    </div>
  );
}

function DashboardMockup({ content, dashboard }: { content: ShowcaseContent; dashboard: ShowcaseDashboard }) {
  const navItems: { key: string; icon: LucideIcon; label: string }[] = [
    { key: "home", icon: Home, label: content.nav.home },
    { key: "missions", icon: Target, label: content.nav.missions },
    { key: "people", icon: Users, label: content.nav.people },
    { key: "myWork", icon: Briefcase, label: content.nav.myWork },
    { key: "communication", icon: MessageCircle, label: content.nav.communication },
    { key: "care", icon: Headset, label: content.nav.care },
    { key: "reports", icon: BarChart3, label: content.nav.reports },
    { key: "settings", icon: Settings, label: content.nav.settings },
  ];

  return (
    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="hidden w-40 shrink-0 flex-col gap-1 border-r border-slate-100 bg-slate-50 p-3 sm:flex">
        <div className="mb-3 flex items-center gap-1.5 px-2 text-sm font-bold text-brand-navy">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-navy text-[10px] text-white">
            T1
          </span>
          ThunderOne
        </div>
        {navItems.map(({ key, icon: Icon, label }, index) => (
          <span
            key={key}
            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium ${
              index === 0 ? "bg-brand-blue/10 text-brand-blue" : "text-slate-500"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1 p-5">
        <div className="flex items-center gap-2">
          <span className="h-8 flex-1 rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-400">
            {content.searchPlaceholder}
          </span>
          <span className="hidden items-center gap-1 rounded-full bg-brand-blue/10 px-3 py-1.5 text-xs font-semibold text-brand-blue sm:flex">
            <Sparkles className="h-3.5 w-3.5" />
            {content.aiAssistantLabel}
          </span>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Bell className="h-4 w-4" />
          </span>
          <span className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-brand-blue to-purple-400" />
        </div>

        <p className="mt-5 text-lg font-bold text-brand-navy">{dashboard.greeting}</p>
        <p className="mt-1 text-sm text-slate-500">{dashboard.subtitle}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 p-3 text-center">
            <ProgressRing value={Number.parseInt(dashboard.progressValue, 10) || 0} />
            <p className="mt-2 text-[11px] text-slate-500">{dashboard.progressLabel}</p>
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
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-xs"
                >
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" />
                    {item.label}
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-400">{item.meta}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">{dashboard.decisionsTitle}</p>
            <ul className="mt-2 space-y-1.5">
              {dashboard.decisions.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2 text-xs"
                >
                  <span className="text-slate-600">
                    <span className="block font-medium">{item.label}</span>
                    <span className="text-[10px] text-slate-400">{item.meta}</span>
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneMockup({ content }: { content: ShowcaseContent }) {
  const apps: { key: string; icon: LucideIcon; label: string }[] = [
    { key: "home", icon: Home, label: content.nav.home },
    { key: "missions", icon: Target, label: content.nav.missions },
    { key: "communication", icon: MessageCircle, label: content.nav.communication },
    { key: "care", icon: Headset, label: content.nav.care },
    { key: "reports", icon: BarChart3, label: content.nav.reports },
    { key: "people", icon: Users, label: content.nav.people },
  ];

  return (
    <div className="hidden h-88 w-40 shrink-0 rounded-[2rem] border-4 border-slate-900 bg-slate-900 p-1.5 shadow-lg sm:block">
      <div className="flex h-full w-full flex-col rounded-[1.5rem] bg-white p-3">
        <p className="flex items-center gap-1 text-xs font-bold text-brand-navy">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-brand-navy text-[8px] text-white">
            T1
          </span>
          {content.nav.home}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {apps.map(({ key, icon: Icon, label }) => (
            <div key={key} className="flex min-w-0 flex-col items-center gap-1 rounded-lg bg-slate-50 px-1 py-2">
              <Icon className="h-4 w-4 shrink-0 text-brand-blue" />
              <span className="w-full truncate text-center text-[8px] leading-tight text-slate-500">
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1.5">
          {["bg-red-400", "bg-amber-400", "bg-brand-blue"].map((dot) => (
            <div key={dot} className="flex items-center gap-1.5 rounded-md bg-slate-50 px-2 py-1.5">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
              <span className="h-1.5 flex-1 rounded-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductShowcaseSection({ content }: ProductShowcaseSectionProps) {
  const [activeTab, setActiveTab] = useState<ShowcaseTabKey>("executive");
  const dashboard = content.dashboards[activeTab];

  return (
    <section className="sm:px-4">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-100 bg-white px-4 py-10 shadow-lg sm:px-6 sm:py-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
          <div className="min-w-0">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{content.badge}</span>
            <div className="">
            <h2 className="mt-4 text-3xl font-bold leading-snug text-brand-navy sm:text-2xl">{content.titleLine1}</h2>
            <h2 className="text-3xl font-bold leading-snug text-brand-navy sm:text-2xl">{content.titleLine2}</h2>
            </div>


            <div className="mt-8 flex flex-wrap gap-2">
              {TAB_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    activeTab === key
                      ? "bg-brand-navy text-white"
                      : "border border-slate-200 text-slate-600 hover:border-brand-blue hover:text-brand-blue"
                  }`}
                  aria-pressed={activeTab === key}
                >
                  {content.tabs[key]}
                </button>
              ))}
            </div>
          </div>

          <div className="gap-3 ">
            <div className="flex min-w-160 items-end gap-6 lg:min-w-0">
              <div className="min-w-0 flex flex-1 items-center gap-6">
                <DashboardMockup content={content} dashboard={dashboard} />
                <PhoneMockup content={content} />
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

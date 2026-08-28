"use client";

// === Hero Section: badge "SOLUTION" + หัวข้อ + หัวข้อรองสี accent + คำอธิบาย
// + ปุ่ม CTA หลัก/รอง ฝั่งซ้าย, mockup dashboard (sidebar, stat การ์ด 4 อัน,
// จอล่าสุด, กำลังเล่นอยู่) ฝั่งขวา ===

// TODO: replace the mock dashboard content with a real product screenshot
// once design assets are available.

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  FolderOpen,
  LayoutDashboard,
  ListVideo,
  Megaphone,
  Monitor,
  Play,
  Settings,
  Share2,
} from "lucide-react";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import type { HeroContent } from "../types";

type HeroSectionProps = {
  content: HeroContent;
};

function DashboardMockup({ dashboard }: { dashboard: HeroContent["dashboard"] }) {
  const navIcons: LucideIcon[] = [
    LayoutDashboard,
    Monitor,
    FolderOpen,
    ListVideo,
    BarChart3,
    Share2,
    Megaphone,
    Settings,
  ];

  const stats = [
    dashboard.stats.screensOnline,
    dashboard.stats.activePlaylists,
    dashboard.stats.scheduledToday,
    dashboard.stats.audienceReach,
  ];

  return (
    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="hidden w-36 shrink-0 flex-col gap-1 border-r border-slate-100 bg-slate-50 p-3 sm:flex">
        {dashboard.nav.map((label, index) => {
          const Icon = navIcons[index % navIcons.length];
          return (
            <span
              key={label}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium ${
                index === 0 ? "bg-brand-blue/10 text-brand-blue" : "text-slate-500"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{label}</span>
            </span>
          );
        })}
      </div>

      <div className="min-w-0 flex-1 p-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-slate-50 p-3">
              <p className="text-lg font-bold text-brand-navy">{stat.value}</p>
              <p className="mt-1 text-[11px] font-medium text-slate-500">{stat.label}</p>
              {stat.delta && <p className="text-[10px] font-semibold text-emerald-500">{stat.delta}</p>}
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-xs font-semibold text-slate-500">{dashboard.recentScreensTitle}</p>
            <ul className="mt-2 space-y-1.5">
              {dashboard.recentScreens.map((screen) => (
                <li
                  key={screen.name}
                  className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-xs"
                >
                  <span className="truncate text-slate-600">{screen.name}</span>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                    {screen.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-hidden rounded-xl">
            <p className="px-1 pb-1.5 text-xs font-semibold text-slate-500">{dashboard.nowPlayingTitle}</p>
            {/* TODO: replace with real asset */}
            <div className="relative flex h-24 flex-col justify-end rounded-lg bg-gradient-to-br from-brand-navy via-slate-800 to-amber-500 p-3">
              <p className="text-sm font-extrabold uppercase leading-tight text-white">
                {dashboard.nowPlayingHeadline}
              </p>
              <p className="text-[10px] font-semibold uppercase text-amber-200">
                {dashboard.nowPlayingSubheadline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({ content }: HeroSectionProps) {
  const openTalkToUs = useTalkToUsStore((s) => s.openWithTopic);

  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-6 lg:grid-cols-2 lg:items-start lg:pb-28">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue text-white">
              <Monitor className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold text-brand-navy">{content.badge}</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-2 text-2xl font-bold text-brand-blue">{content.subtitle}</p>
          <p className="mt-4 max-w-xl text-lg text-slate-600">{content.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => openTalkToUs("digital-signage")}
              className="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
            >
              {content.ctaPrimary}
            </button>
            <a
              href="#what-you-can-do"
              className="inline-flex items-center gap-2 rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-50"
            >
              <Play className="h-4 w-4" />
              {content.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="min-w-0 lg:self-center">
          <DashboardMockup dashboard={content.dashboard} />
        </div>
      </div>
    </section>
  );
}

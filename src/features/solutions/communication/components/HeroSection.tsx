"use client";

// === Hero Section: badge "SOLUTION" + หัวข้อ + หัวข้อรองสี accent 2 บรรทัด
// + คำอธิบาย + ปุ่ม CTA หลัก/รอง ฝั่งซ้าย, mockup dashboard "Mission Control"
// (sidebar, stat การ์ด 4 อัน, ข้อความล่าสุด, donut กระจายช่องทาง) ฝั่งขวา ===

// TODO: replace the mock dashboard content with a real product screenshot
// once design assets are available.

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Home,
  Inbox,
  Megaphone,
  Play,
  Settings,
  Share2,
  Target,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { HeroContent } from "../types";

type HeroSectionProps = {
  content: HeroContent;
};

const SLICE_COLORS = ["#2f5fe0", "#0d9488", "#f59e0b", "#06C755", "#9333ea"];

function ChannelDonut({ slices }: { slices: HeroContent["dashboard"]["channelDistribution"] }) {
  const stops = slices.reduce<{ text: string[]; cumulative: number }>(
    (acc, slice, index) => {
      const start = acc.cumulative;
      const end = start + slice.percent;
      return {
        text: [...acc.text, `${SLICE_COLORS[index % SLICE_COLORS.length]} ${start}% ${end}%`],
        cumulative: end,
      };
    },
    { text: [], cumulative: 0 },
  ).text;

  return (
    <span
      className="block h-16 w-16 shrink-0 rounded-full"
      style={{ background: `conic-gradient(${stops.join(", ")})` }}
      role="img"
      aria-label="Channel distribution chart"
    />
  );
}

function DashboardMockup({ dashboard }: { dashboard: HeroContent["dashboard"] }) {
  const navIcons: LucideIcon[] = [
    Home,
    Inbox,
    Megaphone,
    Share2,
    CheckCircle2,
    CalendarDays,
    Target,
    BarChart3,
    Settings,
  ];

  const stats = [
    dashboard.stats.messagesSent,
    dashboard.stats.deliveryRate,
    dashboard.stats.engagementRate,
    dashboard.stats.activeChannels,
  ];

  return (
    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="hidden w-36 shrink-0 flex-col gap-1 border-r border-slate-100 bg-brand-navy p-3 sm:flex">
        <div className="mb-2 flex items-center gap-1.5 px-2 text-xs font-bold text-white">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-brand-blue text-[9px]">T1</span>
          {dashboard.productLabel}
        </div>
        {dashboard.nav.map((label, index) => {
          const Icon = navIcons[index % navIcons.length];
          return (
            <span
              key={label}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium ${
                index === 0 ? "bg-white/10 text-white" : "text-slate-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{label}</span>
            </span>
          );
        })}
      </div>

      <div className="min-w-0 flex-1 p-5">
        <p className="text-sm font-bold text-brand-navy">{dashboard.panelTitle}</p>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
            <p className="text-xs font-semibold text-slate-500">{dashboard.recentMessagesTitle}</p>
            <ul className="mt-2 space-y-1.5">
              {dashboard.recentMessages.map((message) => (
                <li key={message.title} className="rounded-lg bg-slate-50 px-2.5 py-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-medium text-slate-700">{message.title}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        message.status.toLowerCase().includes("sched") ||
                        message.status.includes("กำหนด")
                          ? "bg-amber-100 text-amber-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {message.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{message.meta}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-xs font-semibold text-slate-500">{dashboard.channelDistributionTitle}</p>
            <div className="mt-2 flex items-center gap-3">
              <ChannelDonut slices={dashboard.channelDistribution} />
              <ul className="min-w-0 flex-1 space-y-1">
                {dashboard.channelDistribution.map((slice, index) => (
                  <li key={slice.label} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: SLICE_COLORS[index % SLICE_COLORS.length] }}
                    />
                    <span className="truncate">{slice.label}</span>
                    <span className="ml-auto shrink-0 font-medium text-slate-600">{slice.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <a
          href="#"
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
        >
          {dashboard.viewFullReport}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-6 lg:grid-cols-2 lg:items-center lg:pb-28">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-blue text-white">
              <Megaphone className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold text-brand-navy">{content.badge}</span>
          </div>

          <h1 className="mt-4 text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-2 whitespace-pre-line text-2xl font-bold leading-snug text-brand-blue">{content.subtitle}</p>
          <p className="mt-4 max-w-xl whitespace-pre-line text-lg text-slate-600">{content.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
            >
              {content.ctaPrimary}
            </Link>
            <a
              href="#what-you-can-do"
              className="inline-flex items-center gap-2 rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-50"
            >
              <Play className="h-4 w-4" />
              {content.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="min-w-0">
          <DashboardMockup dashboard={content.dashboard} />
        </div>
      </div>
    </section>
  );
}

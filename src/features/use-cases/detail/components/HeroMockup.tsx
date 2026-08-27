"use client";

// === Hero product mockup: a layered composition for the use case detail
// hero. A browser-style dashboard panel (dark icon rail + announcement
// detail with labelled publish channels and a 4-stat grid) sits behind an
// overlapping phone mockup showing the same announcement in the mobile app,
// with a floating LINE push-notification card to the upper right. Content
// is supplied by the caller so it stays slug-agnostic. InContextSection
// keeps using the simpler ProductMockup — this one is hero-only. ===

import {
  BarChart3,
  Bell,
  Clock,
  LayoutGrid,
  Megaphone,
  MessageCircle,
  Send,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import { ICONS } from "../../iconRegistry";
import type { MockupContent } from "../types";

type HeroMockupProps = {
  content: MockupContent;
};

const RAIL_ICONS = [LayoutGrid, Megaphone, Users, Send, Bell, BarChart3, Settings];

export function HeroMockup({ content }: HeroMockupProps) {
  const { lineNotification } = content;

  return (
    <div className="relative mx-auto w-full max-w-md pb-6 sm:max-w-lg sm:pr-8 lg:mx-0 lg:max-w-none lg:pr-6">
      {/* Dashboard panel — kept clear of the phone / LINE overlays on the
          right by a right margin on sm+, so its content is never covered. */}
      <div className="relative z-10 flex overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg sm:mr-20 lg:mr-32">
        <div className="hidden w-12 shrink-0 flex-col items-center gap-4 bg-brand-navy py-4 sm:flex">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-blue text-white">
            <Megaphone className="h-4 w-4" />
          </span>
          <div className="flex flex-col items-center gap-4">
            {RAIL_ICONS.map((Icon, index) => (
              <Icon
                key={index}
                className={`h-4 w-4 ${index === 0 ? "text-white" : "text-white/30"}`}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                <Megaphone className="h-4 w-4" />
              </span>
              <p className="truncate text-sm font-bold text-brand-navy">{content.panelTitle}</p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              {content.statusLabel}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <UserRound className="h-3 w-3" />
              {content.author}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {content.timestamp}
            </span>
          </div>

          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600">
            {content.bodyPreview}
          </p>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            {content.channelsLabel}
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {content.channels.map((channel) => {
              const Icon = ICONS[channel.icon] ?? Megaphone;
              return (
                <div
                  key={channel.icon}
                  className="flex flex-col items-center gap-1 rounded-lg bg-slate-50 px-1 py-2 text-center"
                >
                  <Icon className="h-4 w-4 text-brand-blue" />
                  <span className="w-full truncate text-[9px] font-medium text-slate-500">
                    {channel.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {content.stats.map((stat, index) => (
              <div key={index} className="rounded-xl bg-slate-50 p-2.5">
                <p className="text-base font-bold text-brand-navy">{stat.value}</p>
                <p className="mt-0.5 text-[10px] font-medium text-slate-500">{stat.label}</p>
                {stat.percent && (
                  <p className="text-[10px] font-semibold text-emerald-500">{stat.percent}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phone mockup — overlaps the dashboard's lower-right corner */}
      <div className="absolute -bottom-4 right-4 z-20 hidden w-40 rounded-[1.9rem] border-[6px] border-brand-navy bg-brand-navy shadow-xl sm:block sm:-right-4 lg:-right-6 lg:w-44">
        <div className="rounded-[1.4rem] bg-white p-3">
          <div className="mx-auto mb-2.5 h-1 w-8 rounded-full bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-navy text-[8px] font-bold text-white">
              T1
            </span>
            <p className="truncate text-[11px] font-bold text-brand-navy">{content.panelTitle}</p>
          </div>
          <span className="mt-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
            {content.statusLabel}
          </span>
          <div className="mt-2.5 space-y-1.5">
            <span className="block h-1.5 w-full rounded-full bg-slate-100" />
            <span className="block h-1.5 w-11/12 rounded-full bg-slate-100" />
            <span className="block h-1.5 w-3/4 rounded-full bg-slate-100" />
          </div>
          <div className="mt-3 flex gap-1.5">
            {content.channels.map((channel) => {
              const Icon = ICONS[channel.icon] ?? Megaphone;
              return (
                <span
                  key={channel.icon}
                  className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-50 text-slate-400"
                >
                  <Icon className="h-3 w-3" />
                </span>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            {content.stats.slice(0, 2).map((stat, index) => (
              <div key={index} className="rounded-lg bg-slate-50 p-2">
                <p className="text-xs font-bold text-brand-navy">{stat.value}</p>
                <p className="text-[9px] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating LINE notification card */}
      <div className="absolute -top-4 right-0 z-30 w-44 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:-right-4 sm:w-48 lg:-right-8 lg:w-52">
        <div className="flex items-center gap-1.5 bg-[#06C755] px-3 py-2 text-white">
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs font-bold tracking-wide">LINE</span>
        </div>
        <div className="p-3">
          <p className="text-xs font-bold text-brand-navy">{lineNotification.appName}</p>
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-600">
            {lineNotification.title}
          </p>
          <p className="mt-1 text-[10px] text-slate-400">{lineNotification.timestamp}</p>
          <p className="mt-2 rounded-lg bg-slate-100 px-2.5 py-1.5 text-center text-[11px] font-semibold text-brand-navy">
            {lineNotification.cta}
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

// === Hero Section: badge "SOLUTION" + หัวข้อ + หัวข้อรองสี accent น้ำเงิน
// + คำอธิบาย + ปุ่ม CTA หลัก/รอง ฝั่งซ้าย, mockup dashboard "ThunderOne Asset Workspace"
// (topbar ทักทาย + ช่องค้นหา, sidebar 7 เมนู, การ์ด "ความพร้อมในการทำงาน" + donut 92%,
//  การ์ด "ต้องการทำอะไร?" 4 ปุ่มลัด, การ์ด "ประกาศและข่าวสาร") ฝั่งขวา ===

// TODO: replace the mock dashboard content with a real product screenshot
// once design assets are available.

import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  Bell,
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  CalendarDays,
  CircleHelp,
  ClipboardList,
  FileText,
  Headset,
  Home,
  KeyRound,
  Laptop,
  MessagesSquare,
  PackageCheck,
  Play,
  Search,
  Settings,
  TriangleAlert,
} from "lucide-react";
import { useTalkToUsStore } from "@/store/talkToUsStore";
import type { HeroContent } from "../types";

type HeroSectionProps = {
  content: HeroContent;
  onOpenDemo: () => void;
};

type Dashboard = HeroContent["dashboard"];

function ReadinessDonut({ percent, centerLabel }: { percent: number; centerLabel: string }) {
  return (
    <span
      className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(#4ade80 0%, #16a34a ${percent}%, #e2e8f0 ${percent}% 100%)`,
      }}
      role="img"
      aria-label={`${percent}% ${centerLabel}`}
    >
      <span className="flex h-[74%] w-[74%] flex-col items-center justify-center rounded-full bg-white text-center">
        <span className="text-xl font-bold leading-none text-brand-navy">{percent}%</span>
        <span className="mt-0.5 text-[9px] font-medium text-slate-400">{centerLabel}</span>
      </span>
    </span>
  );
}

function DashboardMockup({ dashboard }: { dashboard: Dashboard }) {
  const navIcons: LucideIcon[] = [
    Home,
    Boxes,
    ClipboardList,
    PackageCheck,
    TriangleAlert,
    BookOpen,
    Settings,
  ];

  const readinessIcons: LucideIcon[] = [Laptop, AppWindow, KeyRound, Building2];

  const quickActionStyles: { Icon: LucideIcon; className: string }[] = [
    { Icon: Briefcase, className: "bg-blue-50 text-brand-blue" },
    { Icon: TriangleAlert, className: "bg-amber-50 text-amber-500" },
    { Icon: MessagesSquare, className: "bg-teal-50 text-teal-600" },
    { Icon: PackageCheck, className: "bg-indigo-50 text-indigo-500" },
  ];

  const announcementIcons: LucideIcon[] = [CalendarDays, FileText];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-blue text-[9px] font-bold text-white">
            T1
          </span>
          <span className="hidden leading-none sm:block">
            <span className="block text-[11px] font-bold text-brand-navy">{dashboard.productLabel}</span>
            <span className="block text-[8px] font-medium tracking-wider text-slate-400">
              {dashboard.productSubLabel}
            </span>
          </span>
        </div>

        <div className="hidden min-w-0 flex-1 pr-2 md:block">
          <p className="line-clamp-2 text-xs font-bold leading-tight text-brand-navy">
            {dashboard.greeting} <span aria-hidden="true">👋</span> {dashboard.userName}
          </p>
          <p className="truncate text-[10px] text-slate-400">{dashboard.greetingSubtitle}</p>
        </div>

        <div className="ml-auto hidden shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 md:flex xl:hidden">
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="max-w-64 truncate text-[10px] text-slate-400">{dashboard.searchPlaceholder}</span>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5 md:ml-3">
          <Search className="hidden h-4 w-4 text-slate-400 xl:block" />
          <span className="relative">
            <Bell className="h-4 w-4 text-slate-400" />
            <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[7px] font-bold text-white">
              2
            </span>
          </span>
          <CircleHelp className="h-4 w-4 text-slate-400" />
          <span className="flex items-center gap-1.5">
            <span className="h-6 w-6 rounded-full bg-linear-to-br from-blue-200 to-blue-400" />
            <span className="hidden leading-none sm:block">
              <span className="block text-[10px] font-semibold text-brand-navy">{dashboard.userName}</span>
              <span className="block text-[8px] text-slate-400">{dashboard.userRole}</span>
            </span>
          </span>
        </div>
      </div>

      <div className="flex">
        <div className="hidden w-36 shrink-0 flex-col gap-0.5 border-r border-slate-100 p-3 sm:flex">
          {dashboard.nav.map((label, index) => {
            const Icon = navIcons[index % navIcons.length];
            return (
              <span
                key={label}
                className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[11px] font-medium ${
                  index === 0 ? "bg-blue-50 text-brand-blue" : "text-slate-500"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </span>
            );
          })}
        </div>

        
        <div className="min-w-0 flex-1 space-y-3 bg-slate-50/60 p-4">
          <div className="md:hidden">
            <p className="text-xs font-bold text-brand-navy">
              {dashboard.greeting} <span aria-hidden="true">👋</span> {dashboard.userName}
            </p>
            <p className="text-[10px] text-slate-400">{dashboard.greetingSubtitle}</p>
          </div>

          <div className="">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-slate-100 bg-white p-4 max-w-[300px]">
              <p className="text-xs font-bold text-brand-navy">{dashboard.readinessTitle}</p>
              <div className="mt-3 flex items-center gap-4">
                <ReadinessDonut
                  percent={dashboard.readinessPercent}
                  centerLabel={dashboard.readinessCenterLabel}
                />
                <ul className="min-w-0 flex-1 space-y-2">
                  {dashboard.readinessItems.map((item, index) => {
                    const Icon = readinessIcons[index % readinessIcons.length];
                    return (
                      <li key={item.label} className="flex items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[11px] font-medium leading-tight text-slate-700">
                            {item.label}
                          </span>
                          <span className="block text-[9px] leading-tight text-slate-400">
                            {item.ready}/{item.total} {item.statusLabel}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-600">
                          {item.statusLabel}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <a
                href="#"
                className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-blue hover:underline"
              >
                {dashboard.viewAllReadiness}
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>

          <div className="min-w-0 flex-1 space-y-3">
          <div className="rounded-xl border border-slate-100 bg-white p-4">
              <p className="text-xs font-bold text-brand-navy">{dashboard.quickActionsTitle}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {dashboard.quickActions.map((action, index) => {
                  const { Icon, className } = quickActionStyles[index % quickActionStyles.length];
                  return (
                    <div key={action.title} className="rounded-lg border border-slate-100 p-2">
                      <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${className}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <p className="mt-1.5 text-[10px] font-semibold leading-tight text-slate-700">
                        {action.title}
                      </p>
                      <p className="mt-0.5 text-[8px] leading-tight text-slate-400">
                        {action.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-brand-navy">{dashboard.announcementsTitle}</p>
                <a
                  href="#"
                  className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-brand-blue hover:underline"
                >
                  {dashboard.viewAllAnnouncements}
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
              <ul className="mt-2 space-y-2">
                {dashboard.announcements.map((announcement, index) => {
                  const Icon = announcementIcons[index % announcementIcons.length];
                  return (
                    <li key={announcement.title} className="flex items-start gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-brand-blue">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[11px] font-medium text-slate-700">
                          {announcement.title}
                        </span>
                        <span className="block text-[9px] text-slate-400">{announcement.meta}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
              
            </div>
          </div>
          </div>




          <div className="flex items-center justify-center gap-1.5 pt-1">
            {["a", "b", "c", "d", "e", "f"].map((dot, index) => (
              <span
                key={dot}
                className={`h-1.5 rounded-full ${
                  index === 0 ? "w-4 bg-brand-blue" : "w-1.5 bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({ content, onOpenDemo }: HeroSectionProps) {
  const openTalkToUs = useTalkToUsStore((s) => s.openWithTopic);

  return (
    <section className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 pt-6 xl:grid-cols-[1fr_1.5fr] xl:items-start">
        <div className="w-fit">
          <div className="flex gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue text-white">
              <Headset className="h-5 w-5" />
            </span>
            <span className="text-sm font-bold text-brand-navy">{content.badge}</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-brand-navy sm:text-4xl">
            {content.title}
          </h1>
          <p className="mt-2 whitespace-pre-line text-2xl font-bold leading-snug text-brand-blue">{content.subtitle}</p>
          <p className="mt-4 max-w-xl whitespace-pre-line text-lg text-slate-600">{content.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => openTalkToUs("thunder-care")}
              className="rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-blue"
            >
              {content.ctaPrimary}
            </button>
            <button
              type="button"
              onClick={onOpenDemo}
              className="inline-flex items-center gap-2 rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-50"
            >
              <Play className="h-4 w-4" />
              {content.ctaSecondary}
            </button>
          </div>
        </div>

        <div className="min-w-0 xl:self-center">
          <DashboardMockup dashboard={content.dashboard} />
        </div>
      </div>
    </section>
  );
}

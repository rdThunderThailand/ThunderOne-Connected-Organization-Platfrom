// === Step 2 — "Self-Onboard" (new-employee view). May's onboarding
// checklist: overall progress ring + tabbed task list with per-task status.
// Static mock; the tabs are shown but not wired. ===

import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Home,
  IdCard,
  Info,
  Laptop,
  LifeBuoy,
  ListChecks,
  Loader2,
  MessageSquare,
  Rocket,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { DemoAppShell } from "../DemoAppShell";
import { DemoDonut } from "../DemoDonut";
import type { DemoStep2Content, DemoStep2Task } from "../../types";

const NAV_ICONS: LucideIcon[] = [Home, Rocket, ListChecks, Boxes, FileText, LifeBuoy];

const TASK_ICONS: LucideIcon[] = [UserRound, ClipboardCheck, ShieldCheck, Laptop, IdCard, Users];

const STATUS_CHIP: Record<DemoStep2Task["status"], string> = {
  done: "bg-emerald-50 text-emerald-500",
  doing: "bg-blue-50 text-brand-blue",
  todo: "bg-slate-100 text-slate-400",
};

const STATUS_BADGE: Record<DemoStep2Task["status"], string> = {
  done: "bg-emerald-100 text-emerald-600",
  doing: "bg-blue-100 text-brand-blue",
  todo: "bg-slate-100 text-slate-500",
};

type Step2SelfOnboardProps = {
  content: DemoStep2Content;
};

export function Step2SelfOnboard({ content }: Step2SelfOnboardProps) {
  return (
    <DemoAppShell content={content.appShell} navIcons={NAV_ICONS} theme="light">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-brand-navy">{content.pageTitle}</h3>
          <p className="text-xs text-slate-400">{content.pageKicker}</p>
          <p className="mt-3 text-sm font-bold text-brand-navy">{content.greeting}</p>
          <p className="mt-1 max-w-md text-xs text-slate-500">{content.greetingSub}</p>
        </div>

        <div className="w-full max-w-xs rounded-xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500">{content.progressTitle}</p>
          <div className="mt-2 flex items-center gap-3">
            <DemoDonut percent={content.progressPercent} size={72} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-slate-600">{content.progressDetail}</p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <span
                  className="block h-full rounded-full bg-emerald-500"
                  style={{ width: `${content.progressPercent}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-slate-400">{content.progressEta}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-4 border-b border-slate-100 text-xs font-semibold">
        {content.tabs.map((tab, index) => (
          <span
            key={tab}
            className={`pb-2 ${
              index === 0 ? "border-b-2 border-brand-blue text-brand-blue" : "text-slate-400"
            }`}
          >
            {tab}
          </span>
        ))}
      </div>

      <ul className="mt-3 space-y-2">
        {content.tasks.map((task, index) => {
          const Icon = TASK_ICONS[index % TASK_ICONS.length];
          return (
            <li
              key={task.title}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${STATUS_CHIP[task.status]}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-brand-navy">{task.title}</p>
                <p className="truncate text-[10px] text-slate-400">{task.description}</p>
              </div>
              <div className="hidden shrink-0 flex-col items-end sm:flex">
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${STATUS_BADGE[task.status]}`}
                >
                  {task.statusLabel}
                </span>
                <span className="mt-1 text-[9px] text-slate-400">{task.meta}</span>
              </div>
              <span className="shrink-0">
                {task.status === "done" ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : task.status === "doing" ? (
                  <Loader2 className="h-5 w-5 animate-spin text-brand-blue" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-blue-50/70 px-4 py-3">
        <p className="flex items-center gap-2 text-[11px] text-slate-600">
          <Info className="h-4 w-4 shrink-0 text-brand-blue" />
          {content.helpNote}
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-brand-blue"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          {content.helpButton}
        </button>
      </div>
    </DemoAppShell>
  );
}

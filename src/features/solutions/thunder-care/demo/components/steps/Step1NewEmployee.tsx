// === Step 1 — "New employee" (Admin HR view). The People > New employees
// screen: summary stat cards + a table of employees about to start with a
// readiness percentage each. Static mock; no interactivity. ===

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  Home,
  LayoutGrid,
  ListChecks,
  MoreVertical,
  Package,
  Plus,
  Search,
  Settings,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { DemoAppShell } from "../DemoAppShell";
import { DemoDonut } from "../DemoDonut";
import type { DemoStep1Content } from "../../types";

const NAV_ICONS: LucideIcon[] = [Home, Users, Package, ListChecks, Sparkles, LayoutGrid, Settings];

const STAT_STYLES: { Icon: LucideIcon; className: string }[] = [
  { Icon: UserPlus, className: "bg-blue-50 text-brand-blue" },
  { Icon: CheckCircle2, className: "bg-emerald-50 text-emerald-500" },
  { Icon: Clock, className: "bg-amber-50 text-amber-500" },
  { Icon: CalendarDays, className: "bg-violet-50 text-violet-500" },
];

type Step1NewEmployeeProps = {
  content: DemoStep1Content;
};

export function Step1NewEmployee({ content }: Step1NewEmployeeProps) {
  return (
    <DemoAppShell content={content.appShell} navIcons={NAV_ICONS} theme="light">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-[11px] text-slate-400">{content.breadcrumb}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
          >
            <Download className="h-3.5 w-3.5" />
            {content.exportButton}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-semibold text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            {content.addButton}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-blue">
          <UserPlus className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-brand-navy">{content.pageTitle}</h3>
          <p className="text-xs text-slate-500">{content.pageSubtitle}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {content.stats.map((stat, index) => {
          const { Icon, className } = STAT_STYLES[index % STAT_STYLES.length];
          return (
            <div key={stat.label} className="rounded-xl border border-slate-100 bg-white p-3">
              <div className="flex items-center gap-2">
                <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${className}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-[11px] font-medium text-slate-500">{stat.label}</span>
              </div>
              <p className="mt-2 text-xl font-bold text-brand-navy">
                {stat.value}
                <span className="ml-1 text-xs font-medium text-slate-400">{stat.unit}</span>
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">{stat.caption}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold text-brand-navy">{content.tableTitle}</p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] text-slate-400">
              <Search className="h-3.5 w-3.5" />
              {content.searchPlaceholder}
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[10px] font-medium text-slate-500">
              <ListChecks className="h-3.5 w-3.5" />
              {content.filterButton}
            </span>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-160 text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400">
                {content.columns.map((column) => (
                  <th key={column} className="px-2 py-2">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.rows.map((row) => (
                <tr key={row.name} className="border-b border-slate-50 align-middle">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-8 w-8 shrink-0 rounded-full bg-linear-to-br from-blue-200 to-blue-400" />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-brand-navy">
                          {row.name}
                        </span>
                        <span className="mt-0.5 inline-block rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-brand-blue">
                          {row.badge}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-xs text-slate-600">{row.role}</td>
                  <td className="px-2 py-3 text-xs text-slate-600">{row.dept}</td>
                  <td className="px-2 py-3 text-xs text-slate-600">{row.startDate}</td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">
                      <DemoDonut percent={row.readinessPercent} size={40} color="#2f5fe0" />
                      <span className="min-w-0 leading-tight">
                        <span className="block text-[11px] font-medium text-slate-600">
                          {row.readinessLabel}
                        </span>
                        <span className="block text-[10px] text-slate-400">{row.readinessDetail}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600">
                        {row.actionButton}
                      </span>
                      <MoreVertical className="h-4 w-4 text-slate-300" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-center text-[11px] font-semibold text-brand-blue">
          {content.viewAll} <span aria-hidden="true">&rarr;</span>
        </p>
      </div>
    </DemoAppShell>
  );
}

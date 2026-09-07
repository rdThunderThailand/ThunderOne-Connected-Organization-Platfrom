// === DemoAppShell: the simulated ThunderOne app chrome each demo step
// renders its screen inside — left nav rail (logo + menu + persona card) and
// a scrollable main area. `theme` switches the whole shell light/dark so the
// executive step (06) reads as a different surface from the employee steps. ===

import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import type { DemoAppShellContent } from "../types";

type DemoAppShellProps = {
  content: DemoAppShellContent;
  navIcons: LucideIcon[];
  theme?: "light" | "dark";
  children: React.ReactNode;
};

export function DemoAppShell({ content, navIcons, theme = "light", children }: DemoAppShellProps) {
  const dark = theme === "dark";

  return (
    <div
      className={`flex h-full min-h-0 overflow-hidden rounded-2xl border ${
        dark ? "border-white/10 bg-brand-navy" : "border-slate-200 bg-white"
      }`}
    >
      {/* Left nav rail */}
      <div
        className={`hidden w-52 shrink-0 flex-col border-r p-3 lg:flex ${
          dark ? "border-white/10" : "border-slate-100"
        }`}
      >
        <div className="mb-4 flex items-center gap-2 px-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-blue text-[10px] font-bold text-white">
            T1
          </span>
          <span className="leading-none">
            <span className={`block text-sm font-bold ${dark ? "text-white" : "text-brand-navy"}`}>
              ThunderOne
            </span>
            {content.productSub && (
              <span
                className={`block text-[8px] font-semibold tracking-widest ${
                  dark ? "text-slate-400" : "text-slate-400"
                }`}
              >
                {content.productSub}
              </span>
            )}
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
          {content.nav.map((label, index) => {
            const Icon = navIcons[index % navIcons.length];
            const active = index === content.activeNavIndex;
            return (
              <span
                key={label}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium ${
                  active
                    ? dark
                      ? "bg-white/10 text-white"
                      : "bg-blue-50 text-brand-blue"
                    : dark
                      ? "text-slate-400"
                      : "text-slate-500"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </span>
            );
          })}
        </nav>

        <div className={`mt-3 rounded-xl border p-2.5 ${dark ? "border-white/10" : "border-slate-100"}`}>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 shrink-0 rounded-full bg-linear-to-br from-blue-200 to-blue-400" />
            <span className="min-w-0 leading-tight">
              <span className={`block truncate text-[11px] font-semibold ${dark ? "text-white" : "text-brand-navy"}`}>
                {content.user.name}
              </span>
              <span className="block truncate text-[9px] text-slate-400">{content.user.role}</span>
              {content.user.sub && (
                <span className="block truncate text-[9px] text-slate-400">{content.user.sub}</span>
              )}
            </span>
          </div>
          <div className={`mt-2 border-t pt-2 ${dark ? "border-white/10" : "border-slate-100"}`}>
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
              <LogOut className="h-3 w-3" />
              {content.bottomAction}
            </span>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className={`min-h-0 min-w-0 flex-1 overflow-y-auto p-5 ${dark ? "bg-brand-navy" : "bg-slate-50/40"}`}>
        {children}
      </div>
    </div>
  );
}

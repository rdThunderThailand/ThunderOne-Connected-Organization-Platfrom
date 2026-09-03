// === SkeletonStep: shared body for demo steps 3–6, which still have the
// correct persona shell (nav + user card) and page heading but a placeholder
// where the screen mockup will go. Each step file passes its own nav icons
// and theme; flesh out one at a time by replacing its wrapper. ===

import type { LucideIcon } from "lucide-react";
import { Hammer } from "lucide-react";
import { DemoAppShell } from "../DemoAppShell";
import type { DemoSkeletonStepContent } from "../../types";

type SkeletonStepProps = {
  content: DemoSkeletonStepContent;
  navIcons: LucideIcon[];
  note: string;
  theme?: "light" | "dark";
};

export function SkeletonStep({ content, navIcons, note, theme = "light" }: SkeletonStepProps) {
  const dark = theme === "dark";

  return (
    <DemoAppShell content={content.appShell} navIcons={navIcons} theme={theme}>
      <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-brand-navy"}`}>
        {content.pageTitle}
      </h3>
      <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{content.pageSubtitle}</p>

      <div
        className={`mt-6 flex min-h-60 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-8 text-center ${
          dark ? "border-white/15 text-slate-400" : "border-slate-200 text-slate-400"
        }`}
      >
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            dark ? "bg-white/5 text-slate-300" : "bg-slate-100 text-slate-400"
          }`}
        >
          <Hammer className="h-6 w-6" />
        </span>
        <p className="max-w-xs text-xs">{note}</p>
      </div>
    </DemoAppShell>
  );
}

// === DemoTopBar: the dark strip across the very top of the demo overlay —
// ThunderOne logo, demo title + "Golden Story Demo" badge, estimated time,
// and the "Exit demo ✕" button that closes the overlay. ===

import { Clock, X } from "lucide-react";
import type { DemoTopBarContent } from "../types";

type DemoTopBarProps = {
  content: DemoTopBarContent;
  onClose: () => void;
};

export function DemoTopBar({ content, onClose }: DemoTopBarProps) {
  return (
    <div className="flex h-14 shrink-0 items-center gap-3 border-b border-white/10 bg-brand-navy px-4 sm:px-6">
      <div className="flex shrink-0 items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-blue text-[9px] font-bold text-white">
          T1
        </span>
        <span className="hidden text-sm font-bold text-white sm:block">{content.productName}</span>
      </div>

      <div className="hidden min-w-0 items-center gap-2 border-l border-white/15 pl-3 md:flex">
        <span className="truncate text-sm font-semibold text-white">{content.title}</span>
        <span className="shrink-0 rounded-full bg-brand-blue px-2.5 py-0.5 text-[10px] font-bold text-white">
          {content.badge}
        </span>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <span className="hidden items-center gap-1.5 text-xs text-slate-300 sm:flex">
          <Clock className="h-3.5 w-3.5" />
          {content.estimatedTime}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/20"
        >
          {content.exit}
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

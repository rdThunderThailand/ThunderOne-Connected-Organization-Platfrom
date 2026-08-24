// === Tour Top Bar: the overlay's own slim strip sitting below the site's
// existing (unmodified) sticky Navbar, holding the "End tour ✕" button. ===

import { X } from "lucide-react";

type TourTopBarProps = {
  endTourLabel: string;
  onClose: () => void;
};

export function TourTopBar({ endTourLabel, onClose }: TourTopBarProps) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-end border-b border-slate-800 bg-brand-navy px-6">
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-white hover:bg-white/20"
      >
        {endTourLabel}
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

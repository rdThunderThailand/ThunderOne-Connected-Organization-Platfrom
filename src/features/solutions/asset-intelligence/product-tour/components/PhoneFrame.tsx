// === Shared phone mockup shell reused by every tour step's left-hand
// "device screen" — keeps the frame/bottom-nav chrome in one place so each
// Step*.tsx only supplies its own screen content. ===

import { Bell, Home, List, User } from "lucide-react";

type PhoneFrameProps = {
  children: React.ReactNode;
};

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="w-full max-w-xs shrink-0 rounded-[2rem] border-[6px] border-brand-navy bg-white p-3 shadow-xl">
      <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-slate-200" />

      <div className="min-h-[22rem]">{children}</div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
        <Home className="h-4 w-4 text-brand-blue" aria-hidden="true" />
        <List className="h-4 w-4 text-slate-300" aria-hidden="true" />
        <Bell className="h-4 w-4 text-slate-300" aria-hidden="true" />
        <User className="h-4 w-4 text-slate-300" aria-hidden="true" />
      </div>
    </div>
  );
}

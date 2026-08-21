"use client";

// PROTOTYPE — throwaway, not production
// Floating bottom-center switcher for cycling between home page redesign
// variants via ?variant=. Hidden in production builds.

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";

type PrototypeVariant = { key: string; name: string };

type PrototypeSwitcherProps = {
  current: string;
  variants: PrototypeVariant[];
};

export function PrototypeSwitcher({ current, variants }: PrototypeSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const currentIndex = Math.max(
    variants.findIndex((variant) => variant.key === current),
    0,
  );

  function goTo(index: number) {
    const wrapped = (index + variants.length) % variants.length;
    router.push(`${pathname}?variant=${variants[wrapped].key}`);
  }

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (event.key === "ArrowLeft") goTo(currentIndex - 1);
      if (event.key === "ArrowRight") goTo(currentIndex + 1);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  if (process.env.NODE_ENV === "production") return null;

  const active = variants[currentIndex];

  return (
    <div className="fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4">
      <div className="flex items-center gap-2 rounded-full bg-brand-navy px-3 py-2 text-white shadow-2xl ring-1 ring-white/10">
        <button
          type="button"
          onClick={() => goTo(currentIndex - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Previous variant"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="whitespace-nowrap px-2 text-xs font-semibold">
          {active.key} — {active.name}
        </span>
        <button
          type="button"
          onClick={() => goTo(currentIndex + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Next variant"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

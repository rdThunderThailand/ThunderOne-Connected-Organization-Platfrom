// === Mobile Tab Switcher: small-screen-only segmented control for flipping
// between the Sidebar (step list), Content (current step), and Summary
// panels — each panel takes the full screen one at a time on mobile so
// stepping through the tour never requires scrolling past the other two. ===

import type { MobilePanel, TourMobileTabsContent } from "../types";

type MobileTabSwitcherProps = {
  content: TourMobileTabsContent;
  activePanel: MobilePanel;
  onChange: (panel: MobilePanel) => void;
};

export function MobileTabSwitcher({ content, activePanel, onChange }: MobileTabSwitcherProps) {
  const tabs: { key: MobilePanel; label: string }[] = [
    { key: "steps", label: content.stepsTab },
    { key: "content", label: content.contentTab },
    { key: "summary", label: content.summaryTab },
  ];

  return (
    <div className="flex shrink-0 gap-1 border-b border-slate-100 bg-white px-3 py-2 lg:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          aria-current={activePanel === tab.key ? "true" : undefined}
          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            activePanel === tab.key ? "bg-brand-blue text-white" : "text-slate-500 hover:bg-slate-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

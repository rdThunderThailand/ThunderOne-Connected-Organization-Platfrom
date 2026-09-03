// === DemoMobileTabs: small-screen-only switch between the app screen and the
// Golden Story panel, since they can't sit side by side on a phone. ===

import type { DemoMobilePanel, DemoMobileTabsContent } from "../types";

type DemoMobileTabsProps = {
  content: DemoMobileTabsContent;
  activePanel: DemoMobilePanel;
  onChange: (panel: DemoMobilePanel) => void;
};

export function DemoMobileTabs({ content, activePanel, onChange }: DemoMobileTabsProps) {
  const tabs: { key: DemoMobilePanel; label: string }[] = [
    { key: "content", label: content.content },
    { key: "story", label: content.story },
  ];

  return (
    <div className="flex shrink-0 gap-1 border-b border-white/10 bg-brand-navy px-3 py-2 lg:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          aria-current={activePanel === tab.key ? "true" : undefined}
          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            activePanel === tab.key ? "bg-brand-blue text-white" : "text-slate-300 hover:bg-white/5"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// === DemoStorySidebar: right panel — "Golden Story" narrative for the
// current step: NN / 06, step title, illustration, description, and a
// "behind the scenes" callout listing what the system does automatically. ===

import { CheckCircle2 } from "lucide-react";
import { StoryIllustration } from "./StoryIllustration";
import { TOTAL_DEMO_STEPS, type DemoStoryContent } from "../types";

type DemoStorySidebarProps = {
  content: DemoStoryContent;
  currentStep: number;
};

export function DemoStorySidebar({ content, currentStep }: DemoStorySidebarProps) {
  const step = content.steps[currentStep - 1];
  if (!step) return null;

  return (
    <div className="flex h-full flex-col overflow-y-auto p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{content.title}</p>

      <p className="mt-4 text-2xl font-bold text-slate-300">
        <span className="text-brand-navy">{step.number}</span> / {String(TOTAL_DEMO_STEPS).padStart(2, "0")}
      </p>
      <h2 className="mt-1 text-xl font-bold text-brand-navy">{step.title}</h2>
      <span className="mt-2 block h-1 w-10 rounded-full bg-brand-blue" />

      <div className="mt-5">
        <StoryIllustration step={currentStep} />
      </div>

      <p className="mt-5 text-sm leading-relaxed text-slate-600">{step.description}</p>

      <div className="mt-5 rounded-xl bg-blue-50/70 p-4">
        <p className="text-sm font-bold text-brand-navy">{step.calloutTitle}</p>
        <ul className="mt-3 space-y-2">
          {step.calloutItems.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

"use client";

// === Persona Benefits Section: three value-prop cards — Free me / Help me /
// Connect us — each with an icon, label badge, title, and checklist ===

import type { LucideIcon } from "lucide-react";
import { Check, Clock, Sparkles, Users } from "lucide-react";
import type { PersonaContent, PersonaGroup } from "../types";

type PersonaBenefitsSectionProps = {
  content: PersonaContent;
};

const CARD_STYLES: {
  key: Exclude<keyof PersonaContent, "badge">;
  icon: LucideIcon;
  iconClassName: string;
  accentClassName: string;
}[] = [
  {
    key: "freeMe",
    icon: Clock,
    iconClassName: "bg-emerald-50 text-emerald-600",
    accentClassName: "text-emerald-600",
  },
  {
    key: "helpMe",
    icon: Sparkles,
    iconClassName: "bg-brand-blue/10 text-brand-blue",
    accentClassName: "text-brand-blue",
  },
  {
    key: "connectUs",
    icon: Users,
    iconClassName: "bg-purple-50 text-purple-600",
    accentClassName: "text-purple-600",
  },
];

function PersonaCard({
  group,
  icon: Icon,
  iconClassName,
  accentClassName,
}: {
  group: PersonaGroup;
  icon: LucideIcon;
  iconClassName: string;
  accentClassName: string;
}) {
  return (

    <div className="rounded-2xl p-6 text-center bg-amber-100">
      <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconClassName}`}>
        <Icon className="h-10 w-10 rounded-2xl" />
      </span>
      <p className={`mt-4 text-xs font-semibold uppercase tracking-wider ${accentClassName}`}>{group.label}</p>
      <h3 className="mt-1 text-xs font-semibold text-brand-navy">{group.title}</h3>
      <ul className="mt-4 space-y-2">
        {group.items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${accentClassName}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

  );
}

export function PersonaBenefitsSection({ content }: PersonaBenefitsSectionProps) {
  return (
    <section className="bg-slate-50 sm:px-6 lg:py-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-100 bg-white px-6 py-10 shadow-lg sm:px-10 sm:py-8">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{content.badge}</span>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {CARD_STYLES.map(({ key, icon, iconClassName, accentClassName }) => (
            <PersonaCard
              key={key}
              group={content[key]}
              icon={icon}
              iconClassName={iconClassName}
              accentClassName={accentClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

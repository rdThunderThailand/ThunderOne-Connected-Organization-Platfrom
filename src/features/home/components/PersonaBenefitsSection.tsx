"use client";

// === Persona Benefits Section: three value-prop cards — Free me / Help me /
// Connect us — each with an icon, label badge, title, and checklist ===

import type { LucideIcon } from "lucide-react";
import { Brain, Check, Clock, Sparkles, Users } from "lucide-react";
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
    icon: Brain,
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

    <div className=" flex gap-10 rounded-2xl p-5 text-center">

      <span className={`inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${iconClassName}`}>
        <Icon className="h-14 w-14 shrink-0 text-2xl" />
      </span>

      <div className="justify-between">
      <p className={`mt-4 text-xm font-semibold text-left uppercase tracking-wider ${accentClassName}`}>{group.label}</p>
      <h3 className="mt-1 text-xm font-semibold text-left text-brand-navy">{group.title}</h3>
      <ul className="mt-4 space-y-2">                             
        {group.items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${accentClassName}`} />
            <span>{item}</span>
          </li>
        ))}   
      </ul>    

      </div>

    </div>

  );
}

export function PersonaBenefitsSection({ content }: PersonaBenefitsSectionProps) {
  return (
    <section className="lg:py-1">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-100 bg-white py-5 shadow-lg sm:px-6 sm:py-8">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{content.badge}</span>
        <div className="flex sm:grid-cols-3 justify-around">
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

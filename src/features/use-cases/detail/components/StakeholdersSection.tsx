"use client";

// === Who's Involved: a card in the 3-column detail row. SectionHeader +
// a single row of flat cartoon person avatars (PersonAvatar) with role +
// short description. Avatar art is plain SVG — no external asset dependency.
// The stakeholder icon key in the data is no longer used for rendering
// here; the avatar is chosen by position. ===

import { SectionHeader } from "./SectionHeader";
import { PersonAvatar } from "./illustrations/PersonAvatar";
import type { StakeholdersContent } from "../types";

type StakeholdersSectionProps = {
  content: StakeholdersContent;
};

export function StakeholdersSection({ content }: StakeholdersSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <SectionHeader number={content.number} title={content.title} size="compact" />

      <div className="mt-8 grid grid-cols-2 gap-6">
        {content.items.map((item, index) => (
          <div key={item.role} className="flex flex-col items-center text-center">
            <PersonAvatar variant={index} className="h-20 w-20" />
            <p className="mt-2 text-xs font-bold leading-tight text-brand-navy">{item.role}</p>
            <p className="mt-1 text-[10px] leading-tight text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

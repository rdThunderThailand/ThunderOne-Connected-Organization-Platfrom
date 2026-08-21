"use client";

// === Role Perspective Section: eyebrow badge + three role cards (Executive /
// Manager / People), each with the question that role asks, the items that
// matter to them, and a photo panel with a decorative arrow badge ===

// Photos are free-license stock placeholders (Unsplash), not real ThunderOne
// staff — swap for real headshots once design assets are available.

import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import type { PerspectiveContent, PerspectiveRole } from "../types";

type RolePerspectiveSectionProps = {
  content: PerspectiveContent;
};

const ROLE_PHOTOS: {
  key: keyof Omit<PerspectiveContent, "title" | "tagline">;
  src: string;
}[] = [
  { key: "executive", src: "/images/perspective/executive.jpg" },
  { key: "manager", src: "/images/perspective/manager.jpg" },
  { key: "people", src: "/images/perspective/people.jpg" },
];

function RoleCard({ role, photoSrc }: { role: PerspectiveRole; photoSrc: string }) {
  return (
    <div className="relative flex overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex-1 p-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-blue">{role.role}</p>
        <p className="mt-1 text-base font-semibold text-brand-navy">{role.question}</p>
        <ul className="mt-4 space-y-2">
          {role.items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative w-28 shrink-0 sm:w-32">
        <Image src={photoSrc} alt="" fill className="object-cover" sizes="(min-width: 640px) 8rem, 7rem" />
      </div>
      <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white shadow-md">
        <ArrowRight className="h-4 w-4" />
      </span>
    </div>
  );
}

export function RolePerspectiveSection({ content }: RolePerspectiveSectionProps) {
  return (
    <section className="bg-slate-50 sm:px-4 lg:py-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-slate-100 bg-white px-4 py-10 shadow-lg sm:px-6 sm:py-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-blue">{content.title}</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {ROLE_PHOTOS.map(({ key, src }) => (
            <RoleCard key={key} role={content[key]} photoSrc={src} />
          ))}
        </div>
        <p className="mt-10 text-center text-lg font-bold text-brand-blue sm:text-xl">{content.tagline}</p>
      </div>
    </section>
  );
}

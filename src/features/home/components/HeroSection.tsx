"use client";

// === Hero Section: headline + description + primary/secondary CTA on the
// left, static 7-node diagram (People/Space/Asset/Device/Service/
// Communication/Work around the ThunderOne mark) on the right ===

import type { LucideIcon } from "lucide-react";
import { Box, Building2, ClipboardCheck, Headset, Megaphone, Package, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { HeroOrbitDiagram, type OrbitNode } from "@/components/diagrams/HeroOrbitDiagram";
import type { HeroContent } from "../types";

type HeroSectionProps = {
  content: HeroContent;
};

const NODE_ORDER: { key: keyof HeroContent["diagramNodes"]; icon: LucideIcon; badgeClassName: string }[] = [
  { key: "people", icon: Users, badgeClassName: "bg-sky-500" },
  { key: "space", icon: Building2, badgeClassName: "bg-orange-500" },
  { key: "asset", icon: Box, badgeClassName: "bg-blue-600" },
  { key: "device", icon: Package, badgeClassName: "bg-indigo-500" },
  { key: "service", icon: Headset, badgeClassName: "bg-violet-600" },
  { key: "communication", icon: Megaphone, badgeClassName: "bg-blue-500" },
  { key: "work", icon: ClipboardCheck, badgeClassName: "bg-emerald-500" },
];

export function HeroSection({ content }: HeroSectionProps) {
  const nodes: OrbitNode[] = NODE_ORDER.map(({ key, icon, badgeClassName }) => ({
    key,
    icon,
    badgeClassName,
    label: content.diagramNodes[key],
  }));

  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <p className="text-sm font-semibold text-slate-500">{content.trustedBy}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">
            <span className="block">{content.titleLine1}</span>
            <span className="block">{content.titleLine2}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">{content.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/platform"
              className="rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              {content.ctaPrimary}
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-50"
            >
              {content.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-3xl" />
          <HeroOrbitDiagram nodes={nodes} caption={content.diagramCaption} />
        </div>
      </div>
    </section>
  );
}

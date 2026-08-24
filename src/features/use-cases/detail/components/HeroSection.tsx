"use client";

// === Hero Section: eyebrow badge "USE CASE" + title + description +
// audience tag pills + 2 CTA buttons (left), ProductMockup with a floating
// LINE notification card (right). "See it in action" anchor-scrolls to the
// In Context section (no lightbox/video asset exists anywhere in this repo
// yet); "Talk to us" links to /contact, matching Navbar's existing CTA. ===

import { MessageCircle, Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ProductMockup } from "./ProductMockup";
import type { HeroContent } from "../types";

type HeroSectionProps = {
  content: HeroContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pb-24 lg:pt-12">
        <div>
          <span className="inline-flex items-center rounded-lg bg-brand-blue/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-blue">
            {content.eyebrow}
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">{content.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">{content.forLabel}</span>
            {content.audienceTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#in-context"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Play className="h-4 w-4" />
              {content.ctaPrimary}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-brand-navy px-6 py-3 text-sm font-semibold text-brand-navy hover:bg-slate-50"
            >
              <MessageCircle className="h-4 w-4" />
              {content.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="min-w-0 pb-8">
          <ProductMockup
            panelTitle={content.mockup.panelTitle}
            statusLabel={content.mockup.statusLabel}
            statusColor="green"
            author={content.mockup.author}
            timestamp={content.mockup.timestamp}
            bodyPreview={content.mockup.bodyPreview}
            channelIcons={content.mockup.channelIcons}
            stats={content.mockup.stats}
            lineNotification={content.mockup.lineNotification}
          />
        </div>
      </div>
    </section>
  );
}

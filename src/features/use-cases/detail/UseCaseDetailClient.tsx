"use client";

// === Generic use case detail page: composes every section in order from a
// single fully-resolved UseCaseDetailContent object. page.tsx looks up
// structural data + translations for the requested slug and builds that
// object — this component and everything under components/ stays slug-
// agnostic so future use cases only need new data + translations, no new
// component code. ===

import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HeroSection } from "./components/HeroSection";
import { KeyBenefitsStrip } from "./components/KeyBenefitsStrip";
import { SituationOutcomeSection } from "./components/SituationOutcomeSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { InContextSection } from "./components/InContextSection";
import { StakeholdersSection } from "./components/StakeholdersSection";
import { ConnectsDiagramSection } from "./components/ConnectsDiagramSection";
import { CapabilitiesUsedSection } from "./components/CapabilitiesUsedSection";
import { BeforeAfterSection } from "./components/BeforeAfterSection";
import { RelatedUseCasesSection } from "./components/RelatedUseCasesSection";
import { ReadyToStartCta } from "./components/ReadyToStartCta";
import type { UseCaseDetailContent } from "./types";

type UseCaseDetailClientProps = {
  content: UseCaseDetailContent;
};

export function UseCaseDetailClient({ content }: UseCaseDetailClientProps) {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb items={content.breadcrumb} />
      </div>
      <HeroSection content={content.hero} />
      <KeyBenefitsStrip content={content.benefits} />
      <SituationOutcomeSection content={content.situationOutcome} />
      <HowItWorksSection content={content.howItWorks} />

      {/* In Context / Who's Involved / Connects share one 3-column row,
          stretched to a common height (default grid align-items: stretch) */}
      <section className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <InContextSection content={content.inContext} />
          <StakeholdersSection content={content.stakeholders} />
          <ConnectsDiagramSection content={content.connects} />
        </div>
      </section>

      {/* Capabilities / Before-After / Related / CTA share one row of equal-
          height cards on desktop; they stack below lg. */}
      <section className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mx-auto grid max-w-7xl items-stretch gap-6 lg:grid-cols-4">
          <CapabilitiesUsedSection content={content.capabilities} />
          <BeforeAfterSection content={content.beforeAfter} />
          <RelatedUseCasesSection content={content.related} />
          <ReadyToStartCta content={content.readyToStart} />
        </div>
      </section>
    </div>
  );
}

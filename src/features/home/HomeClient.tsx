"use client";

// Copy in messages/{th,en}/home.json is a first-pass draft written from the
// design screenshots, not a transcription of final approved copy — sections
// below flag the spots most likely to need a copy-deck review.

import { HeroSection } from "./components/HeroSection";
import { ProblemStatementSection } from "./components/ProblemStatementSection";
import { PersonaBenefitsSection } from "./components/PersonaBenefitsSection";
import { RolePerspectiveSection } from "./components/RolePerspectiveSection";
import { SolutionsGridSection } from "./components/SolutionsGridSection";
import { ProductShowcaseSection } from "./components/ProductShowcaseSection";
import { IntegrationSection } from "./components/IntegrationSection";
import { CtaBannerSection } from "./components/CtaBannerSection";
import type {
  CtaContent,
  HeroContent,
  IntegrationContent,
  PersonaContent,
  PerspectiveContent,
  ProblemContent,
  ShowcaseContent,
  SolutionsContent,
} from "./types";

type HomeClientProps = {
  hero: HeroContent;
  problem: ProblemContent;
  persona: PersonaContent;
  perspective: PerspectiveContent;
  solutions: SolutionsContent;
  showcase: ShowcaseContent;
  integration: IntegrationContent;
  cta: CtaContent;
};

export function HomeClient({
  hero,
  problem,
  persona,
  perspective,
  solutions,
  showcase,
  integration,
  cta,
}: HomeClientProps) {
  return (
    <div>
      <HeroSection content={hero} />
      <ProblemStatementSection content={problem} />
      <PersonaBenefitsSection content={persona} />
      <RolePerspectiveSection content={perspective} />
      <SolutionsGridSection content={solutions} />
      <ProductShowcaseSection content={showcase} />
      <IntegrationSection content={integration} />
      <CtaBannerSection content={cta} />
    </div>
  );
}

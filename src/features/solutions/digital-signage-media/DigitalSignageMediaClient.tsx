"use client";

import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { HeroSection } from "./components/HeroSection";
import { ChallengeSection } from "./components/ChallengeSection";
import { WhatYouCanDoSection } from "./components/WhatYouCanDoSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { KeyCapabilitiesSection } from "./components/KeyCapabilitiesSection";
import { PerfectForSection } from "./components/PerfectForSection";
import { WorksSeamlesslySection } from "./components/WorksSeamlesslySection";
import { CtaBannerSection } from "./components/CtaBannerSection";
import type {
  ChallengeContent,
  CtaContent,
  HeroContent,
  HowItWorksContent,
  KeyCapabilitiesContent,
  PerfectForContent,
  WhatYouCanDoContent,
  WorksSeamlesslyContent,
} from "./types";

type DigitalSignageMediaClientProps = {
  breadcrumb: BreadcrumbItem[];
  hero: HeroContent;
  challenge: ChallengeContent;
  whatYouCanDo: WhatYouCanDoContent;
  howItWorks: HowItWorksContent;
  capabilities: KeyCapabilitiesContent;
  perfectFor: PerfectForContent;
  seamless: WorksSeamlesslyContent;
  cta: CtaContent;
};

export function DigitalSignageMediaClient({
  breadcrumb,
  hero,
  challenge,
  whatYouCanDo,
  howItWorks,
  capabilities,
  perfectFor,
  seamless,
  cta,
}: DigitalSignageMediaClientProps) {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <Breadcrumb items={breadcrumb} />
      </div>
      <HeroSection content={hero} />
      <ChallengeSection content={challenge} />
      <WhatYouCanDoSection content={whatYouCanDo} />
      <HowItWorksSection content={howItWorks} />
      <KeyCapabilitiesSection content={capabilities} />
      <PerfectForSection content={perfectFor} />
      <WorksSeamlesslySection content={seamless} />
      <CtaBannerSection content={cta} />
    </div>
  );
}

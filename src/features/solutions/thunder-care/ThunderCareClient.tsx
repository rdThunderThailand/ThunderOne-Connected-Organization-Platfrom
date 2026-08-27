"use client";

import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { HeroSection } from "./components/HeroSection";
import { ChallengeSection } from "./components/ChallengeSection";
import { WhatYouCanDoSection } from "./components/WhatYouCanDoSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { KeyCapabilitiesSection } from "./components/KeyCapabilitiesSection";
import { IdealForOrganizationSection } from "./components/IdealForOrganizationSection";
import { PlatformAndCtaSection } from "./components/PlatformAndCtaSection";
import { ToolsLogosSection } from "./components/ToolsLogosSection";
import type {
  ChallengeContent,
  HeroContent,
  HowItWorksContent,
  IdealForContent,
  KeyCapabilitiesContent,
  PlatformAndCtaContent,
  ToolsContent,
  WhatYouCanDoContent,
} from "./types";

type ThunderCareClientProps = {
  breadcrumb: BreadcrumbItem[];
  hero: HeroContent;
  challenge: ChallengeContent;
  whatYouCanDo: WhatYouCanDoContent;
  howItWorks: HowItWorksContent;
  capabilities: KeyCapabilitiesContent;
  idealFor: IdealForContent;
  platformAndCta: PlatformAndCtaContent;
  tools: ToolsContent;
};

export function ThunderCareClient({
  breadcrumb,
  hero,
  challenge,
  whatYouCanDo,
  howItWorks,
  capabilities,
  idealFor,
  platformAndCta,
  tools,
}: ThunderCareClientProps) {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 pb-6 pt-6">
        <Breadcrumb items={breadcrumb} />
      </div>
      <HeroSection content={hero} />
      <ChallengeSection content={challenge} />
      <WhatYouCanDoSection content={whatYouCanDo} />
      <HowItWorksSection content={howItWorks} />
      <KeyCapabilitiesSection content={capabilities} />
      <IdealForOrganizationSection content={idealFor} />
      <PlatformAndCtaSection content={platformAndCta} />
      <ToolsLogosSection content={tools} />
    </div>
  );
}

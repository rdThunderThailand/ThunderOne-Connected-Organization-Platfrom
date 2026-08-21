"use client";

import { useState } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { HeroSection } from "./components/HeroSection";
import { ChallengeSection } from "./components/ChallengeSection";
import { WhatYouCanDoSection } from "./components/WhatYouCanDoSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { KeyCapabilitiesSection } from "./components/KeyCapabilitiesSection";
import { IndustriesCtaSection } from "./components/IndustriesCtaSection";
import { ToolsLogosSection } from "./components/ToolsLogosSection";
import { ProductTourClient } from "./product-tour/ProductTourClient";
import type {
  ChallengeContent,
  CtaContent,
  HeroContent,
  HowItWorksContent,
  IndustriesContent,
  KeyCapabilitiesContent,
  PlatformContent,
  ToolsContent,
  WhatYouCanDoContent,
} from "./types";
import type { ProductTourContent } from "./product-tour/types";

type AssetIntelligenceClientProps = {
  breadcrumb: BreadcrumbItem[];
  hero: HeroContent;
  challenge: ChallengeContent;
  whatYouCanDo: WhatYouCanDoContent;
  howItWorks: HowItWorksContent;
  capabilities: KeyCapabilitiesContent;
  industries: IndustriesContent;
  platform: PlatformContent;
  cta: CtaContent;
  tools: ToolsContent;
  tour: ProductTourContent;
};

export function AssetIntelligenceClient({
  breadcrumb,
  hero,
  challenge,
  whatYouCanDo,
  howItWorks,
  capabilities,
  industries,
  platform,
  cta,
  tools,
  tour,
}: AssetIntelligenceClientProps) {
  const [isTourOpen, setIsTourOpen] = useState(false);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <Breadcrumb items={breadcrumb} />
      </div>
      <HeroSection content={hero} onOpenTour={() => setIsTourOpen(true)} />
      <ChallengeSection content={challenge} />
      <WhatYouCanDoSection content={whatYouCanDo} />
      <HowItWorksSection content={howItWorks} />
      <KeyCapabilitiesSection content={capabilities} />
      <IndustriesCtaSection industries={industries} platform={platform} cta={cta} />
      <ToolsLogosSection content={tools} />

      {isTourOpen && <ProductTourClient content={tour} onClose={() => setIsTourOpen(false)} />}
    </div>
  );
}

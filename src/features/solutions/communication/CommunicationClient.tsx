"use client";

import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { HeroSection } from "./components/HeroSection";
import { ChallengeSection } from "./components/ChallengeSection";
import { WhatYouCanDoSection } from "./components/WhatYouCanDoSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { KeyCapabilitiesSection } from "./components/KeyCapabilitiesSection";
import { TeamsAndPlatformSection } from "./components/TeamsAndPlatformSection";
import { ToolsAndCtaSection } from "./components/ToolsAndCtaSection";
import type {
  ChallengeContent,
  HeroContent,
  HowItWorksContent,
  KeyCapabilitiesContent,
  TeamsAndPlatformContent,
  ToolsAndCtaContent,
  WhatYouCanDoContent,
} from "./types";

type CommunicationClientProps = {
  breadcrumb: BreadcrumbItem[];
  hero: HeroContent;
  challenge: ChallengeContent;
  whatYouCanDo: WhatYouCanDoContent;
  howItWorks: HowItWorksContent;
  capabilities: KeyCapabilitiesContent;
  teamsAndPlatform: TeamsAndPlatformContent;
  toolsAndCta: ToolsAndCtaContent;
};

export function CommunicationClient({
  breadcrumb,
  hero,
  challenge,
  whatYouCanDo,
  howItWorks,
  capabilities,
  teamsAndPlatform,
  toolsAndCta,
}: CommunicationClientProps) {
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
      <TeamsAndPlatformSection content={teamsAndPlatform} />
      <ToolsAndCtaSection content={toolsAndCta} />
    </div>
  );
}

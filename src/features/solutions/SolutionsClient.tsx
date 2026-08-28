"use client";

import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { SolutionsHeroSection } from "./components/SolutionsHeroSection";
import { SolutionsGridSection } from "./components/SolutionsGridSection";
import { UnifiedPlatformSection } from "./components/UnifiedPlatformSection";
import { TrustAndCtaSection } from "./components/TrustAndCtaSection";
import type {
  SolutionsGridContent,
  SolutionsHeroContent,
  TrustAndCtaContent,
  UnifiedPlatformContent,
} from "./types";

type SolutionsClientProps = {
  breadcrumb: BreadcrumbItem[];
  hero: SolutionsHeroContent;
  grid: SolutionsGridContent;
  platform: UnifiedPlatformContent;
  trustCta: TrustAndCtaContent;
};

export function SolutionsClient({ breadcrumb, hero, grid, platform, trustCta }: SolutionsClientProps) {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <Breadcrumb items={breadcrumb} />
      </div>
      <SolutionsHeroSection content={hero} />
      <SolutionsGridSection content={grid} />
      <UnifiedPlatformSection content={platform} />
      <TrustAndCtaSection content={trustCta} />
    </div>
  );
}

import type { ReactNode } from "react";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";

export type SolutionsHeroContent = {
  title1: string;
  title2: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  diagramNodes: {
    people: string;
    work: string;
    communication: string;
    service: string;
    device: string;
    asset: string;
    space: string;
  };
  diagramBadge: string;
  diagramTagline: string;
};

export type SolutionGridItem = {
  key: string;
  title: string;
  description: string;
  checklist: string[];
  link: string;
};

export type SolutionsGridContent = {
  title: string;
  subtitle: ReactNode;
  items: SolutionGridItem[];
};

export type UnifiedPlatformContent = {
  title: string;
  subtitle: string;
  items: string[];
};

export type TrustAndCtaContent = {
  trustedTitle: string;
  logosMore: string;
  cardTitle: string;
  cardDescription: string;
  cardCta: string;
  cardNote: string;
};

export type { BreadcrumbItem };

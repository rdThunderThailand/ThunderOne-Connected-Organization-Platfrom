import type { ReactNode } from "react";

export type HeroContent = {
  trustedBy: string;
  titleLine1: ReactNode;
  titleLine2: ReactNode;
  descriptionLine1: string;
  descriptionLine2: string;
  descriptionLine3: string;
  descriptionLine4: string;
  ctaPrimary: string;
  ctaSecondary: string;
  diagramCaption: {
    title: string;
    subtitle: string;
  };
  diagramNodes: {
    people: string;
    work: string;
    space: string;
    asset: string;
    device: string;
    communication: string;
    service: string;
  };
};

export type ProblemContent = {
  badge: string;
  titleLine1: ReactNode;
  titleLine2: ReactNode;
  contextItems: {
    people: string;
    work: string;
    data: string;
    communication: string;
    system: string;
    space: string;
    asset: string;
  };
  connectorLabel: string;
  tagline: string;
};

export type PersonaGroup = {
  label: string;
  title: string;
  items: string[];
};

export type PersonaContent = {
  badge: string;
  freeMe: PersonaGroup;
  helpMe: PersonaGroup;
  connectUs: PersonaGroup;
};

export type PerspectiveRole = {
  role: string;
  question: string;
  items: string[];
};

export type PerspectiveContent = {
  title: string;
  tagline: string;
  executive: PerspectiveRole;
  manager: PerspectiveRole;
  people: PerspectiveRole;
};

export type SolutionItem = {
  title: string;
  tagline: string;
  descriptionLine1: string;
  descriptionLine2: string;
  cta: string;
  link: string;
};

export type SolutionsContent = {
  badge: string;
  title: string;
  descriptionLine1: string;
  descriptionLine2: string;
  descriptionLine3: string;
  items: SolutionItem[];
  cta: string;
};

export type ShowcaseTabKey = "executive" | "manager" | "myWork" | "communication" | "care";

export type ShowcaseMetric = {
  value: string;
  label: string;
  sublabel: string;
};

export type ShowcaseListItem = {
  label: string;
  meta: string;
};

export type ShowcaseDashboard = {
  greeting: string;
  subtitle: string;
  progressLabel: string;
  progressValue: string;
  metrics: ShowcaseMetric[];
  highlightsTitle: string;
  highlights: ShowcaseListItem[];
  decisionsTitle: string;
  decisions: ShowcaseListItem[];
};

export type ShowcaseContent = {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  tabs: Record<ShowcaseTabKey, string>;
  dashboards: Record<ShowcaseTabKey, ShowcaseDashboard>;
  nav: {
    home: string;
    missions: string;
    people: string;
    myWork: string;
    communication: string;
    care: string;
    reports: string;
    settings: string;
  };
  searchPlaceholder: string;
  aiAssistantLabel: string;
};

export type IntegrationContent = {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  cta: string;
  otherSystemsLabel: string;
  pillLabel: string;
};

export type CtaContent = {
  title: string;
  description: string;
  ctaPrimary: string;
  ctaCaption: string;
  lineLabel: string;
  lineHandle: string;
};

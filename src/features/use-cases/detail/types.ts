import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";
import type { StepAccent } from "@/components/ui/StepFlowRow";

// --- Structural (non-translated) data shapes, defined in data/*.ts. Each
// use case detail page contributes one entry keyed by slug in
// data/registry.ts — see that file for why icon keys live here instead of
// in the translation JSON (icon components can't cross the server -> client
// props boundary, see iconRegistry.ts). ---

export type MockupDefinition = {
  channelIcons: string[];
};

export type InContextViewDefinition = {
  statusColor: "blue" | "green";
};

export type IconItemDefinition = {
  icon: string;
};

export type StepItemDefinition = {
  icon: string;
  accent: StepAccent;
};

export type ConnectionDefinition = {
  icon: string;
  badgeClassName: string;
};

export type RelatedUseCaseDefinition = {
  icon: string;
  href: string;
};

export type UseCaseDetailData = {
  slug: string;
  namespace: string;
  mockup: MockupDefinition;
  inContext: {
    teamView: InContextViewDefinition;
    employeeView: InContextViewDefinition;
  };
  benefits: IconItemDefinition[];
  steps: StepItemDefinition[];
  stakeholders: IconItemDefinition[];
  connections: ConnectionDefinition[];
  relatedUseCases: RelatedUseCaseDefinition[];
};

// --- Fully-resolved (translated + structural merged) shapes passed from
// page.tsx to UseCaseDetailClient. ---

export type StatContent = {
  value: string;
  label: string;
  percent?: string;
};

export type ChannelContent = {
  icon: string;
  label: string;
};

export type MockupContent = {
  panelTitle: string;
  statusLabel: string;
  author: string;
  timestamp: string;
  bodyPreview: string;
  channelsLabel: string;
  channels: ChannelContent[];
  stats: StatContent[];
  lineNotification: {
    appName: string;
    title: string;
    timestamp: string;
    cta: string;
  };
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  forLabel: string;
  audienceTags: string[];
  ctaPrimary: string;
  ctaSecondary: string;
  mockup: MockupContent;
};

export type BenefitContent = {
  icon: string;
  title: string;
  description: string;
};

export type KeyBenefitsContent = {
  items: BenefitContent[];
};

export type SituationContent = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
};

export type OutcomeContent = {
  number: string;
  title: string;
  subtitle: string;
  points: string[];
};

export type SituationOutcomeContent = {
  situation: SituationContent;
  outcome: OutcomeContent;
};

export type StepContent = {
  icon: string;
  accent: StepAccent;
  title: string;
  description: string;
};

export type HowItWorksContent = {
  number: string;
  title: string;
  steps: StepContent[];
};

export type InContextViewContent = {
  statusColor: "blue" | "green";
  stats: StatContent[];
};

export type InContextContent = {
  number: string;
  title: string;
  teamViewLabel: string;
  employeeViewLabel: string;
  panelTitle: string;
  statusLabel: string;
  chartLabel: string;
  teamView: InContextViewContent;
  employeeView: InContextViewContent;
};

export type StakeholderContent = {
  icon: string;
  role: string;
  description: string;
};

export type StakeholdersContent = {
  number: string;
  title: string;
  items: StakeholderContent[];
};

export type ConnectionContent = {
  icon: string;
  badgeClassName: string;
  label: string;
  description: string;
};

export type ConnectsContent = {
  number: string;
  title: string;
  centerLabel: string;
  items: ConnectionContent[];
};

export type CapabilitiesContent = {
  number: string;
  title: string;
  items: string[];
};

export type BeforeAfterContent = {
  number: string;
  title: string;
  beforeTitle: string;
  afterTitle: string;
  before: string[];
  after: string[];
};

export type RelatedUseCaseContent = {
  icon: string;
  href: string;
  title: string;
};

export type RelatedContent = {
  number: string;
  title: string;
  seeAllLabel: string;
  items: RelatedUseCaseContent[];
};

export type ReadyToStartContent = {
  number: string;
  title: string;
  description: string;
  cta: string;
  point1: string;
  point2: string;
};

export type UseCaseDetailContent = {
  breadcrumb: BreadcrumbItem[];
  hero: HeroContent;
  benefits: KeyBenefitsContent;
  situationOutcome: SituationOutcomeContent;
  howItWorks: HowItWorksContent;
  inContext: InContextContent;
  stakeholders: StakeholdersContent;
  connects: ConnectsContent;
  capabilities: CapabilitiesContent;
  beforeAfter: BeforeAfterContent;
  related: RelatedContent;
  readyToStart: ReadyToStartContent;
};

export type { BreadcrumbItem, StepAccent };

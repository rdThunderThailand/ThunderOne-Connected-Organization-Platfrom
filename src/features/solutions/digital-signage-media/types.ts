import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";

export type DashboardStat = {
  value: string;
  label: string;
  delta?: string;
};

export type DashboardScreen = {
  name: string;
  status: string;
};

export type HeroDashboardContent = {
  nav: string[];
  stats: {
    screensOnline: DashboardStat;
    activePlaylists: DashboardStat;
    scheduledToday: DashboardStat;
    audienceReach: DashboardStat;
  };
  recentScreensTitle: string;
  recentScreens: DashboardScreen[];
  nowPlayingTitle: string;
  nowPlayingHeadline: string;
  nowPlayingSubheadline: string;
};

export type HeroContent = {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  dashboard: HeroDashboardContent;
};

export type ChallengeContent = {
  title: string;
  subtitle: string;
  items: string[];
};

export type PublishOption = {
  label: string;
};

export type WhatYouCanDoContent = {
  label: string;
  title: string;
  description: string;
  checklist: string[];
  screenHeadline: string;
  screenTagline: string;
  screenDate: string;
  screenLocation: string;
  screenCta: string;
  publishCard: {
    title: string;
    options: PublishOption[];
  };
  scheduleCard: {
    title: string;
    dateValue: string;
    timeValue: string;
    repeatLabel: string;
    repeatValue: string;
    saveButton: string;
  };
};

export type HowItWorksStep = {
  title: string;
  description: string;
};

export type HowItWorksContent = {
  title: string;
  steps: HowItWorksStep[];
};

export type FeatureItem = {
  title: string;
  description: string;
};

export type KeyCapabilitiesContent = {
  title: string;
  items: FeatureItem[];
};

export type PerfectForContent = {
  title: string;
  items: FeatureItem[];
};

export type ConnectedItem = {
  key: string;
  label: string;
};

export type WorksSeamlesslyContent = {
  title: string;
  description: string;
  link: string;
  centerLabel: string;
  connectedItems: ConnectedItem[];
};

export type CtaContent = {
  title: string;
  description: string;
  ctaPrimary: string;
  ctaNote: string;
  lineLabel: string;
  lineHandle: string;
};

export type { BreadcrumbItem };

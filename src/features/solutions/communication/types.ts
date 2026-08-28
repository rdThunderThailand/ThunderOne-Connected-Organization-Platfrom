import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";

export type DashboardStat = {
  value: string;
  label: string;
  delta?: string;
};

export type RecentMessage = {
  title: string;
  meta: string;
  status: string;
};

export type ChannelSlice = {
  label: string;
  percent: number;
};

export type HeroDashboardContent = {
  productLabel: string;
  panelTitle: string;
  nav: string[];
  stats: {
    messagesSent: DashboardStat;
    deliveryRate: DashboardStat;
    engagementRate: DashboardStat;
    activeChannels: DashboardStat;
  };
  recentMessagesTitle: string;
  recentMessages: RecentMessage[];
  channelDistributionTitle: string;
  channelDistribution: ChannelSlice[];
  viewFullReport: string;
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

export type WhatYouCanDoContent = {
  label: string;
  title: string;
  description: string;
  checklist: string[];
  createMessageCard: {
    title: string;
    titleFieldLabel: string;
    titleFieldValue: string;
    channelLabel: string;
    audienceLabel: string;
    audienceValue: string;
    dateValue: string;
    timeValue: string;
    nextButton: string;
  };
  previewCard: {
    label: string;
    headline: string;
    subheadline: string;
    meta: string;
    viewDetails: string;
  };
  lineChat: {
    productLabel: string;
    title: string;
    meta: string;
    ctaLabel: string;
    dontMissIt: string;
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

export type PlatformItem = {
  key: string;
  label: string;
};

export type TeamsAndPlatformContent = {
  teamsTitle: string;
  teams: string[];
  platformTitle: string;
  platformDescription: string;
  platformItems: PlatformItem[];
};

export type ToolsAndCtaContent = {
  toolsTitle: string;
  toolsNote: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimary: string;
  ctaNote: string;
};

export type { BreadcrumbItem };

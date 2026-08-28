import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";

export type DashboardStat = {
  value: string;
  label: string;
  delta?: string;
};

export type RecentTicket = {
  title: string;
  meta: string;
  status: string;
};

export type CategorySlice = {
  label: string;
  percent: number;
};

export type HeroDashboardContent = {
  productLabel: string;
  panelTitle: string;
  dateRange: string;
  nav: string[];
  stats: {
    openTickets: DashboardStat;
    requestsToday: DashboardStat;
    resolvedToday: DashboardStat;
    slaAchievement: DashboardStat;
  };
  recentTicketsTitle: string;
  recentTickets: RecentTicket[];
  ticketByCategoryTitle: string;
  ticketByCategory: CategorySlice[];
  viewAllTickets: string;
  viewReport: string;
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

export type TrackingStep = {
  label: string;
  time: string;
};

export type WhatYouCanDoContent = {
  label: string;
  title: string;
  description: string;
  checklist: string[];
  createTicketCard: {
    title: string;
    requestTypeLabel: string;
    requestTypeValue: string;
    categoryLabel: string;
    categoryValue: string;
    detailsValue: string;
    submitButton: string;
  };
  trackingCard: {
    title: string;
    steps: TrackingStep[];
    assignedToLabel: string;
    assignedToValue: string;
    dueDateLabel: string;
    dueDateValue: string;
    slaPerformanceTitle: string;
    slaPercent: number;
    slaAchievedLabel: string;
    viewSlaReport: string;
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

export type IdealForContent = {
  title: string;
  items: FeatureItem[];
};

export type PlatformConnectedItem = {
  key: string;
  label: string;
};

export type PlatformAndCtaContent = {
  platformTitle: string;
  platformDescription: string;
  exploreLink: string;
  centerLabel: string;
  connectedItems: PlatformConnectedItem[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimary: string;
  ctaNote: string;
};

export type ToolsContent = {
  title: string;
  logosNote: string;
};

export type { BreadcrumbItem };

import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";

export type ReadinessItem = {
  label: string;
  ready: number;
  total: number;
  statusLabel: string;
};

export type QuickAction = {
  title: string;
  description: string;
};

export type Announcement = {
  title: string;
  meta: string;
};

export type HeroDashboardContent = {
  productLabel: string;
  productSubLabel: string;
  greeting: string;
  userName: string;
  greetingSubtitle: string;
  searchPlaceholder: string;
  userRole: string;
  nav: string[];
  readinessTitle: string;
  readinessPercent: number;
  readinessCenterLabel: string;
  readinessItems: ReadinessItem[];
  viewAllReadiness: string;
  quickActionsTitle: string;
  quickActions: QuickAction[];
  announcementsTitle: string;
  viewAllAnnouncements: string;
  announcements: Announcement[];
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

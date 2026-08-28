import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";

export type DashboardStat = {
  value: string;
  label: string;
  delta?: string;
};

export type StatusSlice = {
  label: string;
  percent: number;
};

export type WorkOrderItem = {
  title: string;
  meta: string;
  status: string;
};

export type InspectionItem = {
  title: string;
  meta: string;
  date: string;
};

export type HeroDashboardContent = {
  productLabel: string;
  panelTitle: string;
  dateRange: string;
  departmentFilter: string;
  nav: string[];
  stats: {
    totalAssets: DashboardStat;
    activeAssets: DashboardStat;
    assetsInMaintenance: DashboardStat;
    assetValue: DashboardStat;
  };
  assetsByStatusTitle: string;
  assetsByStatus: StatusSlice[];
  myWorkOrdersTitle: string;
  myWorkOrders: WorkOrderItem[];
  recentInspectionsTitle: string;
  recentInspections: InspectionItem[];
  viewFullReport: string;
  goToWorkOrders: string;
  viewAll: string;
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

export type AssetCardContent = {
  name: string;
  statusLabel: string;
  subtitle: string;
  purchaseDateLabel: string;
  purchaseDateValue: string;
  assetValueLabel: string;
  assetValueValue: string;
  expectedLifeLabel: string;
  expectedLifeValue: string;
  warrantyUntilLabel: string;
  warrantyUntilValue: string;
  scanLabel: string;
  tabs: string[];
  overview: {
    assetIdLabel: string;
    assetIdValue: string;
    categoryLabel: string;
    categoryValue: string;
    brandModelLabel: string;
    brandModelValue: string;
    serialNumberLabel: string;
    serialNumberValue: string;
    locationLabel: string;
    locationValue: string;
  };
};

export type MobileCardContent = {
  name: string;
  statusLabel: string;
  purchaseDateLabel: string;
  purchaseDateValue: string;
  assetValueLabel: string;
  assetValueValue: string;
  nextMaintenanceLabel: string;
  nextMaintenanceValue: string;
  createWorkOrderButton: string;
};

export type WhatYouCanDoContent = {
  label: string;
  title: string;
  checklist: string[];
  assetCard: AssetCardContent;
  mobileCard: MobileCardContent;
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

export type IndustriesContent = {
  title: string;
  items: string[];
};

export type PlatformNodeItem = {
  key: string;
  label: string;
};

export type PlatformContent = {
  title: string;
  centerLabel: string;
  items: PlatformNodeItem[];
};

export type CtaContent = {
  title: string;
  description: string;
  ctaPrimary: string;
  ctaNote: string;
};

export type ToolsContent = {
  title: string;
  logosNote: string;
};

export type { BreadcrumbItem };

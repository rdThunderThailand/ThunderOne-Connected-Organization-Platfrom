import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AssetIntelligenceClient } from "@/features/solutions/asset-intelligence/AssetIntelligenceClient";
import type {
  DashboardStat,
  FeatureItem,
  HowItWorksStep,
  InspectionItem,
  PlatformNodeItem,
  StatusSlice,
  WorkOrderItem,
} from "@/features/solutions/asset-intelligence/types";
import type {
  ProductTourContent,
  TourPlaceholderStepContent,
  TourStep3Content,
} from "@/features/solutions/asset-intelligence/product-tour/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AssetIntelligencePage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AssetIntelligencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("AssetIntelligencePage");
  const tourT = await getTranslations("AssetIntelligenceProductTour");

  const tour: ProductTourContent = {
    endTour: tourT("endTour"),
    asset: tourT.raw("asset"),
    sidebar: tourT.raw("sidebar"),
    stepHeader: tourT.raw("stepHeader"),
    steps: {
      step1: tourT.raw("steps.step1") as TourPlaceholderStepContent,
      step2: tourT.raw("steps.step2") as TourPlaceholderStepContent,
      step3: tourT.raw("steps.step3") as TourStep3Content,
      step4: tourT.raw("steps.step4") as TourPlaceholderStepContent,
      step5: tourT.raw("steps.step5") as TourPlaceholderStepContent,
      step6: tourT.raw("steps.step6") as TourPlaceholderStepContent,
    },
    summaryPanel: tourT.raw("summaryPanel"),
    bottomBar: tourT.raw("bottomBar"),
    mobileTabs: tourT.raw("mobileTabs"),
  };

  return (
    <AssetIntelligenceClient
      breadcrumb={[
        { label: t("breadcrumb.home"), href: "/" },
        { label: t("breadcrumb.solutions"), href: "/solutions" },
        { label: t("breadcrumb.current") },
      ]}
      hero={{
        badge: t("hero.badge"),
        title: t("hero.title"),
        subtitle: t("hero.subtitle"),
        description: t("hero.description"),
        ctaPrimary: t("hero.ctaPrimary"),
        ctaSecondary: t("hero.ctaSecondary"),
        dashboard: {
          productLabel: t("hero.dashboard.productLabel"),
          panelTitle: t("hero.dashboard.panelTitle"),
          dateRange: t("hero.dashboard.dateRange"),
          departmentFilter: t("hero.dashboard.departmentFilter"),
          nav: t.raw("hero.dashboard.nav") as string[],
          stats: {
            totalAssets: t.raw("hero.dashboard.stats.totalAssets") as DashboardStat,
            activeAssets: t.raw("hero.dashboard.stats.activeAssets") as DashboardStat,
            assetsInMaintenance: t.raw("hero.dashboard.stats.assetsInMaintenance") as DashboardStat,
            assetValue: t.raw("hero.dashboard.stats.assetValue") as DashboardStat,
          },
          assetsByStatusTitle: t("hero.dashboard.assetsByStatusTitle"),
          assetsByStatus: t.raw("hero.dashboard.assetsByStatus") as StatusSlice[],
          myWorkOrdersTitle: t("hero.dashboard.myWorkOrdersTitle"),
          myWorkOrders: t.raw("hero.dashboard.myWorkOrders") as WorkOrderItem[],
          recentInspectionsTitle: t("hero.dashboard.recentInspectionsTitle"),
          recentInspections: t.raw("hero.dashboard.recentInspections") as InspectionItem[],
          viewFullReport: t("hero.dashboard.viewFullReport"),
          goToWorkOrders: t("hero.dashboard.goToWorkOrders"),
          viewAll: t("hero.dashboard.viewAll"),
        },
      }}
      challenge={{
        title: t("challenge.title"),
        subtitle: t("challenge.subtitle"),
        items: t.raw("challenge.items") as string[],
      }}
      whatYouCanDo={{
        label: t("whatYouCanDo.label"),
        title: t("whatYouCanDo.title"),
        checklist: t.raw("whatYouCanDo.checklist") as string[],
        assetCard: {
          name: t("whatYouCanDo.assetCard.name"),
          statusLabel: t("whatYouCanDo.assetCard.statusLabel"),
          subtitle: t("whatYouCanDo.assetCard.subtitle"),
          purchaseDateLabel: t("whatYouCanDo.assetCard.purchaseDateLabel"),
          purchaseDateValue: t("whatYouCanDo.assetCard.purchaseDateValue"),
          assetValueLabel: t("whatYouCanDo.assetCard.assetValueLabel"),
          assetValueValue: t("whatYouCanDo.assetCard.assetValueValue"),
          expectedLifeLabel: t("whatYouCanDo.assetCard.expectedLifeLabel"),
          expectedLifeValue: t("whatYouCanDo.assetCard.expectedLifeValue"),
          warrantyUntilLabel: t("whatYouCanDo.assetCard.warrantyUntilLabel"),
          warrantyUntilValue: t("whatYouCanDo.assetCard.warrantyUntilValue"),
          scanLabel: t("whatYouCanDo.assetCard.scanLabel"),
          tabs: t.raw("whatYouCanDo.assetCard.tabs") as string[],
          overview: {
            assetIdLabel: t("whatYouCanDo.assetCard.overview.assetIdLabel"),
            assetIdValue: t("whatYouCanDo.assetCard.overview.assetIdValue"),
            categoryLabel: t("whatYouCanDo.assetCard.overview.categoryLabel"),
            categoryValue: t("whatYouCanDo.assetCard.overview.categoryValue"),
            brandModelLabel: t("whatYouCanDo.assetCard.overview.brandModelLabel"),
            brandModelValue: t("whatYouCanDo.assetCard.overview.brandModelValue"),
            serialNumberLabel: t("whatYouCanDo.assetCard.overview.serialNumberLabel"),
            serialNumberValue: t("whatYouCanDo.assetCard.overview.serialNumberValue"),
            locationLabel: t("whatYouCanDo.assetCard.overview.locationLabel"),
            locationValue: t("whatYouCanDo.assetCard.overview.locationValue"),
          },
        },
        mobileCard: {
          name: t("whatYouCanDo.mobileCard.name"),
          statusLabel: t("whatYouCanDo.mobileCard.statusLabel"),
          purchaseDateLabel: t("whatYouCanDo.mobileCard.purchaseDateLabel"),
          purchaseDateValue: t("whatYouCanDo.mobileCard.purchaseDateValue"),
          assetValueLabel: t("whatYouCanDo.mobileCard.assetValueLabel"),
          assetValueValue: t("whatYouCanDo.mobileCard.assetValueValue"),
          nextMaintenanceLabel: t("whatYouCanDo.mobileCard.nextMaintenanceLabel"),
          nextMaintenanceValue: t("whatYouCanDo.mobileCard.nextMaintenanceValue"),
          createWorkOrderButton: t("whatYouCanDo.mobileCard.createWorkOrderButton"),
        },
      }}
      howItWorks={{
        title: t("howItWorks.title"),
        steps: t.raw("howItWorks.steps") as HowItWorksStep[],
      }}
      capabilities={{
        title: t("capabilities.title"),
        items: t.raw("capabilities.items") as FeatureItem[],
      }}
      industries={{
        title: t("industries.title"),
        items: t.raw("industries.items") as string[],
      }}
      platform={{
        title: t("platform.title"),
        centerLabel: t("platform.centerLabel"),
        items: t.raw("platform.items") as PlatformNodeItem[],
      }}
      cta={{
        title: t("cta.title"),
        description: t("cta.description"),
        ctaPrimary: t("cta.ctaPrimary"),
        ctaNote: t("cta.ctaNote"),
      }}
      tools={{
        title: t("tools.title"),
        logosNote: t("tools.logosNote"),
      }}
      tour={tour}
    />
  );
}

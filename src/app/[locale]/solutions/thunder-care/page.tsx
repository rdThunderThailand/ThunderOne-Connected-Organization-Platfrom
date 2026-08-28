import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ThunderCareClient } from "@/features/solutions/thunder-care/ThunderCareClient";
import type {
  CategorySlice,
  FeatureItem,
  HowItWorksStep,
  PlatformConnectedItem,
  RecentTicket,
  TrackingStep,
} from "@/features/solutions/thunder-care/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ThunderCarePage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ThunderCarePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ThunderCarePage");

  return (
    <ThunderCareClient
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
          nav: t.raw("hero.dashboard.nav") as string[],
          stats: {
            openTickets: t.raw("hero.dashboard.stats.openTickets"),
            requestsToday: t.raw("hero.dashboard.stats.requestsToday"),
            resolvedToday: t.raw("hero.dashboard.stats.resolvedToday"),
            slaAchievement: t.raw("hero.dashboard.stats.slaAchievement"),
          },
          recentTicketsTitle: t("hero.dashboard.recentTicketsTitle"),
          recentTickets: t.raw("hero.dashboard.recentTickets") as RecentTicket[],
          ticketByCategoryTitle: t("hero.dashboard.ticketByCategoryTitle"),
          ticketByCategory: t.raw("hero.dashboard.ticketByCategory") as CategorySlice[],
          viewAllTickets: t("hero.dashboard.viewAllTickets"),
          viewReport: t("hero.dashboard.viewReport"),
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
        description: t("whatYouCanDo.description"),
        checklist: t.raw("whatYouCanDo.checklist") as string[],
        createTicketCard: {
          title: t("whatYouCanDo.createTicketCard.title"),
          requestTypeLabel: t("whatYouCanDo.createTicketCard.requestTypeLabel"),
          requestTypeValue: t("whatYouCanDo.createTicketCard.requestTypeValue"),
          categoryLabel: t("whatYouCanDo.createTicketCard.categoryLabel"),
          categoryValue: t("whatYouCanDo.createTicketCard.categoryValue"),
          detailsValue: t("whatYouCanDo.createTicketCard.detailsValue"),
          submitButton: t("whatYouCanDo.createTicketCard.submitButton"),
        },
        trackingCard: {
          title: t("whatYouCanDo.trackingCard.title"),
          steps: t.raw("whatYouCanDo.trackingCard.steps") as TrackingStep[],
          assignedToLabel: t("whatYouCanDo.trackingCard.assignedToLabel"),
          assignedToValue: t("whatYouCanDo.trackingCard.assignedToValue"),
          dueDateLabel: t("whatYouCanDo.trackingCard.dueDateLabel"),
          dueDateValue: t("whatYouCanDo.trackingCard.dueDateValue"),
          slaPerformanceTitle: t("whatYouCanDo.trackingCard.slaPerformanceTitle"),
          slaPercent: t.raw("whatYouCanDo.trackingCard.slaPercent") as number,
          slaAchievedLabel: t("whatYouCanDo.trackingCard.slaAchievedLabel"),
          viewSlaReport: t("whatYouCanDo.trackingCard.viewSlaReport"),
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
      idealFor={{
        title: t("idealFor.title"),
        items: t.raw("idealFor.items") as FeatureItem[],
      }}
      platformAndCta={{
        platformTitle: t("platform.title"),
        platformDescription: t("platform.description"),
        exploreLink: t("platform.exploreLink"),
        centerLabel: t("platform.centerLabel"),
        connectedItems: t.raw("platform.connectedItems") as PlatformConnectedItem[],
        ctaTitle: t("cta.title"),
        ctaDescription: t("cta.description"),
        ctaPrimary: t("cta.ctaPrimary"),
        ctaNote: t("cta.ctaNote"),
      }}
      tools={{
        title: t("tools.title"),
        logosNote: t("tools.logosNote"),
      }}
    />
  );
}

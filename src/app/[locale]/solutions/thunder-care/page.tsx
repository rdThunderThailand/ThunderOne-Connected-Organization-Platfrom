import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ThunderCareClient } from "@/features/solutions/thunder-care/ThunderCareClient";
import type { ThunderCareDemoContent } from "@/features/solutions/thunder-care/demo/types";
import type {
  Announcement,
  FeatureItem,
  HowItWorksStep,
  PlatformConnectedItem,
  QuickAction,
  ReadinessItem,
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
  const demoT = await getTranslations("ThunderCareDemo");

  const demo: ThunderCareDemoContent = {
    topBar: demoT.raw("topBar"),
    mobileTabs: demoT.raw("mobileTabs"),
    skeletonNote: demoT("skeletonNote"),
    stepper: demoT.raw("stepper"),
    story: demoT.raw("story"),
    steps: {
      step1: demoT.raw("steps.step1"),
      step2: demoT.raw("steps.step2"),
      step3: demoT.raw("steps.step3"),
      step4: demoT.raw("steps.step4"),
      step5: demoT.raw("steps.step5"),
      step6: demoT.raw("steps.step6"),
    },
  };

  return (
    <ThunderCareClient
      demo={demo}
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
          productSubLabel: t("hero.dashboard.productSubLabel"),
          greeting: t("hero.dashboard.greeting"),
          userName: t("hero.dashboard.userName"),
          greetingSubtitle: t("hero.dashboard.greetingSubtitle"),
          searchPlaceholder: t("hero.dashboard.searchPlaceholder"),
          userRole: t("hero.dashboard.userRole"),
          nav: t.raw("hero.dashboard.nav") as string[],
          readinessTitle: t("hero.dashboard.readinessTitle"),
          readinessPercent: t.raw("hero.dashboard.readinessPercent") as number,
          readinessCenterLabel: t("hero.dashboard.readinessCenterLabel"),
          readinessItems: t.raw("hero.dashboard.readinessItems") as ReadinessItem[],
          viewAllReadiness: t("hero.dashboard.viewAllReadiness"),
          quickActionsTitle: t("hero.dashboard.quickActionsTitle"),
          quickActions: t.raw("hero.dashboard.quickActions") as QuickAction[],
          announcementsTitle: t("hero.dashboard.announcementsTitle"),
          viewAllAnnouncements: t("hero.dashboard.viewAllAnnouncements"),
          announcements: t.raw("hero.dashboard.announcements") as Announcement[],
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

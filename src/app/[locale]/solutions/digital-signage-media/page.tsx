import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DigitalSignageMediaClient } from "@/features/solutions/digital-signage-media/DigitalSignageMediaClient";
import type {
  ConnectedItem,
  DashboardScreen,
  FeatureItem,
  HowItWorksStep,
  PublishOption,
} from "@/features/solutions/digital-signage-media/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DigitalSignageMediaPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function DigitalSignageMediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("DigitalSignageMediaPage");

  return (
    <DigitalSignageMediaClient
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
          nav: t.raw("hero.dashboard.nav") as string[],
          stats: {
            screensOnline: t.raw("hero.dashboard.stats.screensOnline"),
            activePlaylists: t.raw("hero.dashboard.stats.activePlaylists"),
            scheduledToday: t.raw("hero.dashboard.stats.scheduledToday"),
            audienceReach: t.raw("hero.dashboard.stats.audienceReach"),
          },
          recentScreensTitle: t("hero.dashboard.recentScreensTitle"),
          recentScreens: t.raw("hero.dashboard.recentScreens") as DashboardScreen[],
          nowPlayingTitle: t("hero.dashboard.nowPlayingTitle"),
          nowPlayingHeadline: t("hero.dashboard.nowPlayingHeadline"),
          nowPlayingSubheadline: t("hero.dashboard.nowPlayingSubheadline"),
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
        screenHeadline: t("whatYouCanDo.screenHeadline"),
        screenTagline: t("whatYouCanDo.screenTagline"),
        screenDate: t("whatYouCanDo.screenDate"),
        screenLocation: t("whatYouCanDo.screenLocation"),
        screenCta: t("whatYouCanDo.screenCta"),
        publishCard: {
          title: t("whatYouCanDo.publishCard.title"),
          options: t.raw("whatYouCanDo.publishCard.options") as PublishOption[],
        },
        scheduleCard: {
          title: t("whatYouCanDo.scheduleCard.title"),
          dateValue: t("whatYouCanDo.scheduleCard.dateValue"),
          timeValue: t("whatYouCanDo.scheduleCard.timeValue"),
          repeatLabel: t("whatYouCanDo.scheduleCard.repeatLabel"),
          repeatValue: t("whatYouCanDo.scheduleCard.repeatValue"),
          saveButton: t("whatYouCanDo.scheduleCard.saveButton"),
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
      perfectFor={{
        title: t("perfectFor.title"),
        items: t.raw("perfectFor.items") as FeatureItem[],
      }}
      seamless={{
        title: t("seamless.title"),
        description: t("seamless.description"),
        link: t("seamless.link"),
        centerLabel: t("seamless.centerLabel"),
        connectedItems: t.raw("seamless.connectedItems") as ConnectedItem[],
      }}
      cta={{
        title: t("cta.title"),
        description: t("cta.description"),
        ctaPrimary: t("cta.ctaPrimary"),
        ctaNote: t("cta.ctaNote"),
        lineLabel: t("cta.lineLabel"),
        lineHandle: t("cta.lineHandle"),
      }}
    />
  );
}

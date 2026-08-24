import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CommunicationClient } from "@/features/solutions/communication/CommunicationClient";
import type {
  ChannelSlice,
  FeatureItem,
  HowItWorksStep,
  PlatformItem,
  RecentMessage,
} from "@/features/solutions/communication/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CommunicationPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function CommunicationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("CommunicationPage");

  return (
    <CommunicationClient
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
          nav: t.raw("hero.dashboard.nav") as string[],
          stats: {
            messagesSent: t.raw("hero.dashboard.stats.messagesSent"),
            deliveryRate: t.raw("hero.dashboard.stats.deliveryRate"),
            engagementRate: t.raw("hero.dashboard.stats.engagementRate"),
            activeChannels: t.raw("hero.dashboard.stats.activeChannels"),
          },
          recentMessagesTitle: t("hero.dashboard.recentMessagesTitle"),
          recentMessages: t.raw("hero.dashboard.recentMessages") as RecentMessage[],
          channelDistributionTitle: t("hero.dashboard.channelDistributionTitle"),
          channelDistribution: t.raw("hero.dashboard.channelDistribution") as ChannelSlice[],
          viewFullReport: t("hero.dashboard.viewFullReport"),
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
        createMessageCard: {
          title: t("whatYouCanDo.createMessageCard.title"),
          titleFieldLabel: t("whatYouCanDo.createMessageCard.titleFieldLabel"),
          titleFieldValue: t("whatYouCanDo.createMessageCard.titleFieldValue"),
          channelLabel: t("whatYouCanDo.createMessageCard.channelLabel"),
          audienceLabel: t("whatYouCanDo.createMessageCard.audienceLabel"),
          audienceValue: t("whatYouCanDo.createMessageCard.audienceValue"),
          dateValue: t("whatYouCanDo.createMessageCard.dateValue"),
          timeValue: t("whatYouCanDo.createMessageCard.timeValue"),
          nextButton: t("whatYouCanDo.createMessageCard.nextButton"),
        },
        previewCard: {
          label: t("whatYouCanDo.previewCard.label"),
          headline: t("whatYouCanDo.previewCard.headline"),
          subheadline: t("whatYouCanDo.previewCard.subheadline"),
          meta: t("whatYouCanDo.previewCard.meta"),
          viewDetails: t("whatYouCanDo.previewCard.viewDetails"),
        },
        lineChat: {
          productLabel: t("whatYouCanDo.lineChat.productLabel"),
          title: t("whatYouCanDo.lineChat.title"),
          meta: t("whatYouCanDo.lineChat.meta"),
          ctaLabel: t("whatYouCanDo.lineChat.ctaLabel"),
          dontMissIt: t("whatYouCanDo.lineChat.dontMissIt"),
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
      teamsAndPlatform={{
        teamsTitle: t("teams.title"),
        teams: t.raw("teams.items") as string[],
        platformTitle: t("platform.title"),
        platformDescription: t("platform.description"),
        platformItems: t.raw("platform.items") as PlatformItem[],
      }}
      toolsAndCta={{
        toolsTitle: t("tools.title"),
        toolsNote: t("tools.logosNote"),
        ctaTitle: t("cta.title"),
        ctaDescription: t("cta.description"),
        ctaPrimary: t("cta.ctaPrimary"),
        ctaNote: t("cta.ctaNote"),
      }}
    />
  );
}

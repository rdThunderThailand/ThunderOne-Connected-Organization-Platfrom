import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { UseCaseDetailClient } from "@/features/use-cases/detail/UseCaseDetailClient";
import { USE_CASE_DETAIL_REGISTRY, getUseCaseDetailData } from "@/features/use-cases/detail/data/registry";
import type {
  BenefitContent,
  ConnectionContent,
  RelatedUseCaseContent,
  StakeholderContent,
  StepContent,
  UseCaseDetailContent,
} from "@/features/use-cases/detail/types";

// Only slugs registered in USE_CASE_DETAIL_REGISTRY have authored detail
// content today; every other USE_CASES entry (already linked from the
// /use-cases list page) 404s via notFound() below until its own detail data
// + translations are added.
export function generateStaticParams() {
  return Object.keys(USE_CASE_DETAIL_REGISTRY).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = getUseCaseDetailData(slug);
  if (!data) return {};

  const t = await getTranslations({ locale, namespace: data.namespace });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const data = getUseCaseDetailData(slug);
  if (!data) notFound();

  setRequestLocale(locale);
  const t = await getTranslations(data.namespace);

  const benefitsText = t.raw("benefits.items") as { title: string; description: string }[];
  const benefits: BenefitContent[] = data.benefits.map((benefit, index) => ({
    icon: benefit.icon,
    title: benefitsText[index].title,
    description: benefitsText[index].description,
  }));

  const stepsText = t.raw("howItWorks.steps") as { title: string; description: string }[];
  const steps: StepContent[] = data.steps.map((step, index) => ({
    icon: step.icon,
    accent: step.accent,
    title: stepsText[index].title,
    description: stepsText[index].description,
  }));

  const stakeholdersText = t.raw("stakeholders.items") as { role: string; description: string }[];
  const stakeholders: StakeholderContent[] = data.stakeholders.map((stakeholder, index) => ({
    icon: stakeholder.icon,
    role: stakeholdersText[index].role,
    description: stakeholdersText[index].description,
  }));

  const connectionsText = t.raw("connects.items") as { label: string; description: string }[];
  const connections: ConnectionContent[] = data.connections.map((connection, index) => ({
    icon: connection.icon,
    badgeClassName: connection.badgeClassName,
    label: connectionsText[index].label,
    description: connectionsText[index].description,
  }));

  const relatedText = t.raw("related.items") as { title: string }[];
  const related: RelatedUseCaseContent[] = data.relatedUseCases.map((item, index) => ({
    icon: item.icon,
    href: item.href,
    title: relatedText[index].title,
  }));

  const content: UseCaseDetailContent = {
    breadcrumb: [
      { label: t("breadcrumb.home"), href: "/" },
      { label: t("breadcrumb.useCases"), href: "/use-cases" },
      { label: t("breadcrumb.category") },
      { label: t("breadcrumb.current") },
    ],
    hero: {
      eyebrow: t("hero.eyebrow"),
      title: t("hero.title"),
      description: t("hero.description"),
      forLabel: t("hero.forLabel"),
      audienceTags: t.raw("hero.audienceTags") as string[],
      ctaPrimary: t("hero.ctaPrimary"),
      ctaSecondary: t("hero.ctaSecondary"),
      mockup: {
        panelTitle: t("hero.mockup.panelTitle"),
        statusLabel: t("hero.mockup.statusLabel"),
        author: t("hero.mockup.author"),
        timestamp: t("hero.mockup.timestamp"),
        bodyPreview: t("hero.mockup.bodyPreview"),
        channelsLabel: t("hero.mockup.channelsLabel"),
        channels: data.mockup.channelIcons.map((icon, index) => ({
          icon,
          label: (t.raw("hero.mockup.channelLabels") as string[])[index],
        })),
        stats: t.raw("hero.mockup.stats"),
        lineNotification: {
          appName: t("hero.mockup.lineNotification.appName"),
          title: t("hero.mockup.lineNotification.title"),
          timestamp: t("hero.mockup.lineNotification.timestamp"),
          cta: t("hero.mockup.lineNotification.cta"),
        },
      },
    },
    benefits: { items: benefits },
    situationOutcome: {
      situation: {
        number: t("situationOutcome.situation.number"),
        title: t("situationOutcome.situation.title"),
        subtitle: t("situationOutcome.situation.subtitle"),
        description: t("situationOutcome.situation.description"),
        points: t.raw("situationOutcome.situation.points") as string[],
      },
      outcome: {
        number: t("situationOutcome.outcome.number"),
        title: t("situationOutcome.outcome.title"),
        subtitle: t("situationOutcome.outcome.subtitle"),
        points: t.raw("situationOutcome.outcome.points") as string[],
      },
    },
    howItWorks: {
      number: t("howItWorks.number"),
      title: t("howItWorks.title"),
      steps,
    },
    inContext: {
      number: t("inContext.number"),
      title: t("inContext.title"),
      teamViewLabel: t("inContext.teamViewLabel"),
      employeeViewLabel: t("inContext.employeeViewLabel"),
      panelTitle: t("inContext.panelTitle"),
      statusLabel: t("inContext.statusLabel"),
      chartLabel: t("inContext.chartLabel"),
      teamView: {
        statusColor: data.inContext.teamView.statusColor,
        stats: t.raw("inContext.teamView.stats"),
      },
      employeeView: {
        statusColor: data.inContext.employeeView.statusColor,
        stats: t.raw("inContext.employeeView.stats"),
      },
    },
    stakeholders: {
      number: t("stakeholders.number"),
      title: t("stakeholders.title"),
      items: stakeholders,
    },
    connects: {
      number: t("connects.number"),
      title: t("connects.title"),
      centerLabel: t("connects.centerLabel"),
      items: connections,
    },
    capabilities: {
      number: t("capabilities.number"),
      title: t("capabilities.title"),
      items: t.raw("capabilities.items") as string[],
    },
    beforeAfter: {
      number: t("beforeAfter.number"),
      title: t("beforeAfter.title"),
      beforeTitle: t("beforeAfter.beforeTitle"),
      afterTitle: t("beforeAfter.afterTitle"),
      before: t.raw("beforeAfter.before") as string[],
      after: t.raw("beforeAfter.after") as string[],
    },
    related: {
      number: t("related.number"),
      title: t("related.title"),
      seeAllLabel: t("related.seeAllLabel"),
      items: related,
    },
    readyToStart: {
      number: t("readyToStart.number"),
      title: t("readyToStart.title"),
      description: t("readyToStart.description"),
      cta: t("readyToStart.cta"),
      point1: t("readyToStart.point1"),
      point2: t("readyToStart.point2"),
    },
  };

  return <UseCaseDetailClient content={content} />;
}

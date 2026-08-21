import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SolutionsClient } from "@/features/solutions/SolutionsClient";
import type { SolutionGridItem } from "@/features/solutions/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SolutionsPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("SolutionsPage");

  return (
    <SolutionsClient
      breadcrumb={[
        { label: t("breadcrumb.home"), href: "/" },
        { label: t("breadcrumb.current") },
      ]}
      hero={{
        title1: t("hero.title1"),
        title2: t("hero.title2"),
        description: t("hero.description"),
        ctaPrimary: t("hero.ctaPrimary"),
        ctaSecondary: t("hero.ctaSecondary"),
        diagramNodes: {
          people: t("hero.diagramLabels.people"),
          work: t("hero.diagramLabels.work"),
          communication: t("hero.diagramLabels.communication"),
          service: t("hero.diagramLabels.service"),
          device: t("hero.diagramLabels.device"),
          asset: t("hero.diagramLabels.asset"),
          space: t("hero.diagramLabels.space"),
        },
        diagramBadge: t("hero.diagramBadge"),
        diagramTagline: t("hero.diagramTagline"),
      }}
      grid={{
        title: t("grid.title"),
        subtitle: t("grid.subtitle"),
        items: t.raw("grid.items") as SolutionGridItem[],
      }}
      platform={{
        title: t("platform.title"),
        subtitle: t("platform.subtitle"),
        items: t.raw("platform.items") as string[],
      }}
      trustCta={{
        trustedTitle: t("trustCta.trustedTitle"),
        logosMore: t("trustCta.logosMore"),
        cardTitle: t("trustCta.cardTitle"),
        cardDescription: t("trustCta.cardDescription"),
        cardCta: t("trustCta.cardCta"),
        cardNote: t("trustCta.cardNote"),
      }}
    />
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeClient } from "@/features/home/HomeClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("HomePage");

  return (
    <HomeClient
      hero={{
        trustedBy: t("hero.trustedBy"),
        titleLine1: t.rich("hero.titleLine1", {
          blue: (chunks) => <span className="text-brand-blue">{chunks}</span>,
        }),
        titleLine2: t.rich("hero.titleLine2", {
          blue: (chunks) => <span className="text-brand-blue">{chunks}</span>,
        }),
        description: t("hero.description"),
        ctaPrimary: t("hero.ctaPrimary"),
        ctaSecondary: t("hero.ctaSecondary"),
        diagramCaption: {
          title: t("hero.diagramCaption.title"),
          subtitle: t("hero.diagramCaption.subtitle"),
        },
        diagramNodes: {
          people: t("hero.diagramNodes.people"),
          work: t("hero.diagramNodes.work"),
          space: t("hero.diagramNodes.space"),
          asset: t("hero.diagramNodes.asset"),
          device: t("hero.diagramNodes.device"),
          communication: t("hero.diagramNodes.communication"),
          service: t("hero.diagramNodes.service"),
        },
      }}
      problem={{
        badge: t("problem.badge"),
        titleLine1: t("problem.titleLine1"),
        titleLine2: t.rich("problem.titleLine2", {
          blue: (chunks) => <span className="text-brand-blue">{chunks}</span>,
        }),
        contextItems: {
          people: t("problem.contextItems.people"),
          work: t("problem.contextItems.work"),
          data: t("problem.contextItems.data"),
          communication: t("problem.contextItems.communication"),
          system: t("problem.contextItems.system"),
          space: t("problem.contextItems.space"),
          asset: t("problem.contextItems.asset"),
        },
        connectorLabel: t("problem.connectorLabel"),
        tagline: t("problem.tagline"),
      }}
      persona={{
        badge: t("persona.badge"),
        freeMe: {
          label: t("persona.freeMe.label"),
          title: t("persona.freeMe.title"),
          items: t.raw("persona.freeMe.items"),
        },
        helpMe: {
          label: t("persona.helpMe.label"),
          title: t("persona.helpMe.title"),
          items: t.raw("persona.helpMe.items"),
        },
        connectUs: {
          label: t("persona.connectUs.label"),
          title: t("persona.connectUs.title"),
          items: t.raw("persona.connectUs.items"),
        },
      }}
      perspective={{
        title: t("perspective.title"),
        tagline: t("perspective.tagline"),
        executive: {
          role: t("perspective.executive.role"),
          question: t("perspective.executive.question"),
          items: t.raw("perspective.executive.items"),
        },
        manager: {
          role: t("perspective.manager.role"),
          question: t("perspective.manager.question"),
          items: t.raw("perspective.manager.items"),
        },
        people: {
          role: t("perspective.people.role"),
          question: t("perspective.people.question"),
          items: t.raw("perspective.people.items"),
        },
      }}
      solutions={{
        badge: t("solutions.badge"),
        title: t("solutions.title"),
        description: t("solutions.description"),
        items: t.raw("solutions.items"),
        cta: t("solutions.cta"),
      }}
      showcase={t.raw("showcase")}
      integration={{
        badge: t("integration.badge"),
        title: t("integration.title"),
        description: t("integration.description"),
        cta: t("integration.cta"),
        otherSystemsLabel: t("integration.otherSystemsLabel"),
        pillLabel: t("integration.pillLabel"),
      }}
      cta={{
        title: t("cta.title"),
        description: t("cta.description"),
        ctaPrimary: t("cta.ctaPrimary"),
        ctaLine: t("cta.ctaLine"),
      }}
    />
  );
}

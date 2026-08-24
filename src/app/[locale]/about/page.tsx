import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutClient } from "@/features/about/AboutClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("AboutPage");

  return (
    <AboutClient
      eyebrow={t("eyebrow")}
      heading={t("heading")}
      intro={t("intro")}
      missionTitle={t("missionTitle")}
      missionBody={t("missionBody")}
      contactTitle={t("contactTitle")}
      contactBody={t("contactBody")}
    />
  );
}

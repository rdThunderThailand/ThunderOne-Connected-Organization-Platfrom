import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlatformClient } from "@/features/platform/PlatformClient";

type Pillar = { title: string; description: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PlatformPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("PlatformPage");
  const pillars = t.raw("pillars") as Pillar[];

  return (
    <PlatformClient
      eyebrow={t("eyebrow")}
      heading={t("heading")}
      intro={t("intro")}
      pillars={pillars}
    />
  );
}

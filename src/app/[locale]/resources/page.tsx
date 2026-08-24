import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ResourcesClient } from "@/features/resources/ResourcesClient";

type ResourceItem = { title: string; description: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ResourcesPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("ResourcesPage");
  const items = t.raw("items") as ResourceItem[];

  return (
    <ResourcesClient
      eyebrow={t("eyebrow")}
      heading={t("heading")}
      intro={t("intro")}
      items={items}
    />
  );
}

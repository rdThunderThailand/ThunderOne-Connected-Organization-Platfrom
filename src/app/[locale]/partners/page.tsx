import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PartnersClient } from "@/features/partners/PartnersClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PartnersPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("PartnersPage");

  return (
    <PartnersClient
      eyebrow={t("eyebrow")}
      heading={t("heading")}
      intro={t("intro")}
      integratorsTitle={t("integratorsTitle")}
      integratorsBody={t("integratorsBody")}
      resellersTitle={t("resellersTitle")}
      resellersBody={t("resellersBody")}
      technologyTitle={t("technologyTitle")}
      technologyBody={t("technologyBody")}
    />
  );
}

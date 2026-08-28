import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { INTERESTED_SOLUTIONS, type InterestedSolution } from "@/features/crm/canonical";
import {
  RequestDemoClient,
  type RequestDemoCopy,
} from "@/features/request-demo/RequestDemoClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "RequestDemoPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function RequestDemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("RequestDemoPage");

  // Copy is passed as props (not useTranslations) — the NextIntlClientProvider
  // in layout.tsx only ships the Navbar/Common/TalkToUsPanel namespaces to
  // the client, matching the rest of the codebase (see AboutPage).
  const solutions = Object.fromEntries(
    INTERESTED_SOLUTIONS.map((slug) => [slug, t(`solutions.${slug}`)]),
  ) as Record<InterestedSolution, string>;

  const copy: RequestDemoCopy = {
    eyebrow: t("eyebrow"),
    heading: t("heading"),
    intro: t("intro"),
    pocNote: t("pocNote"),
    fields: {
      firstName: t("fields.firstName"),
      lastName: t("fields.lastName"),
      company: t("fields.company"),
      position: t("fields.position"),
      mobile: t("fields.mobile"),
      email: t("fields.email"),
      interest: t("fields.interest"),
      message: t("fields.message"),
    },
    messagePlaceholder: t("messagePlaceholder"),
    solutions,
    consentLabel: t("consentLabel"),
    confidentialNote: t("confidentialNote"),
    submit: t("submit"),
    submitting: t("submitting"),
    errors: {
      required: t("errors.required"),
      email: t("errors.email"),
      interest: t("errors.interest"),
      consent: t("errors.consent"),
    },
    successTitle: t("successTitle"),
    successBody: t("successBody"),
    successRef: t("successRef"),
    errorTitle: t("errorTitle"),
    errorBody: t("errorBody"),
  };

  return <RequestDemoClient copy={copy} />;
}

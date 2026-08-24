import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TalkToUsPanel } from "@/components/talk-to-us/TalkToUsPanel";
import { routing } from "@/i18n/routing";
import "../globals.css";
import { Prompt } from 'next/font/google'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'], // เลือกน้ำหนักที่ใช้จริง
  variable: '--font-prompt', // เผื่ออยากใช้กับ Tailwind
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Common" });

  return {
    title: t("brandName"),
    description: t("tagline"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Navbar and TalkToUsPanel are the only Client Components that need
  // translations in the browser — Footer and every page use
  // next-intl/server's getTranslations, which reads from the
  // request-scoped store, not from this client context. Scoping the
  // provider's messages keeps the rest of the dictionary out of the
  // client bundle.
  const messages = await getMessages();
  const clientMessages = {
    Navbar: messages.Navbar,
    Common: messages.Common,
    TalkToUsPanel: messages.TalkToUsPanel,
  };

  return (
    <html lang={locale} className={prompt.className}>
      <body className="flex min-h-screen flex-col bg-white text-slate-900 antialiased">
        <NextIntlClientProvider messages={clientMessages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <TalkToUsPanel />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  LiffTalkToUsClient,
  type LiffTalkToUsCopy,
} from "@/features/line/LiffTalkToUsClient";

// === /[locale]/liff/talk-to-us — LIFF Endpoint page (PoC, Step 0.12) ===
//
// Loaded INSIDE the LINE in-app browser via the LIFF URL
// (https://liff.line.me/<liffId>?lead_token=…), not a normal website page.
// Its only job: run the LINE identity link for a Talk-to-us lead and show
// the result. Brief: docs/CRM/LineOA/step-0.12 §5, §9.
//
// Must live under `[locale]` — this repo has no root `app/layout.tsx` and
// the i18n proxy (src/proxy.ts) rewrites every non-`/api` path to a locale
// prefix, so a page outside `[locale]` would 404. Register only
// `/th/liff/talk-to-us` with LINE; the `/en/...` build artifact is unused.
//
// The client `liff.init()` is gated on NEXT_PUBLIC_LIFF_ID — without it the
// page renders the `config-missing` state instead of throwing.

export const metadata: Metadata = {
  title: "เชื่อมบัญชี LINE | ThunderOne",
  // Not a public page — keep it out of search indexes.
  robots: { index: false, follow: false },
};

// PoC copy as literals so page.tsx stays a Server Component and the client
// receives strings as props (house rule — no useTranslations in the client).
// TH only for the PoC — this page is a ~2s transient screen inside the LINE
// in-app browser, not content.
//
// TODO (post-PoC) — localize without a second endpoint (LINE allows only one
// LIFF Endpoint URL anyway):
//   1. add a `LiffTalkToUs` namespace to src/i18n/messages.ts + messages/
//      {th,en}/*.json, resolve `copy` here via getTranslations(locale).
//   2. pick the locale from the LINE client, not the site: read
//      `liff.getLanguage()` in the client (or thread `?lang=` from the
//      wizard when it builds the LIFF URL) and select the string set.
//   3. keep the single route under `[locale]`; register just `/th/liff/
//      talk-to-us` with LINE — the `/en/...` build artifact stays unused.
const copy: LiffTalkToUsCopy = {
  heading: "เชื่อมบัญชี LINE กับคำขอของคุณ",
  initializing: "กำลังเชื่อมต่อกับ LINE…",
  loggingIn: "กำลังพาไปเข้าสู่ระบบ LINE…",
  linking: "กำลังยืนยันตัวตนและเชื่อมข้อมูล…",
  linkedTitle: "เชื่อมบัญชีสำเร็จ",
  linkedBody: "เราจะส่งสรุปคำขอของคุณไปที่ LINE นี้ กลับไปที่หน้าแชทได้เลย",
  errorTitle: "เชื่อมบัญชีไม่สำเร็จ",
  errorBody: "โปรดกลับไปหน้าเดิมแล้วลองกด “คุยผ่าน LINE” อีกครั้ง",
  missingToken: "ลิงก์ไม่สมบูรณ์ (ไม่พบ lead_token)",
  configMissing: "หน้านี้ยังไม่ได้ตั้งค่า LIFF (NEXT_PUBLIC_LIFF_ID)",
};

export default async function LiffTalkToUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // The client reads `lead_token` from window.location.search after
  // liff.init() (not useSearchParams) — no Suspense boundary needed.
  return <LiffTalkToUsClient copy={copy} />;
}

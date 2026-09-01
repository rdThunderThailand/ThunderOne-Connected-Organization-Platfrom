import type { Metadata } from "next";
import { Suspense } from "react";
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
// prefix, so a page outside `[locale]` would 404.
//
// PoC scope: real `liff.init()` stays dormant until NEXT_PUBLIC_LIFF_ID is
// set (Phase 4, after the LIFF app exists in the LINE console). Deploying
// this stub is what unblocks creating that app.

export const metadata: Metadata = {
  title: "เชื่อมบัญชี LINE | ThunderOne",
  // Not a public page — keep it out of search indexes.
  robots: { index: false, follow: false },
};

// PoC copy as literals so page.tsx stays a Server Component and the client
// receives strings as props (house rule — no useTranslations in the client).
// Move into an i18n namespace if this page graduates past PoC.
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

  // LiffTalkToUsClient reads `lead_token` via useSearchParams — wrap it so
  // the rest of the tree can still prerender (Next: use-search-params).
  return (
    <Suspense fallback={null}>
      <LiffTalkToUsClient copy={copy} />
    </Suspense>
  );
}

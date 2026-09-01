// === Thai display copy for the Talk-to-us → LINE summary ===
//
// Step 0.11 (docs/CRM/LineOA/lineOA 1sep.md §4, §5): the Message Builder
// turns internal slugs into a message the customer reads. That copy is
// sent to LINE regardless of the website locale, so it is NOT the display
// i18n in messages/{th,en}/talk-to-us.json and NOT the English CRM labels
// in src/components/talk-to-us/config/crmLabels.ts — it is its own thing,
// kept separate for the same reason those two are (marketing-copy edits
// must not shift what goes to the customer / CRM).
//
// TH only for round 1. If an EN variant is ever needed, add a parallel map
// and select on a `locale` arg — the builder already takes the maps by
// reference.
//
// Slugs are the dash-cased values the wizard already uses (grill decision
// Q4) — the §4 table's underscores are display reference, not the slugs.

/** `qualification.screen_count` → §4 Display Value. */
export const SCREEN_COUNT_LABELS_TH: Record<string, string> = {
  "1-5": "1–5 จอ",
  "6-20": "6–20 จอ",
  "21-50": "21–50 จอ",
  "50-plus": "50+ จอ",
};

/** `qualification.usage_type` → §4 Display Value. */
export const USAGE_TYPE_LABELS_TH: Record<string, string> = {
  "office-organization": "ภายในสำนักงาน / องค์กร",
  "multi-branch": "หลายสาขา / หลายพื้นที่",
  "public-government": "พื้นที่สาธารณะ / หน่วยงานรัฐ",
  "advertising-network": "Advertising Network",
};

/** `contact_preference.channel` → §4 Display Value. */
export const CHANNEL_LABELS_TH: Record<string, string> = {
  line: "LINE",
  callback: "ให้เราติดต่อกลับ",
};

/** Unknown slug → raw slug (loud but safe), mirroring crmLabels.ts. */
export function labelFor(map: Record<string, string>, slug: string): string {
  return map[slug] ?? slug;
}

/**
 * The summary body. `docs/CRM/LineOA/lineOA 1sep.md §5` gives this text
 * verbatim — reproduced as-is for the PoC, value lines filled by the
 * builder.
 *
 * TEMPORARY: fixed "ครับ" / 👋 / wording is straight from the brief. Revisit
 * with brand voice (gender-neutral phrasing) before this reaches real
 * customers.
 */
export function renderSummaryTemplate(fields: {
  firstName: string;
  solution: string;
  screenCount: string;
  usageType: string;
  channel: string;
}): string {
  return [
    `สวัสดีครับ คุณ ${fields.firstName} 👋`,
    "",
    "ขอบคุณที่สนใจ ThunderOne",
    "ทีมงานได้รับข้อมูลของคุณเรียบร้อยแล้วครับ",
    "",
    "ข้อมูลที่คุณระบุ",
    `หัวข้อ: ${fields.solution}`,
    `จำนวนจอ: ${fields.screenCount}`,
    `ลักษณะการใช้งาน: ${fields.usageType}`,
    `ช่องทางติดต่อ: ${fields.channel}`,
    "",
    "ทีมงานจะนำข้อมูลนี้ไปประกอบการแนะนำ Solution",
    "และสามารถสอบถามข้อมูลเพิ่มเติมผ่าน LINE นี้ได้เลยครับ",
  ].join("\n");
}

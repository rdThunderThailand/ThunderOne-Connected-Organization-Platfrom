// === Validation + normalization for the canonical lead payload ===
//
// Runs on the BACKEND before any CRM call (docs §6, §15: "Backend ต้อง
// validate required fields และ normalize email / mobile ก่อนเรียก CRM").
// The frontend does its own lightweight checks for UX only — this is the
// authoritative gate.

import { z } from "zod";
import {
  type CanonicalLeadPayload,
  INTERESTED_SOLUTIONS,
} from "./canonical";

/**
 * TEMPORARY (D-11): the required-field set is tentative. PM/Product must
 * confirm which fields are actually mandatory on the real form.
 */
const nonEmpty = z.string().trim().min(1);

/**
 * TEMPORARY (D-11): naive, TH-centric E.164 normalization. Replace with
 * `libphonenumber-js` before production — this only covers the common
 * "0812345678" → "+66812345678" case plus already-prefixed input.
 */
export function normalizeMobile(raw: string): string {
  const compact = raw.replace(/[\s\-().]/g, "");
  if (compact.startsWith("+")) return compact;
  if (compact.startsWith("0")) return `+66${compact.slice(1)}`;
  if (compact.startsWith("66")) return `+${compact}`;
  return `+${compact}`;
}

const nullableText = (max: number) =>
  z.string().trim().max(max).nullable().default(null);

export const canonicalLeadSchema = z.object({
  first_name: nonEmpty.max(100),
  last_name: nonEmpty.max(100),
  company_name: nonEmpty.max(200),
  position: nonEmpty.max(150),
  mobile: nonEmpty.max(30).transform(normalizeMobile),
  email: z.string().trim().toLowerCase().email().max(254),
  interested_solutions: z.array(z.enum(INTERESTED_SOLUTIONS)).min(1),
  inquiry_message: z.string().trim().max(2000).default(""),
  consent: z.object({
    status: z.enum(["granted", "denied"]),
    purpose: nonEmpty.max(100),
    source: nonEmpty.max(100),
    // Accepts "…Z" and "…+07:00". If this ever maps to a HubSpot
    // `datetime` property, normalize to UTC epoch millis in the mapper
    // (D-10) — not here.
    timestamp: z.string().datetime({ offset: true }),
  }),
  acquisition: z.object({
    source: nullableText(100),
    medium: nullableText(100),
    campaign: nullableText(200),
    utm_source: nullableText(200),
    utm_medium: nullableText(200),
    utm_campaign: nullableText(200),
    landing_page: nullableText(500),
  }),
});

export type CanonicalLeadInput = z.input<typeof canonicalLeadSchema>;

export type ParseResult =
  | { ok: true; data: CanonicalLeadPayload }
  | { ok: false; issues: { path: string; message: string }[] };

export function parseCanonicalLead(input: unknown): ParseResult {
  const result = canonicalLeadSchema.safeParse(input);
  if (result.success) {
    // Structurally identical to the hand-written contract in canonical.ts;
    // the cast just drops zod's brand.
    return { ok: true, data: result.data as CanonicalLeadPayload };
  }
  return {
    ok: false,
    issues: result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  };
}

// === Stateless lead_token — signed + short-lived (Step 0.12 §8) ===
//
// Links the "get a token" call (POST /api/line/lead-token, fired by the
// website button) to the "use the token" call (POST /api/line/link-lead,
// fired by the LIFF page). On Vercel each route handler is its OWN
// serverless function, so a module-level Map written by one is invisible to
// the other. Rather than stand up shared storage for a PoC, the token
// itself carries the data, HMAC-signed with LINE_LEAD_TOKEN_SECRET so it
// cannot be forged, with a 15-minute expiry (§8: "หมดอายุ เช่น 10-30 นาที").
//
// Wire format:  base64url(JSON payload) + "." + base64url(HMAC-SHA256)
//
// The payload holds only what the post-link summary push needs — the
// LineLeadSummaryInput (first name, solution slug, the two DS qualification
// slugs, channel) plus lead_id + exp. NEVER email / mobile (§8: "ห้ามใส่
// email / mobile / customer data ตรง ๆ ใน URL"; §12).
//
// ⚠️ TEMPORARY: a stateless token cannot be marked "used" across serverless
// instances, so it is replayable until it expires. /api/line/link-lead
// keeps a best-effort per-instance guard; true one-time use (§8, TC-06)
// needs shared storage (Vercel KV) — deferred (§15).

import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import {
  lineLeadSummaryInputSchema,
  type LineLeadSummaryInput,
} from "./buildLeadSummary";

const TTL_SECONDS = 15 * 60;

function secret(): string {
  const value = process.env.LINE_LEAD_TOKEN_SECRET?.trim();
  if (!value) throw new Error("LINE_LEAD_TOKEN_SECRET is not set");
  return value;
}

const leadTokenPayloadSchema = z.object({
  lead_id: z.string().min(1),
  summary: lineLeadSummaryInputSchema,
  exp: z.number().int().positive(),
});

export type LeadTokenPayload = z.infer<typeof leadTokenPayloadSchema>;

function sign(body: string): string {
  return createHmac("sha256", secret()).update(body).digest("base64url");
}

export type IssuedLeadToken = {
  leadId: string;
  token: string;
  expiresInSeconds: number;
};

/**
 * Mint a signed token for a fresh lead. `leadId` is a PoC display id — a
 * real system would pass the persisted lead's primary key (§7).
 */
export function issueLeadToken(summary: LineLeadSummaryInput): IssuedLeadToken {
  const leadId = `LEAD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const payload: LeadTokenPayload = {
    lead_id: leadId,
    summary,
    exp: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return {
    leadId,
    token: `${body}.${sign(body)}`,
    expiresInSeconds: TTL_SECONDS,
  };
}

export type ReadLeadTokenResult =
  | { ok: true; payload: LeadTokenPayload }
  | {
      ok: false;
      error: "malformed" | "bad_signature" | "invalid_payload" | "expired";
    };

/** Verify signature + expiry and return the decoded payload. */
export function readLeadToken(token: string): ReadLeadTokenResult {
  const dot = token.lastIndexOf(".");
  if (dot <= 0 || dot === token.length - 1) return { ok: false, error: "malformed" };

  const body = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);
  const expectedSig = sign(body);

  const a = Buffer.from(providedSig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, error: "bad_signature" };
  }

  let json: unknown;
  try {
    json = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return { ok: false, error: "malformed" };
  }

  const parsed = leadTokenPayloadSchema.safeParse(json);
  if (!parsed.success) return { ok: false, error: "invalid_payload" };
  if (parsed.data.exp * 1000 <= Date.now()) return { ok: false, error: "expired" };

  return { ok: true, payload: parsed.data };
}

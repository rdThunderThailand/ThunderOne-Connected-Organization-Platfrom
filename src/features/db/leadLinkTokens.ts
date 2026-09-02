// === `line_user.lead_link_tokens` — opaque one-time link tokens (Step 0.12.6) ===
//
// Decision 2a: the token handed to the browser is an opaque random string
// (`tkn_<64 hex>`). Only its sha256 is stored, so a database leak does not
// expose usable tokens. All state — expiry, one-time use, the summary DTO
// to send on redeem — lives in the row, not in the token (no HMAC secret).
//
// Flow:
//   POST /api/line/lead-token  -> issueLinkToken()   (writes the row)
//   POST /api/line/link-lead   -> peekLinkToken()    (validate, read lead + summary)
//                              -> consumeLinkToken() (burn it — the actual gate)
//
// Server-only — goes through the service-role client (./client.ts). Node
// runtime: uses `node:crypto`.

import { createHash, randomBytes } from "node:crypto";
import type { LineLeadSummaryInput } from "@/features/line/buildLeadSummary";
import { getSupabaseAdmin } from "./client";

const TTL_SECONDS = 15 * 60; // brief §4.2: "หมดอายุ เช่น 10-30 นาที"
const TOKEN_BYTES = 32;

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

export type IssuedLinkToken = { token: string; expiresInSeconds: number };

/** Mint an opaque single-use token bound to a persisted lead. */
export async function issueLinkToken(
  leadId: string,
  lineSummary: LineLeadSummaryInput,
): Promise<IssuedLinkToken> {
  const token = `tkn_${randomBytes(TOKEN_BYTES).toString("hex")}`;
  const expiresAt = new Date(Date.now() + TTL_SECONDS * 1000).toISOString();

  const { error } = await getSupabaseAdmin()
    .from("lead_link_tokens")
    .insert({
      token_hash: hashToken(token),
      lead_id: leadId,
      line_summary: lineSummary,
      expires_at: expiresAt,
    });
  if (error) throw new Error(`issueLinkToken: ${error.message}`);

  return { token, expiresInSeconds: TTL_SECONDS };
}

export type PeekLinkTokenResult =
  | { ok: true; leadId: string; lineSummary: LineLeadSummaryInput }
  | { ok: false; reason: "not_found" | "consumed" | "expired" };

/** Look the token up without burning it — used to validate before the id_token check. */
export async function peekLinkToken(rawToken: string): Promise<PeekLinkTokenResult> {
  const { data, error } = await getSupabaseAdmin()
    .from("lead_link_tokens")
    .select("lead_id, line_summary, expires_at, consumed_at")
    .eq("token_hash", hashToken(rawToken))
    .maybeSingle();
  if (error) throw new Error(`peekLinkToken: ${error.message}`);
  if (!data) return { ok: false, reason: "not_found" };

  const row = data as {
    lead_id: string;
    line_summary: LineLeadSummaryInput;
    expires_at: string;
    consumed_at: string | null;
  };
  if (row.consumed_at) return { ok: false, reason: "consumed" };
  if (Date.parse(row.expires_at) <= Date.now()) return { ok: false, reason: "expired" };
  return { ok: true, leadId: row.lead_id, lineSummary: row.line_summary };
}

export type ConsumeLinkTokenResult =
  | { ok: true }
  | { ok: false; reason: "not_found_or_used_or_expired" };

/**
 * Burn the token with a single conditional UPDATE. Concurrent callers race
 * here — only the first flips `consumed_at`; the rest get 0 rows and are
 * rejected as reuse (brief §6, TC-09).
 */
export async function consumeLinkToken(
  rawToken: string,
): Promise<ConsumeLinkTokenResult> {
  const nowIso = new Date().toISOString();
  const { data, error } = await getSupabaseAdmin()
    .from("lead_link_tokens")
    .update({ consumed_at: nowIso })
    .eq("token_hash", hashToken(rawToken))
    .is("consumed_at", null)
    .gt("expires_at", nowIso)
    .select("token_hash")
    .maybeSingle();
  if (error) throw new Error(`consumeLinkToken: ${error.message}`);
  return data ? { ok: true } : { ok: false, reason: "not_found_or_used_or_expired" };
}

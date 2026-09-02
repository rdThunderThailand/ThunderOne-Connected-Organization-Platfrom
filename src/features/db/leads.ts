// === `line_user.leads` — persisted Talk-to-us submissions (Step 0.12.6) ===
//
// One row per submission (brief §4.1). Created by POST /api/crm/lead
// (leads-first: the row exists even if the CRM upsert later fails), then
// bound to a verified LINE user by POST /api/line/link-lead.
//
// Server-only — goes through the service-role client (./client.ts).

import type { CanonicalLeadPayload } from "@/features/crm";
import { getSupabaseAdmin } from "./client";

export type LeadIdentityStatus = "unlinked" | "linked";

export type LeadRow = {
  id: string;
  canonical: CanonicalLeadPayload;
  crm_contact_id: string | null;
  line_user_id: string | null;
  line_identity_status: LeadIdentityStatus;
  linked_at: string | null;
  summary_delivered_at: string | null;
  created_at: string;
};

/** Insert one lead row for a fresh submission. Returns the new id (brief §4.1). */
export async function createLead(canonical: CanonicalLeadPayload): Promise<string> {
  const { data, error } = await getSupabaseAdmin()
    .from("leads")
    .insert({ canonical })
    .select("id")
    .single();
  if (error) throw new Error(`createLead: ${error.message}`);
  return (data as { id: string }).id;
}

/** Attach the CRM contact id once the (best-effort) upsert has succeeded. */
export async function setLeadCrmContactId(
  leadId: string,
  crmContactId: string,
): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("leads")
    .update({ crm_contact_id: crmContactId })
    .eq("id", leadId);
  if (error) throw new Error(`setLeadCrmContactId: ${error.message}`);
}

export type LinkLeadResult =
  | { ok: true; alreadyLinked: boolean }
  | { ok: false; reason: "lead_not_found" | "linked_to_other_user" };

/**
 * Bind a lead to a verified LINE user (decision 3a).
 *
 * - lead already linked to the SAME user -> idempotent success
 * - lead linked to a DIFFERENT user      -> refused, never overwritten (brief §4.6)
 *
 * The final UPDATE is guarded by `line_user_id is null`, so a race with a
 * concurrent linker is resolved by the database, not by the read above.
 */
export async function linkLeadToLineUser(
  leadId: string,
  lineUserId: string,
): Promise<LinkLeadResult> {
  const db = getSupabaseAdmin();

  const { data: existing, error: readErr } = await db
    .from("leads")
    .select("line_user_id")
    .eq("id", leadId)
    .maybeSingle();
  if (readErr) throw new Error(`linkLeadToLineUser read: ${readErr.message}`);
  if (!existing) return { ok: false, reason: "lead_not_found" };

  const current = (existing as { line_user_id: string | null }).line_user_id;
  if (current === lineUserId) return { ok: true, alreadyLinked: true };
  if (current !== null) return { ok: false, reason: "linked_to_other_user" };

  const { data: updated, error } = await db
    .from("leads")
    .update({
      line_user_id: lineUserId,
      line_identity_status: "linked",
      linked_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .is("line_user_id", null)
    .select("id")
    .maybeSingle();
  if (error) throw new Error(`linkLeadToLineUser update: ${error.message}`);
  if (!updated) return { ok: false, reason: "linked_to_other_user" }; // lost the race

  return { ok: true, alreadyLinked: false };
}

/** Record that the Step 0.11 summary reached the user (decision 5a). */
export async function markSummaryDelivered(leadId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("leads")
    .update({ summary_delivered_at: new Date().toISOString() })
    .eq("id", leadId);
  if (error) throw new Error(`markSummaryDelivered: ${error.message}`);
}

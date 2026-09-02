// === src/features/db — Supabase persistence (server-only) ===
//
// The Website lead <-> LINE identity store for Step 0.12.6. Postgres schema
// `line_user` (supabase/schema.sql). Everything here talks to Supabase with
// the service-role key and must never be imported into client code.
//
// Consumed by: src/app/api/crm/lead/route.ts,
//              src/app/api/line/lead-token/route.ts,
//              src/app/api/line/link-lead/route.ts

export { getSupabaseAdmin, isSupabaseConfigured } from "./client";
export {
  createLead,
  setLeadCrmContactId,
  linkLeadToLineUser,
  markSummaryDelivered,
  type LeadRow,
  type LeadIdentityStatus,
  type LinkLeadResult,
} from "./leads";
export {
  issueLinkToken,
  peekLinkToken,
  consumeLinkToken,
  type IssuedLinkToken,
  type PeekLinkTokenResult,
  type ConsumeLinkTokenResult,
} from "./leadLinkTokens";

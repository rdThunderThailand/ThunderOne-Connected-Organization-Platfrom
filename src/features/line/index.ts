// === src/features/line — LINE Messaging API (PoC) ===
//
// Backend-only surface for the LINE Official Account.
//
// - Inbound webhook (round 1): receive `follow` + `message:text`, verify
//   the signature, log the LINE userId + message text.
//   Brief: docs/CRM/LineOA/lineOA 31aug.md
// - Talk-to-us → LINE summary (Step 0.11): `buildLineLeadSummary()` turns a
//   lead into the §5 Thai text. Reused by the identity-link push below.
//   Brief: docs/CRM/LineOA/lineOA 1sep.md
// - Website lead ↔ LINE identity linking (Step 0.12.6): an opaque, one-time
//   lead_token (persisted — src/features/db) carries the lead from the
//   website button to the LIFF page, which posts it back with a verified
//   LINE ID token so the summary can be pushed to the real user — no
//   hardcoded userId. `verifyLineIdToken()` is this feature's half of that.
//   Brief: docs/CRM/LineOA/Step_0_12_5_to_0_12_6_Dev_Brief.md
//
// Consumed by: src/app/api/line/webhook/route.ts,
//              src/app/api/line/lead-token/route.ts,
//              src/app/api/line/link-lead/route.ts

export { verifyLineSignature } from "./verifySignature";
export { parseLineWebhookEvents, type LineEventSummary } from "./events";
export { logLineEvent } from "./log";
export {
  pushLineMessages,
  replyLineMessages,
  type LineMessage,
  type LineSendResult,
} from "./send";
export {
  buildLineLeadSummary,
  lineLeadSummaryInputSchema,
  type LineLeadSummaryInput,
} from "./buildLeadSummary";
export { verifyLineIdToken } from "./verifyLineIdToken";

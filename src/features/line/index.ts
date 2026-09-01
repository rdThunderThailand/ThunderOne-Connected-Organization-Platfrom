// === src/features/line — LINE Messaging API (PoC) ===
//
// Backend-only surface for the LINE Official Account.
//
// - Inbound webhook (round 1): receive `follow` + `message:text`, verify
//   the signature, log the LINE userId + message text.
//   Brief: docs/CRM/LineOA/lineOA 31aug.md
// - Talk-to-us → LINE summary (Step 0.11): build a Thai summary from a
//   lead and push it to a (hardcoded) test userId.
//   Brief: docs/CRM/LineOA/lineOA 1sep.md
// - Website lead ↔ LINE identity linking (Step 0.12): a signed lead_token
//   carries the summary from the website button to the LIFF page, which
//   posts it back with a verified LINE ID token so the summary can be
//   pushed to the real user — no hardcoded userId.
//   Brief: docs/CRM/LineOA/step-0.12
//
// Consumed by: src/app/api/line/webhook/route.ts,
//              src/app/api/line/lead-summary/route.ts,
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
export {
  issueLeadToken,
  readLeadToken,
  type LeadTokenPayload,
} from "./leadToken";
export { verifyLineIdToken } from "./verifyLineIdToken";

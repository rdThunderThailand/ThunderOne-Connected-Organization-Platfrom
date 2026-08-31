// === src/features/line — LINE Messaging API webhook (PoC) ===
//
// Backend-only entry point for LINE Official Account events. Round-1
// scope: receive `follow` + `message:text`, verify the signature, log the
// LINE userId + message text — nothing else.
//
// Brief    : docs/CRM/LineOA/lineOA.md
// Consumed by: src/app/api/line/webhook/route.ts

export { verifyLineSignature } from "./verifySignature";
export { parseLineWebhookEvents, type LineEventSummary } from "./events";
export { logLineEvent } from "./log";

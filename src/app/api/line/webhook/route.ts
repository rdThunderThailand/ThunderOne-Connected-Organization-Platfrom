// === POST /api/line/webhook — LINE Messaging API webhook (PoC) ===
//
// LINE's servers call this endpoint on every OA event (Add Friend, user
// message, …). It is NOT a URL a customer opens — the "คุยผ่าน LINE"
// button goes to the OA / LIFF in a later step
// (docs/CRM/LineOA/lineOA 31aug.md §5).
//
// Round-1 job (§3, §9): verify `x-line-signature`, read the event type +
// LINE userId + message text, log them, return HTTP 200. No HubSpot, no
// lead creation.
//
// Auto-reply is deferred by §10, so it is OFF by default and gated behind
// the LINE_ECHO_REPLY env flag — set `LINE_ECHO_REPLY=1` to echo inbound
// text back through the Messaging API (for testing outbound send).
//
// Not under `[locale]` on purpose — the i18n proxy matcher excludes
// `/api` (src/proxy.ts). POST route handlers are not cached.
//
// TEMPORARY (PoC): no rate-limit / replay-id handling. Secrets
// (LINE_CHANNEL_SECRET, LINE_CHANNEL_ACCESS_TOKEN) are read from the
// server env only — never expose them to the client (§6).

import {
  logLineEvent,
  parseLineWebhookEvents,
  replyLineMessages,
  verifyLineSignature,
} from "@/features/line";

// Signature verification uses `node:crypto` — pin the Node.js runtime so
// this never gets silently moved to the Edge runtime.
export const runtime = "nodejs";

export async function POST(request: Request) {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!channelSecret) {
    console.error("[line:webhook] LINE_CHANNEL_SECRET is not set");
    return Response.json(
      { ok: false, error: "server_misconfigured" },
      { status: 500 },
    );
  }

  // Raw body first — the signature is computed over these exact bytes, so
  // it must be read before any JSON parsing (§3).
  const rawBody = await request.text();
  const signature = request.headers.get("x-line-signature");

  if (!verifyLineSignature(rawBody, signature, channelSecret)) {
    console.warn("[line:webhook] rejected — invalid signature");
    return Response.json(
      { ok: false, error: "invalid_signature" },
      { status: 401 },
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // The "Verify" button in the LINE console sends a signed request with an
  // empty `events` array — that must still return 200.
  const events = parseLineWebhookEvents(payload);
  for (const event of events) {
    logLineEvent(event);
  }

  // Opt-in echo reply (deferred by §10). Awaited before the response —
  // returning first would let the serverless function freeze mid-request
  // and drop the outbound call.
  if (process.env.LINE_ECHO_REPLY === "1") {
    for (const event of events) {
      if (event.kind !== "message:text" || !event.replyToken) continue;
      const result = await replyLineMessages(event.replyToken, [
        { type: "text", text: `received: ${event.text}` },
      ]);
      if (!result.ok) {
        console.error(
          `[line:webhook] reply failed — ${result.status} ${result.detail}`,
        );
      }
    }
  }

  return Response.json({ ok: true, handled: events.length });
}

// Convenience health check — handy when pointing the LINE console at a
// fresh deployment. Returns 200 with no LINE data.
export async function GET() {
  return Response.json({ ok: true, service: "line-webhook" });
}


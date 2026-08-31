// === POST /api/line/webhook — LINE Messaging API webhook (PoC) ===
//
// LINE's servers call this endpoint on every OA event (Add Friend, user
// message, …). It is NOT a URL a customer opens — the "คุยผ่าน LINE"
// button goes to the OA / LIFF in a later step
// (docs/CRM/LineOA/lineOA.md §5).
//
// Round-1 job (§3, §9): verify `x-line-signature`, read the event type +
// LINE userId + message text, log them, return HTTP 200. No HubSpot, no
// lead creation, no auto-reply yet (§10).
//
// Not under `[locale]` on purpose — the i18n proxy matcher excludes
// `/api` (src/proxy.ts). POST route handlers are not cached.
//
// TEMPORARY (PoC): no rate-limit / replay-id handling. The only secret in
// play is LINE_CHANNEL_SECRET, read from the server env — never expose it
// (or the access token) to the client (§6).

import {
  logLineEvent,
  parseLineWebhookEvents,
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

  return Response.json({ ok: true, handled: events.length });
}

// Convenience health check — handy when pointing the LINE console at a
// fresh deployment. Returns 200 with no LINE data.
export async function GET() {
  return Response.json({ ok: true, service: "line-webhook" });
}

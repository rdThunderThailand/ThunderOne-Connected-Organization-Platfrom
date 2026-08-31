# `src/features/line` — LINE Messaging API webhook (PoC)

Backend-only entry point for LINE Official Account events.

- Brief: [`docs/CRM/LineOA/lineOA.md`](../../../docs/CRM/LineOA/lineOA.md)

## Scope — round 1 (§3, §9)

Receive LINE webhook events and prove the backend can identify the sender:

- verify `x-line-signature` (HMAC-SHA256 of the raw body, keyed by the channel secret)
- handle `follow` and `message:text`
- log event type + LINE userId + message text + timestamp
- return HTTP 200

**Out of scope (§10):** HubSpot, lead creation, LIFF / website identity
linking, Talk-to-us summary → LINE, auto-reply / bot logic.

## Flow

```
LINE Platform
  └─ POST /api/line/webhook          raw body + x-line-signature
       ├─ verifyLineSignature        → 401 if it fails
       ├─ JSON.parse(rawBody)        → 400 if it fails
       ├─ parseLineWebhookEvents     lenient reader → LineEventSummary[]
       └─ logLineEvent (per event)   console audit line
            └─ return 200 { ok: true, handled: n }
```

## Files

| File | Role |
|---|---|
| `verifySignature.ts` | HMAC-SHA256 check of `x-line-signature` against the raw request body. |
| `events.ts` | Lenient zod reader: LINE payload → `LineEventSummary[]` (`follow` / `message:text` / `unhandled`). |
| `log.ts` | The PoC audit-line format. |
| `index.ts` | Public surface. |
| `../../app/api/line/webhook/route.ts` | The route handler that wires the three together. |

## Env (§6)

`.env` is gitignored — set these locally **and** in Vercel → Project
Settings → Environment Variables.

| Var | Where | Used in round 1? |
|---|---|---|
| `LINE_CHANNEL_SECRET` | LINE console → Basic settings | yes — signature check |
| `LINE_CHANNEL_ID` | LINE console → Basic settings | no (recorded for the next step) |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE console → Messaging API | no (outbound replies, next step) |

## Try it locally

```bash
pnpm dev

# health check (no signature needed):
curl -sS localhost:3000/api/line/webhook
# → { "ok": true, "service": "line-webhook" }

# simulate a signed LINE "message:text" event:
SECRET='<your LINE_CHANNEL_SECRET>'
BODY='{"destination":"U0000000000000000000000000000000","events":[{"type":"message","mode":"active","timestamp":1700000000000,"source":{"type":"user","userId":"U1111111111111111111111111111111"},"message":{"type":"text","id":"1","text":"test"}}]}'
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -binary | base64)
curl -sS localhost:3000/api/line/webhook \
  -H "x-line-signature: $SIG" -H 'content-type: application/json' -d "$BODY"
# → { "ok": true, "handled": 1 }
# server log: [line:webhook] message:text userId=U1111… ts=1700000000000 text="test"

# wrong / missing signature → 401
curl -sS -o /dev/null -w '%{http_code}\n' localhost:3000/api/line/webhook \
  -H 'x-line-signature: nope' -d "$BODY"
# → 401
```

## First test case (§8) — with PM

1. Deploy to Vercel, set the three env vars in Project Settings.
2. Give the PM `https://<project>.vercel.app/api/line/webhook`.
3. PM pastes it into LINE Developers Console → **Verify** → Enable Webhook.
4. PM sends `test` from a personal LINE to the Thunder One OA.
5. Check Vercel → Deployment → Functions logs for
   `[line:webhook] message:text userId=… text="test"`.

## ⚠️ TEMPORARY

| Where | What's temporary | Resolve |
|---|---|---|
| `route.ts` / `log.ts` | `console` audit log; raw message text logged verbatim | structured audit log + drop/hash text before real conversations (§15) |
| `route.ts` | no rate-limit; no replay handling (`webhookEventId`, `deliveryContext.isRedelivery`) | before production |
| `events.ts` | only `follow` + `message:text` mapped; everything else → `unhandled` | add event types as later steps need them |
| — | no reply, no persistence, no CRM | next steps (§11): link Website Talk-to-us ↔ LINE identity |

# `src/features/line` — LINE Messaging API (PoC)

Backend-only surface for the LINE Official Account.

- Round-1 webhook brief: [`docs/CRM/LineOA/lineOA 31aug.md`](../../../docs/CRM/LineOA/lineOA%2031aug.md)
- Step 0.11 (Talk-to-us → LINE summary) brief: [`docs/CRM/LineOA/lineOA 1sep.md`](../../../docs/CRM/LineOA/lineOA%201sep.md)
- Step 0.12 (Website lead ↔ LINE identity linking) brief: [`docs/CRM/LineOA/step-0.12`](../../../docs/CRM/LineOA/step-0.12)

## Scope — round 1 webhook (31aug §3, §9)

Receive LINE webhook events and prove the backend can identify the sender:

- verify `x-line-signature` (HMAC-SHA256 of the raw body, keyed by the channel secret)
- handle `follow` and `message:text`
- log event type + LINE userId + message text + timestamp
- return HTTP 200

**Out of scope (31aug §10):** HubSpot, lead creation, LIFF / website
identity linking, auto-reply / bot logic.

## Scope — Step 0.11: Talk-to-us → LINE summary (1sep §2)

Build a Thai summary of a Digital Signage lead and push it to LINE:

- `buildLineLeadSummary(input)` — internal slugs → the §5 customer text
- `POST /api/line/lead-summary` — validate → build → `pushLineMessages`
- recipient is a single hardcoded `LINE_TEST_USER_ID` (no Lead ↔ LINE
  identity link yet — that is Step 0.12)
- the website wizard calls it fire-and-forget after "คุยผ่าน LINE", for
  the Digital Signage topic only

**Out of scope (1sep §11):** real Lead ↔ LINE userId linking, LIFF,
HubSpot, consent gate, Flex/Rich messages, non-DS topics.

## Scope — Step 0.12: Website lead ↔ LINE identity linking (step-0.12)

Drop the hardcoded `LINE_TEST_USER_ID`: resolve the real LINE userId for a
just-submitted lead and push the Step 0.11 summary there.

- `POST /api/line/lead-token` — wizard button → mint a signed, 15-min
  `lead_token` carrying the summary DTO + a throwaway `lead_id` (`leadToken.ts`)
- LIFF page `/[locale]/liff/talk-to-us` (`LiffTalkToUsClient.tsx`) — `liff.init()`
  → LINE Login → `liff.getIDToken()` → `POST /api/line/link-lead`
- `POST /api/line/link-lead` — verify the `lead_token` signature/expiry,
  verify the ID token against LINE (`verifyLineIdToken.ts`), push the summary
  to the resolved `sub`, return `{ lead_id, line_user_id, line_identity_status }`

Token storage is **stateless** (the signed token IS the state) — chosen over
Vercel KV for the PoC. Trade-off: one-time use (§8, TC-06) is best-effort
per serverless instance only.

**Out of scope (step-0.12 §15):** HubSpot mapping, Company/Deal, Customer
360, real account linking, consent re-check, shared token storage.

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
| `send.ts` | Outbound Messaging API calls: `pushLineMessages(to, …)` / `replyLineMessages(replyToken, …)`. |
| `summaryLabels.ts` | Step 0.11: TH display copy — slug → label maps + the §5 message template. |
| `buildLeadSummary.ts` | Step 0.11: `LineLeadSummaryInput` (zod) + `buildLineLeadSummary()` (pure). |
| `leadToken.ts` | Step 0.12: `issueLeadToken()` / `readLeadToken()` — HMAC-signed, self-contained, 15-min `lead_token`. |
| `verifyLineIdToken.ts` | Step 0.12: `verifyLineIdToken()` — POST the LIFF ID token to LINE, return the verified `sub` (LINE userId). |
| `LiffTalkToUsClient.tsx` | Step 0.12: `"use client"` UI for the LIFF Endpoint page (init → login → getIDToken → link). |
| `index.ts` | Public surface. |
| `../../app/api/line/webhook/route.ts` | Inbound webhook route handler. |
| `../../app/api/line/lead-summary/route.ts` | Step 0.11: build + push the lead summary. |
| `../../app/api/line/lead-token/route.ts` | Step 0.12: mint a `lead_token` from the summary DTO. |
| `../../app/api/line/link-lead/route.ts` | Step 0.12: verify token + ID token, link, push summary. |
| `../../app/[locale]/liff/talk-to-us/page.tsx` | Step 0.12: LIFF Endpoint page (thin server wrapper). |

## Env

`.env` is gitignored — set these locally **and** in Vercel → Project
Settings → Environment Variables.

| Var | Where | Used for |
|---|---|---|
| `LINE_CHANNEL_SECRET` | LINE console → Basic settings | inbound — `x-line-signature` check |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE console → Messaging API | outbound — `push` / `reply` (`send.ts`) |
| `LINE_CHANNEL_ID` | LINE console → Basic settings | recorded for the identity-linking step |
| `LINE_TEST_USER_ID` | a webhook log line (test user's `source.userId`) | Step 0.11 — the single hardcoded recipient for `/api/line/lead-summary`. Missing → the route 500s. |
| `LINE_ECHO_REPLY` | — | set to `1` to make the webhook echo inbound text back (test outbound send). Off by default. |
| `NEXT_PUBLIC_LIFF_ID` | LINE console → LINE Login channel → LIFF | Step 0.12 — **public**, inlined at build. The LIFF page + the `liff.line.me/<id>` URL the wizard opens. |
| `LINE_LOGIN_CHANNEL_ID` | LINE console → LINE Login channel → Basic settings | Step 0.12 — `client_id` for verifying the LIFF ID token (`verifyLineIdToken.ts`). Different channel from `LINE_CHANNEL_ID`. |
| `LINE_LEAD_TOKEN_SECRET` | any 32-byte random hex | Step 0.12 — HMAC key for the `lead_token` (`leadToken.ts`). Missing → `/api/line/lead-token` + `/api/line/link-lead` 500. |

## Outbound messages

```ts
import { pushLineMessages, replyLineMessages } from "@/features/line";

// push to a known userId (from a stored webhook event's source.userId)
await pushLineMessages("U1111…", [
  { type: "text", text: "ทดสอบส่งข้อความจาก Thunder Backend สำเร็จ" },
]);

// reply to an inbound event (event.replyToken, ~1 min TTL, free)
await replyLineMessages(replyToken, [{ type: "text", text: "received" }]);
```

Both return `{ ok: true }` or `{ ok: false, status, detail }` — they do
not throw on an API error, only on a missing `LINE_CHANNEL_ACCESS_TOKEN`.

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

### Step 0.11 — lead summary

```bash
# needs LINE_TEST_USER_ID + LINE_CHANNEL_ACCESS_TOKEN set in .env
curl -sS localhost:3000/api/line/lead-summary \
  -H 'content-type: application/json' -d '{
    "first_name": "Somchai",
    "interested_solution": "Digital Signage & Media",
    "qualification": { "screen_count": "21-50", "usage_type": "multi-branch" },
    "contact_preference": { "channel": "line" }
  }'
# → { "ok": true, "preview": "สวัสดีครับ คุณ Somchai 👋\n…" }  + the test user's LINE buzzes

# bad body → 422 { ok:false, error:"validation_failed", issues:[…] }
# LINE_TEST_USER_ID unset → 500 { ok:false, error:"server_misconfigured" }
# LINE API rejects → 502 { ok:false, error:"line_push_failed", detail }
```

### Step 0.12 — lead-token + link-lead

```bash
# needs LINE_LEAD_TOKEN_SECRET + LINE_LOGIN_CHANNEL_ID + LINE_CHANNEL_ACCESS_TOKEN

# 1. mint a lead_token (same DTO shape as lead-summary):
curl -sS localhost:3000/api/line/lead-token \
  -H 'content-type: application/json' -d '{
    "first_name": "Somchai",
    "interested_solution": "Digital Signage & Media",
    "qualification": { "screen_count": "21-50", "usage_type": "multi-branch" },
    "contact_preference": { "channel": "line" }
  }'
# → { "ok": true, "lead_id": "LEAD-XXXXXXXX", "lead_token": "<b64>.<sig>", "expires_in": 900 }

# 2. link (id_token comes from liff.getIDToken() in a real LINE client):
curl -sS localhost:3000/api/line/link-lead \
  -H 'content-type: application/json' \
  -d '{ "lead_token": "<from step 1>", "id_token": "<real LINE ID token>" }'
# happy path → { ok:true, lead_id, line_user_id:"U…", line_identity_status:"linked" } + LINE buzzes
# tampered token       → 401 { ok:false, error:"invalid_lead_token", reason:"bad_signature" }
# expired token        → 401 { ok:false, error:"invalid_lead_token", reason:"expired" }
# bad / stale id_token → 401 { ok:false, error:"line_identity_unverified" }
# replayed token       → 409 { ok:false, error:"lead_token_used" }   (same instance only)
# push fails           → 502 { ok:false, error:"line_push_failed", detail }
```

The full happy path can only be exercised from inside the LINE in-app
browser (a real `id_token`) — see the Step 0.12 test cases in the brief.

## First webhook test case (31aug §8) — with PM

1. Deploy to Vercel, set the three env vars in Project Settings.
2. Give the PM `https://<project>.vercel.app/api/line/webhook`.
3. PM pastes it into LINE Developers Console → **Verify** → Enable Webhook.
4. PM sends `test` from a personal LINE to the Thunder One OA.
5. Check Vercel → Deployment → Functions logs for
   `[line:webhook] message:text userId=… text="test"`.

## ⚠️ TEMPORARY

| Where | What's temporary | Resolve |
|---|---|---|
| `webhook/route.ts` / `log.ts` | `console` audit log; raw message text logged verbatim | structured audit log + drop/hash text before real conversations |
| `webhook/route.ts` | no rate-limit; no replay handling (`webhookEventId`, `deliveryContext.isRedelivery`) | before production |
| `events.ts` | only `follow` + `message:text` mapped; everything else → `unhandled` | add event types as later steps need them |
| `webhook/route.ts` | `LINE_ECHO_REPLY` echo is a raw test hook, not real bot logic | replace with intent-driven replies later |
| `send.ts` | awaits the outbound call inside the request | move to a queue if latency ever matters |
| `lead-summary/route.ts` | one hardcoded `LINE_TEST_USER_ID`; no consent re-check | superseded by `link-lead` for the wizard flow; keep for standalone curl testing |
| `summaryLabels.ts` | fixed "ครับ" / 👋 wording straight from 1sep §5; TH only | brand-voice pass (gender-neutral); add EN if needed |
| `leadToken.ts` / `link-lead/route.ts` | stateless token — one-time use is best-effort per instance | move token state to Vercel KV; add a real `identity` table + queued push |
| `link-lead/route.ts` | no consent re-check before pushing to a real user | PDPA consent gate before any real-customer push |
| `LiffTalkToUsClient.tsx` | inherits the site Navbar/Footer chrome from `[locale]/layout.tsx` | route group / conditional chrome for `/liff/*` |
| `liff/talk-to-us/page.tsx` | copy is hardcoded TH literals | post-PoC: `LiffTalkToUs` i18n namespace + pick locale from `liff.getLanguage()` (or `?lang=`), keep one route/endpoint — see the TODO in `page.tsx` |
| — | no persistence, no CRM | Step 0.12+: persist the lead, sync `line_user_id` into the CRM |

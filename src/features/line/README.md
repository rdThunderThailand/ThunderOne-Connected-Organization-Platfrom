# `src/features/line` — LINE Messaging API (PoC)

Backend-only surface for the LINE Official Account.

- Round-1 webhook brief: [`docs/CRM/LineOA/lineOA 31aug.md`](../../../docs/CRM/LineOA/lineOA%2031aug.md)
- Step 0.11 (Talk-to-us → LINE summary) brief: [`docs/CRM/LineOA/lineOA 1sep.md`](../../../docs/CRM/LineOA/lineOA%201sep.md)
- Step 0.12.5–0.12.6 (LIFF + Website lead ↔ LINE identity linking) brief: [`docs/CRM/LineOA/Step_0_12_5_to_0_12_6_Dev_Brief.md`](../../../docs/CRM/LineOA/Step_0_12_5_to_0_12_6_Dev_Brief.md)

The lead ↔ LINE mapping is persisted in Supabase — see [`src/features/db`](../db) and [`supabase/schema.sql`](../../../supabase/schema.sql).

## Scope — round 1 webhook (31aug §3, §9)

Receive LINE webhook events and prove the backend can identify the sender:

- verify `x-line-signature` (HMAC-SHA256 of the raw body, keyed by the channel secret)
- handle `follow` and `message:text`
- log event type + LINE userId + message text + timestamp
- return HTTP 200

**Out of scope (31aug §10):** HubSpot, lead creation, LIFF / website
identity linking, auto-reply / bot logic.

## Scope — Step 0.11: Talk-to-us → LINE summary (1sep §2)

`buildLineLeadSummary(input)` — internal slugs → the §5 customer text.
Pure; TH copy + slug→label maps live in `summaryLabels.ts`. It is now
consumed only by `link-lead` (the standalone `/api/line/lead-summary` route
and its hardcoded `LINE_TEST_USER_ID` were removed in Step 0.12.6).

## Scope — Step 0.12.6: Website lead ↔ LINE identity linking

No hardcoded userId anywhere: persist every submission, resolve the real
LINE `sub` for the one the customer is linking, push the Step 0.11 summary
there, and record `lead_id ↔ line_user_id`.

- `POST /api/crm/lead` — writes a `line_user.leads` row (leads-first) and
  returns `lead_id` alongside the CRM outcome (brief §4.1)
- `POST /api/line/lead-token` — wizard button → `{ lead_id, line_summary }`
  → mint an **opaque**, single-use, 15-min `lead_token`; its row in
  `line_user.lead_link_tokens` holds `sha256(token)` + the summary DTO +
  expiry (`src/features/db/leadLinkTokens.ts`)
- LIFF page `/[locale]/liff/talk-to-us` (`LiffTalkToUsClient.tsx`) —
  `liff.init()` → LINE Login → `liff.getIDToken()` → `POST /api/line/link-lead`
- `POST /api/line/link-lead` — peek token → verify the ID token against LINE
  (`verifyLineIdToken.ts`) → link `lead_id ↔ sub` (refuses to overwrite a
  different user, §4.6) → consume the token → push the summary. Decision 5a:
  a push failure still returns `200 { …, summary_delivered: false }` — the
  link is committed, delivery is a separate status.

Token state (expiry, one-time use) lives in Supabase, so one-time use is
enforced across serverless instances (brief §4.2, TC-09).

**Out of scope (brief §9):** HubSpot mapping of `line_user_id`,
Company/Deal, Customer 360, account/membership linking, PDPA consent
re-check, queued/retried push.

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
| `verifyLineIdToken.ts` | Step 0.12.6: `verifyLineIdToken()` — POST the LIFF ID token to LINE, return the verified `sub` (LINE userId). |
| `LiffTalkToUsClient.tsx` | Step 0.12.6: `"use client"` UI for the LIFF Endpoint page (init → login → getIDToken → link). |
| `index.ts` | Public surface. |
| `../db/*` | Step 0.12.6: Supabase persistence — `line_user.leads` + `line_user.lead_link_tokens` (`createLead`, `linkLeadToLineUser`, `issueLinkToken`, `peekLinkToken`, `consumeLinkToken`, …). |
| `../../app/api/line/webhook/route.ts` | Inbound webhook route handler. |
| `../../app/api/crm/lead/route.ts` | Step 0.12.6: persist the lead (leads-first) + CRM upsert; returns `lead_id`. |
| `../../app/api/line/lead-token/route.ts` | Step 0.12.6: mint an opaque one-time `lead_token` bound to `lead_id`. |
| `../../app/api/line/link-lead/route.ts` | Step 0.12.6: peek token → verify ID token → link → consume → push. |
| `../../app/[locale]/liff/talk-to-us/page.tsx` | Step 0.12.6: LIFF Endpoint page (thin server wrapper). |

## Env

`.env` is gitignored — set these locally **and** in Vercel → Project
Settings → Environment Variables.

| Var | Where | Used for |
|---|---|---|
| `LINE_CHANNEL_SECRET` | LINE console → Basic settings | inbound — `x-line-signature` check |
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE console → Messaging API | outbound — `push` / `reply` (`send.ts`) |
| `LINE_CHANNEL_ID` | LINE console → Basic settings | recorded for the identity-linking step |
| `LINE_ECHO_REPLY` | — | set to `1` to make the webhook echo inbound text back (test outbound send). Off by default. |
| `NEXT_PUBLIC_LIFF_ID` | LINE console → LINE Login channel → LIFF | Step 0.12.6 — **public**, inlined at build. The LIFF page + the `liff.line.me/<id>` URL the wizard opens. |
| `LINE_LOGIN_CHANNEL_ID` | LINE console → LINE Login channel → Basic settings | Step 0.12.6 — `client_id` for verifying the LIFF ID token (`verifyLineIdToken.ts`). Different channel from `LINE_CHANNEL_ID`. |
| `SUPABASE_URL` | Supabase → Project Settings → API | Step 0.12.6 — lead ↔ LINE store. Missing → `/api/crm/lead` + both LINE token routes 500. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (`service_role`) | Step 0.12.6 — server-only, **bypasses RLS**. Never `NEXT_PUBLIC_`, never logged. |

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

### Step 0.12.6 — lead-token + link-lead

```bash
# one-time: run supabase/schema.sql in the Supabase SQL Editor, then add
# `line_user` under Dashboard → Project Settings → API → "Exposed schemas".
# needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY + LINE_LOGIN_CHANNEL_ID
#       + LINE_CHANNEL_ACCESS_TOKEN in .env

# 0. create a lead (or use the wizard) — note the returned lead_id:
curl -sS localhost:3000/api/crm/lead -H 'content-type: application/json' -d '{ … canonical payload … }'
# → { "ok": true, "lead_id": "<uuid>", "crmContactId": "STUB-1000", "crm_status": "ok" }

# 1. mint a lead_token bound to that lead:
curl -sS localhost:3000/api/line/lead-token \
  -H 'content-type: application/json' -d '{
    "lead_id": "<uuid from step 0>",
    "line_summary": {
      "first_name": "Somchai",
      "interested_solution": "Digital Signage & Media",
      "qualification": { "screen_count": "21-50", "usage_type": "multi-branch" },
      "contact_preference": { "channel": "line" }
    }
  }'
# → { "ok": true, "lead_token": "tkn_<64hex>", "expires_in": 900 }

# 2. link (id_token comes from liff.getIDToken() in a real LINE client):
curl -sS localhost:3000/api/line/link-lead \
  -H 'content-type: application/json' \
  -d '{ "lead_token": "<from step 1>", "id_token": "<real LINE ID token>" }'
# happy path            → 200 { ok:true, lead_id, line_user_id:"U…", line_identity_status:"linked", summary_delivered:true } + LINE buzzes
# unknown / bad token   → 401 { ok:false, error:"invalid_lead_token" }
# expired token         → 410 { ok:false, error:"lead_token_expired" }
# reused token          → 409 { ok:false, error:"lead_token_used" }
# lead linked elsewhere → 409 { ok:false, error:"linked_to_other_user" }
# bad / stale id_token  → 401 { ok:false, error:"line_identity_unverified" }
# push fails            → 200 { ok:true, …, summary_delivered:false }   (decision 5a — link still committed)
```

The full happy path can only be exercised from inside the LINE in-app
browser (a real `id_token`) — see the Step 0.12.6 test cases in the brief.

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
| `summaryLabels.ts` | fixed "ครับ" / 👋 wording straight from 1sep §5; TH only | brand-voice pass (gender-neutral); add EN if needed |
| `link-lead/route.ts` | link + token-consume are sequential calls, not one DB transaction | Postgres function / RPC if the race window ever matters |
| `link-lead/route.ts` | a failed push is only logged — no automated retry | queue the push; a cron / worker retries `linked` rows with `summary_delivered_at is null` |
| `lead-token/route.ts` | `line_summary` DTO comes from the client | rebuild it server-side from `leads.canonical` once the canonical payload keeps the DS qualification slugs |
| `link-lead/route.ts` | no consent re-check before pushing to a real user | PDPA consent gate before any real-customer push |
| `db/client.ts` | writes with the god-mode `service_role` key | scoped Postgres role with grants on `line_user.*` only, via a direct `pg` connection |
| `LiffTalkToUsClient.tsx` | inherits the site Navbar/Footer chrome from `[locale]/layout.tsx` | route group / conditional chrome for `/liff/*` |
| `liff/talk-to-us/page.tsx` | copy is hardcoded TH literals | post-PoC: `LiffTalkToUs` i18n namespace + pick locale from `liff.getLanguage()` (or `?lang=`), keep one route/endpoint — see the TODO in `page.tsx` |
| `db/schema.sql` | applied by hand in the SQL Editor | convert to Supabase CLI migrations if the schema starts evolving |
| — | `line_user_id` is not synced into the CRM | Step 0.13+: push the linked id to the HubSpot contact |

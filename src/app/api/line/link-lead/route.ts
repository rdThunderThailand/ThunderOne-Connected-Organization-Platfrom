// === POST /api/line/link-lead — Website lead ↔ LINE identity (Step 0.12) ===
//
// The LIFF page (src/features/line/LiffTalkToUsClient.tsx) posts:
//   { lead_token, id_token }
// - lead_token: the signed token from /api/line/lead-token (carries the
//   lead_id + the summary DTO + expiry — see leadToken.ts)
// - id_token:   from `liff.getIDToken()`, verified here against LINE (§12 —
//   never trust a client-sent userId)
//
// On success: resolve the real LINE userId, build the Step 0.11 summary
// from the token payload, push it to that user, and return the §11 result:
//   { lead_id, line_user_id, line_identity_status: "linked" }
//
// This is what removes the hardcoded LINE_TEST_USER_ID from the flow
// (§13 TC-05, §16).
//
// Not under `[locale]` — the i18n proxy matcher excludes `/api`
// (src/proxy.ts). Node runtime: leadToken.ts uses `node:crypto`.
//
// TEMPORARY (PoC): consent is NOT re-checked here (§15 / brief "Out of
// scope"); the wizard already blocks submits without consent. Replay guard
// is best-effort per instance — see leadToken.ts.

import { z } from "zod";
import {
  buildLineLeadSummary,
  pushLineMessages,
  readLeadToken,
  verifyLineIdToken,
} from "@/features/line";

export const runtime = "nodejs";

const TAG = "[line:link-lead]";

const bodySchema = z.object({
  lead_token: z.string().min(1),
  id_token: z.string().min(1),
});

// Best-effort, per-instance replay guard. A stateless token cannot be
// marked used across serverless instances (leadToken.ts) — this catches the
// common same-instance retry. Bounded reset keeps it from growing forever.
const consumedSignatures = new Set<string>();
function markConsumed(token: string): void {
  if (consumedSignatures.size > 5000) consumedSignatures.clear();
  consumedSignatures.add(token.slice(token.lastIndexOf(".") + 1));
}
function alreadyConsumed(token: string): boolean {
  return consumedSignatures.has(token.slice(token.lastIndexOf(".") + 1));
}

/** `U` + 32 hex → `U1a2b…` for logs (§12: don't log full identifiers). */
function maskUserId(userId: string): string {
  return `${userId.slice(0, 5)}…`;
}

export async function POST(request: Request) {
  if (
    !process.env.LINE_LEAD_TOKEN_SECRET?.trim() ||
    !process.env.LINE_LOGIN_CHANNEL_ID?.trim()
  ) {
    console.error(`${TAG} missing LINE_LEAD_TOKEN_SECRET / LINE_LOGIN_CHANNEL_ID`);
    return Response.json(
      { ok: false, error: "server_misconfigured" },
      { status: 500 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation_failed" },
      { status: 422 },
    );
  }
  const { lead_token: leadToken, id_token: idToken } = parsed.data;

  // 1. lead_token — signature + expiry.
  const tokenResult = readLeadToken(leadToken);
  if (!tokenResult.ok) {
    console.warn(`${TAG} rejected lead_token — ${tokenResult.error}`);
    return Response.json(
      { ok: false, error: "invalid_lead_token", reason: tokenResult.error },
      { status: 401 },
    );
  }

  // 2. replay guard (best-effort).
  if (alreadyConsumed(leadToken)) {
    console.warn(
      `${TAG} rejected lead_token — already consumed leadId=${tokenResult.payload.lead_id}`,
    );
    return Response.json(
      { ok: false, error: "lead_token_used" },
      { status: 409 },
    );
  }

  // 3. id_token — verified against LINE.
  const identity = await verifyLineIdToken(idToken);
  if (!identity.ok) {
    console.warn(
      `${TAG} id_token verify failed — ${identity.status} ${identity.detail}`,
    );
    return Response.json(
      { ok: false, error: "line_identity_unverified" },
      { status: 401 },
    );
  }

  const { lead_id: leadId, summary } = tokenResult.payload;
  const lineUserId = identity.userId;
  markConsumed(leadToken);

  // 4. build + push the Step 0.11 summary to the verified user.
  const text = buildLineLeadSummary(summary);
  let push;
  try {
    push = await pushLineMessages(lineUserId, [{ type: "text", text }]);
  } catch (error) {
    console.error(
      `${TAG} ${error instanceof Error ? error.message : String(error)}`,
    );
    return Response.json(
      { ok: false, error: "server_misconfigured" },
      { status: 500 },
    );
  }

  if (!push.ok) {
    console.error(`${TAG} push failed — ${push.status} ${push.detail}`);
    return Response.json(
      { ok: false, error: "line_push_failed", detail: push.detail },
      { status: 502 },
    );
  }

  // §16: successful link log, no token / id_token.
  console.info(
    `${TAG} linked leadId=${leadId} lineUserId=${maskUserId(lineUserId)} summaryPushed=true`,
  );

  return Response.json({
    ok: true,
    lead_id: leadId,
    line_user_id: lineUserId,
    line_identity_status: "linked",
  });
}

// Convenience health check.
export async function GET() {
  return Response.json({ ok: true, service: "line-link-lead" });
}

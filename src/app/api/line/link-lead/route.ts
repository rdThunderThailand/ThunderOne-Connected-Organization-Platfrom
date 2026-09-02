// === POST /api/line/link-lead — Website lead ↔ LINE identity (Step 0.12.6) ===
//
// The LIFF page (src/features/line/LiffTalkToUsClient.tsx) posts:
//   { lead_token, id_token }
// - lead_token: the opaque token from /api/line/lead-token (its row in
//   `line_user.lead_link_tokens` carries lead_id + the summary DTO + expiry)
// - id_token:   from `liff.getIDToken()`, verified here against LINE (§12 —
//   never trust a client-sent userId)
//
// Order (so a failed step never wastes the token):
//   1. peek the token        — signature-free: exists / not consumed / not expired
//   2. verify the id_token    — token still untouched on failure
//   3. link lead ↔ sub        — refuses to overwrite a different user (§4.6);
//                               token still untouched on failure
//   4. consume the token      — the real one-time gate (§4.2, TC-09)
//   5. push the Step 0.11 summary — decision 5a: the link is already
//      committed, so a push failure returns 200 with summary_delivered:false
//
// This removes the hardcoded LINE_TEST_USER_ID from the flow entirely
// (brief §8, §10). Node runtime: leadLinkTokens.ts uses `node:crypto`.

import { z } from "zod";
import {
  consumeLinkToken,
  isSupabaseConfigured,
  linkLeadToLineUser,
  markSummaryDelivered,
  peekLinkToken,
} from "@/features/db";
import {
  buildLineLeadSummary,
  pushLineMessages,
  verifyLineIdToken,
} from "@/features/line";

export const runtime = "nodejs";

const TAG = "[line:link-lead]";

const bodySchema = z.object({
  lead_token: z.string().min(1),
  id_token: z.string().min(1),
});

/** `U` + 32 hex → `U1a2b…` for logs (§12: don't log full identifiers). */
function maskUserId(userId: string): string {
  return `${userId.slice(0, 5)}…`;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured() || !process.env.LINE_LOGIN_CHANNEL_ID?.trim()) {
    console.error(`${TAG} missing Supabase env / LINE_LOGIN_CHANNEL_ID`);
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

  // 1. lead_token — exists / not consumed / not expired (not burned yet).
  const peek = await peekLinkToken(leadToken);
  if (!peek.ok) {
    console.warn(`${TAG} rejected lead_token — ${peek.reason}`);
    if (peek.reason === "consumed") {
      return Response.json({ ok: false, error: "lead_token_used" }, { status: 409 });
    }
    if (peek.reason === "expired") {
      return Response.json(
        { ok: false, error: "lead_token_expired" },
        { status: 410 },
      );
    }
    return Response.json(
      { ok: false, error: "invalid_lead_token" },
      { status: 401 },
    );
  }

  // 2. id_token — verified against LINE. Token still untouched on failure.
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

  const { leadId, lineSummary } = peek;
  const lineUserId = identity.userId;

  // 3. link lead ↔ verified LINE user (brief §4.6). Token still untouched.
  const link = await linkLeadToLineUser(leadId, lineUserId);
  if (!link.ok) {
    console.warn(`${TAG} link refused — leadId=${leadId} reason=${link.reason}`);
    const status = link.reason === "lead_not_found" ? 404 : 409;
    return Response.json({ ok: false, error: link.reason }, { status });
  }

  // 4. consume the token — the actual one-time gate. A concurrent redeemer
  //    that got here first wins; this one is rejected as reuse.
  const consumed = await consumeLinkToken(leadToken);
  if (!consumed.ok) {
    console.warn(`${TAG} lead_token consumed by a concurrent request — leadId=${leadId}`);
    return Response.json({ ok: false, error: "lead_token_used" }, { status: 409 });
  }

  // 5. build + push the Step 0.11 summary. Decision 5a: the link is already
  //    committed, so a delivery failure is a separate, non-fatal status.
  const text = buildLineLeadSummary(lineSummary);
  let summaryDelivered = false;
  try {
    const push = await pushLineMessages(lineUserId, [{ type: "text", text }]);
    if (push.ok) {
      summaryDelivered = true;
      await markSummaryDelivered(leadId);
    } else {
      console.error(`${TAG} push failed — ${push.status} ${push.detail}`);
    }
  } catch (error) {
    // pushLineMessages throws only when LINE_CHANNEL_ACCESS_TOKEN is missing.
    console.error(
      `${TAG} push threw — ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  // §16: successful link log, no token / id_token.
  console.info(
    `${TAG} linked leadId=${leadId} lineUserId=${maskUserId(lineUserId)} ` +
      `alreadyLinked=${link.alreadyLinked} summaryDelivered=${summaryDelivered}`,
  );

  return Response.json({
    ok: true,
    lead_id: leadId,
    line_user_id: lineUserId,
    line_identity_status: "linked",
    summary_delivered: summaryDelivered,
  });
}

// Convenience health check.
export async function GET() {
  return Response.json({ ok: true, service: "line-link-lead" });
}

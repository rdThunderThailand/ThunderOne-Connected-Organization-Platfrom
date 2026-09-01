// === POST /api/line/lead-token — mint a lead_token (Step 0.12 §3, §8) ===
//
// Called by the Talk-to-us wizard when the customer picks "คุยผ่าน LINE".
// Body is the LINE-local summary DTO (the same LineLeadSummaryInput the
// Step 0.11 push uses — src/components/talk-to-us/leadSummaryPayload.ts).
//
// Returns a short-lived, HMAC-signed `lead_token` (see leadToken.ts). The
// wizard then opens the LIFF URL with `?lead_token=<token>`; the LIFF page
// posts it back to /api/line/link-lead together with a verified LINE ID
// token, and the summary is pushed to the real user.
//
// Not under `[locale]` — the i18n proxy matcher excludes `/api`
// (src/proxy.ts). Node runtime: leadToken.ts uses `node:crypto`.
//
// TEMPORARY (PoC): no auth / rate-limit / bot protection (§12 wants HTTPS +
// no secret logging, both satisfied). `lead_id` is a throwaway display id,
// not a persisted record (§7, §15).

import { issueLeadToken, lineLeadSummaryInputSchema } from "@/features/line";

export const runtime = "nodejs";

const TAG = "[line:lead-token]";

export async function POST(request: Request) {
  // Fail fast if the signing secret is missing — issueLeadToken would throw.
  if (!process.env.LINE_LEAD_TOKEN_SECRET?.trim()) {
    console.error(`${TAG} LINE_LEAD_TOKEN_SECRET is not set`);
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

  const parsed = lineLeadSummaryInputSchema.safeParse(raw);
  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        error: "validation_failed",
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  const { leadId, token, expiresInSeconds } = issueLeadToken(parsed.data);

  // §16 wants a link log that does not reveal the token.
  console.info(
    `${TAG} issued leadId=${leadId} solution=${JSON.stringify(parsed.data.interested_solution)} ttl=${expiresInSeconds}s`,
  );

  return Response.json({
    ok: true,
    lead_id: leadId,
    lead_token: token,
    expires_in: expiresInSeconds,
  });
}

// Convenience health check.
export async function GET() {
  return Response.json({ ok: true, service: "line-lead-token" });
}

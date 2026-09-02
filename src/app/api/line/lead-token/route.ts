// === POST /api/line/lead-token — mint a lead_token (Step 0.12.6 §4.2) ===
//
// Called by the Talk-to-us wizard when the customer picks "คุยผ่าน LINE".
// Body:
//   { lead_id: string (uuid), line_summary: LineLeadSummaryInput }
// - lead_id:      the `line_user.leads` row from POST /api/crm/lead
// - line_summary: the LINE-local summary DTO (src/components/talk-to-us/
//                 leadSummaryPayload.ts) — stored on the token row and
//                 rebuilt into text at redeem time
//
// Returns an opaque, single-use, 15-min `lead_token` (decision 2a — see
// src/features/db/leadLinkTokens.ts). The wizard opens the LIFF URL with
// `?lead_token=<token>`; the LIFF page posts it back to /api/line/link-lead
// with a verified LINE ID token, and the summary is pushed to the real user.
//
// Not under `[locale]` — the i18n proxy matcher excludes `/api`
// (src/proxy.ts). Node runtime: leadLinkTokens.ts uses `node:crypto`.
//
// TEMPORARY (PoC): no auth / rate-limit / bot protection.

import { z } from "zod";
import { issueLinkToken, isSupabaseConfigured } from "@/features/db";
import { lineLeadSummaryInputSchema } from "@/features/line";

export const runtime = "nodejs";

const TAG = "[line:lead-token]";

const bodySchema = z.object({
  lead_id: z.string().uuid(),
  line_summary: lineLeadSummaryInputSchema,
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    console.error(`${TAG} SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY is not set`);
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

  const { lead_id: leadId, line_summary: lineSummary } = parsed.data;

  let issued;
  try {
    issued = await issueLinkToken(leadId, lineSummary);
  } catch (error) {
    // A bad lead_id trips the FK constraint here.
    console.error(
      `${TAG} issue failed — ${error instanceof Error ? error.message : String(error)}`,
    );
    return Response.json(
      { ok: false, error: "lead_token_issue_failed" },
      { status: 502 },
    );
  }

  // §16 wants a link log that does not reveal the token.
  console.info(
    `${TAG} issued leadId=${leadId} solution=${JSON.stringify(lineSummary.interested_solution)} ttl=${issued.expiresInSeconds}s`,
  );

  return Response.json({
    ok: true,
    lead_token: issued.token,
    expires_in: issued.expiresInSeconds,
  });
}

// Convenience health check. `env` reports only whether each var is present
// (never its value) — used to confirm a deployment picked up the config.
export async function GET() {
  return Response.json({
    ok: true,
    service: "line-lead-token",
    env: {
      SUPABASE_URL: Boolean(process.env.SUPABASE_URL?.trim()),
      SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
      LINE_LOGIN_CHANNEL_ID: Boolean(process.env.LINE_LOGIN_CHANNEL_ID?.trim()),
      LINE_CHANNEL_ACCESS_TOKEN: Boolean(process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim()),
      NEXT_PUBLIC_LIFF_ID: Boolean(process.env.NEXT_PUBLIC_LIFF_ID),
    },
  });
}

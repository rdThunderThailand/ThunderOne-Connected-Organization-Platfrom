// === POST /api/line/lead-summary — Talk-to-us → LINE summary (Step 0.11) ===
//
// docs/CRM/LineOA/lineOA 1sep.md §6, §7: take a lead (LINE-local DTO),
// build the Thai summary with buildLineLeadSummary(), and push it to the
// customer's LINE via the Messaging API push endpoint.
//
// ROUND 1 (§2, §11): the recipient is a single hardcoded test userId from
// `LINE_TEST_USER_ID` — there is no Website-lead ↔ LINE-identity link yet.
// Step 0.12 replaces the env lookup with the real per-lead userId.
//
// The website wizard calls this fire-and-forget after the customer picks
// "คุยผ่าน LINE", and only for the Digital Signage topic
// (src/store/talkToUsStore.ts). It is also curl-testable on its own.
//
// Not under `[locale]` on purpose — the i18n proxy matcher excludes
// `/api` (src/proxy.ts). POST route handlers are not cached. Node.js is
// the default runtime; no `runtime` export (Edge is deprecated).
//
// TEMPORARY (PoC): no auth / rate-limit / bot protection. Consent is NOT
// re-checked here — round 1 pushes only to the opted-in test user, and the
// wizard already blocks submits without consent. A real flow (0.12+) MUST
// verify consent before pushing to a real customer.

import { buildLineLeadSummary, lineLeadSummaryInputSchema, pushLineMessages } from "@/features/line";

const TAG = "[line:lead-summary]";

export async function POST(request: Request) {
  const testUserId = process.env.LINE_TEST_USER_ID?.trim();
  if (!testUserId) {
    console.error(`${TAG} LINE_TEST_USER_ID is not set`);
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

  const summary = buildLineLeadSummary(parsed.data);

  let result;
  try {
    result = await pushLineMessages(testUserId, [{ type: "text", text: summary }]);
  } catch (error) {
    // send.ts throws only when LINE_CHANNEL_ACCESS_TOKEN is missing.
    console.error(
      `${TAG} ${error instanceof Error ? error.message : String(error)}`,
    );
    return Response.json(
      { ok: false, error: "server_misconfigured" },
      { status: 500 },
    );
  }

  if (!result.ok) {
    console.error(`${TAG} push failed — ${result.status} ${result.detail}`);
    return Response.json(
      { ok: false, error: "line_push_failed", detail: result.detail },
      { status: 502 },
    );
  }

  // `preview` is a PoC convenience for curl testing — it is the exact text
  // pushed to LINE.
  return Response.json({ ok: true, preview: summary });
}

// Convenience health check — handy when pointing a client at a fresh
// deployment. Returns 200 with no LINE data.
export async function GET() {
  return Response.json({ ok: true, service: "line-lead-summary" });
}

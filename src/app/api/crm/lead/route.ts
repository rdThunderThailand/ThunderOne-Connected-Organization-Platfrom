// === POST /api/crm/lead — Talk to us / Request Demo → CRM ===
//
// The backend-only boundary between the website and the CRM (docs §1:
// "ส่งข้อมูลเข้า HubSpot ผ่าน Backend เท่านั้น ไม่ให้ Frontend เรียก
// HubSpot API โดยตรง"). Validates + normalizes the canonical payload,
// persists one `line_user.leads` row (brief §4.1 — every submission gets a
// lead_id), then upserts a contact through the active CRM connector.
//
// LEADS-FIRST (Step 0.12.6 / decision 4a): the lead row is the source of
// truth for the LINE-link flow, so it is written before the CRM call and a
// CRM outage does NOT fail the request — the response still carries
// `lead_id`, just with `crmContactId: null`.
//
// Not under `[locale]` on purpose — the i18n proxy matcher excludes
// `/api` (src/proxy.ts). POST route handlers are not cached.
//
// TEMPORARY (PoC): no auth / rate-limit / bot protection on this route.
// Add an origin check + rate limiting + captcha before exposing it
// publicly (docs §15).

import { getCrmConnector, parseCanonicalLead, upsertLead } from "@/features/crm";
import { createLead, isSupabaseConfigured, setLeadCrmContactId } from "@/features/db";

export const runtime = "nodejs";

const TAG = "[crm:lead]";

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

  // Step 1 — validate + normalize (docs §8).
  const parsed = parseCanonicalLead(raw);
  if (!parsed.ok) {
    return Response.json(
      { ok: false, error: "validation_failed", issues: parsed.issues },
      { status: 422 },
    );
  }

  // Step 2 — persist the lead first (brief §4.1). Without a lead_id the
  // LINE-link flow cannot start, so a failure here IS fatal.
  let leadId: string;
  try {
    leadId = await createLead(parsed.data);
  } catch (error) {
    console.error(
      `${TAG} lead persist failed — ${error instanceof Error ? error.message : String(error)}`,
    );
    return Response.json(
      { ok: false, error: "lead_persist_failed" },
      { status: 502 },
    );
  }

  // Step 3 — best-effort CRM upsert. A failure is logged and surfaced in the
  // response, but does not block the wizard (decision 4a).
  let crmContactId: string | null = null;
  let provider: string | null = null;
  let action: "created" | "updated" | null = null;
  try {
    const connector = getCrmConnector();
    const outcome = await upsertLead(connector, parsed.data);
    crmContactId = outcome.id;
    provider = outcome.provider;
    action = outcome.action;
    await setLeadCrmContactId(leadId, outcome.id);

    // TEMPORARY (§15): swap console for a real structured audit log; do
    // not log full PII in production.
    console.info(
      `${TAG} upsert ok — leadId=${leadId} provider=${provider} action=${action} ` +
        `crmContactId=${crmContactId} email=${parsed.data.email}`,
    );
  } catch (error) {
    console.error(
      `${TAG} upsert failed (lead ${leadId} still saved) — ` +
        `${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return Response.json({
    ok: true,
    lead_id: leadId,
    crmContactId,
    provider,
    action,
    crm_status: crmContactId ? "ok" : "failed",
  });
}

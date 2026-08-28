// === POST /api/crm/lead — Talk to us / Request Demo → CRM ===
//
// The backend-only boundary between the website and the CRM (docs §1:
// "ส่งข้อมูลเข้า HubSpot ผ่าน Backend เท่านั้น ไม่ให้ Frontend เรียก
// HubSpot API โดยตรง"). Validates + normalizes the canonical payload,
// then upserts a contact through the active CRM connector.
//
// Not under `[locale]` on purpose — the i18n proxy matcher excludes
// `/api` (src/proxy.ts). POST route handlers are not cached.
//
// TEMPORARY (PoC): no auth / rate-limit / bot protection on this route.
// Add an origin check + rate limiting + captcha before exposing it
// publicly (docs §15).

import { getCrmConnector, parseCanonicalLead, upsertLead } from "@/features/crm";

export async function POST(request: Request) {
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

  try {
    // Steps 2 & 5 — resolve then create/update the CRM contact.
    const connector = getCrmConnector();
    const outcome = await upsertLead(connector, parsed.data);

    // TEMPORARY (D-07): the CRM contact id is only returned + logged, not
    // persisted. A thunder_customer_id ↔ external-id store is needed for
    // PoC #4 (reverse sync).
    // TEMPORARY (§15): swap console for a real structured audit log; do
    // not log full PII in production.
    console.info(
      `[crm:lead] upsert ok — provider=${outcome.provider} action=${outcome.action} ` +
        `crmContactId=${outcome.id} email=${parsed.data.email}`,
    );

    return Response.json({
      ok: true,
      provider: outcome.provider,
      action: outcome.action,
      crmContactId: outcome.id,
    });
  } catch (error) {
    console.error(
      `[crm:lead] upsert failed — ${error instanceof Error ? error.message : String(error)}`,
    );
    return Response.json({ ok: false, error: "crm_upsert_failed" }, { status: 502 });
  }
}

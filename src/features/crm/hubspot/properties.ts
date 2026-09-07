// === HubSpot contact-property discovery (Step 3.2, D-02) ===
//
// Reads the portal's ACTUAL contact-property internal names once, so the
// mapper can drop any canonical field the portal has no property for
// instead of failing the whole write (brief §10: "Custom property
// invalid/missing → อย่าให้ field ที่ไม่จำเป็น block payload ทั้งก้อน").
//
// GET /crm/v3/properties/contacts is listed by HubSpot as needing one of
// `crm.schemas.contacts.read` OR `crm.objects.contacts.read`. If the call
// fails for any reason the mapper falls back to a static allowlist
// (STATIC_PORTAL_PROPERTIES in ./mapper.ts) — the write still goes through.

const HUBSPOT_API_BASE = "https://api.hubapi.com";
const TAG = "[crm:hubspot:properties]";

type PropertyList = { results?: { name?: string }[] };

// Process-lifetime cache. A scope / env fix needs a redeploy anyway, which
// restarts the process and clears this. `null` (fetch failed) is cached
// too, so a persistently missing scope doesn't hammer the endpoint.
let cached: Promise<Set<string> | null> | undefined;

/**
 * The set of contact-property internal names that exist in the portal, or
 * `null` if the schema could not be read (caller then uses the static
 * brief §5 allowlist).
 */
export function getPortalContactProperties(
  token: string,
): Promise<Set<string> | null> {
  if (!cached) cached = load(token);
  return cached;
}

async function load(token: string): Promise<Set<string> | null> {
  try {
    const res = await fetch(`${HUBSPOT_API_BASE}/crm/v3/properties/contacts`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(
        `${TAG} cannot read portal schema (HTTP ${res.status}) — ` +
          `falling back to the brief §5 allowlist` +
          (res.status === 401 || res.status === 403
            ? ` (add scope crm.schemas.contacts.read to the Private App)`
            : ``),
      );
      return null;
    }

    const body = (await res.json()) as PropertyList;
    const names = new Set(
      (body.results ?? [])
        .map((property) => property.name)
        .filter((name): name is string => typeof name === "string"),
    );
    console.info(`${TAG} loaded ${names.size} contact properties from portal`);
    return names;
  } catch (error) {
    console.warn(
      `${TAG} property fetch failed — ` +
        `${error instanceof Error ? error.message : String(error)} — ` +
        `falling back to the brief §5 allowlist`,
    );
    return null;
  }
}

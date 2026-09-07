#!/usr/bin/env bash
# Step 3.2 — TC-3.2-04 focused: a repeat submission UPDATES, never duplicates.
#
# Submits the same email twice with different data, then reads the contact
# back from HubSpot and asserts the merge policy (mergeHubSpotProperties):
#
#   - crm_status:                    ok both times
#   - crmContactId:                  identical both times (one contact)
#   - lead_id:                       different (one leads row per submission)
#   - action:                        created -> updated
#   - interested_solution:           LAST write wins  (digital_signage_media -> thunder_care)
#   - inquiry_message:               LAST write wins
#   - thunder_utm_source:            FIRST touch kept (facebook, NOT google)  [D-04]
#   - contacts search by email:      exactly 1 result (no duplicate)
#
# Usage:
#   ./docs/CRM/step_3_2_update_test.sh
#   EMAIL=upd-known@example.com ./docs/CRM/step_3_2_update_test.sh   # reuse an email
#   INDEX_WAIT=60               ./docs/CRM/step_3_2_update_test.sh   # slower indexing
#   BASE_URL=http://localhost:3001 ./docs/CRM/step_3_2_update_test.sh

set -u

BASE_URL="${BASE_URL:-http://localhost:3000}"
ENV_FILE="${ENV_FILE:-.env}"
EMAIL="${EMAIL:-upd-$(date +%s)@example.com}"
INDEX_WAIT="${INDEX_WAIT:-35}"

pass=0
fail=0
ok()   { printf '  \033[32mPASS\033[0m %s\n' "$1"; pass=$((pass + 1)); }
no()   { printf '  \033[31mFAIL\033[0m %s\n' "$1"; fail=$((fail + 1)); }
info() { printf '  \033[36m*\033[0m %s\n' "$1"; }

command -v jq >/dev/null || { echo "jq not installed"; exit 1; }
KEY="$(grep -E '^HUBSPOT_SERVICE_KEY=' "$ENV_FILE" 2>/dev/null | head -1 | cut -d= -f2- | tr -d '\042\047[:space:]')"
[ -n "$KEY" ] || { echo "HUBSPOT_SERVICE_KEY not found in $ENV_FILE"; exit 1; }
curl -sS -o /dev/null "$BASE_URL" 2>/dev/null || { echo "server not reachable at $BASE_URL — run: pnpm dev"; exit 1; }

post_lead() { # $1 = interested slug   $2 = inquiry_message   $3 = utm_source
  curl -sS "$BASE_URL/api/crm/lead" -H 'content-type: application/json' -d '{
    "first_name":"Somchai","last_name":"Prasert","company_name":"ABC Company",
    "position":"IT Manager","mobile":"0811111111","email":"'"$EMAIL"'",
    "interested_solutions":["'"$1"'"],"inquiry_message":"'"$2"'",
    "consent":{"status":"granted","purpose":"sales_contact","source":"website",
               "timestamp":"2026-09-04T10:00:00+07:00"},
    "acquisition":{"source":"website","medium":"organic","campaign":null,
      "utm_source":"'"$3"'","utm_medium":null,"utm_campaign":null,"landing_page":"/th"}}'
}

hs_contact() { # $1 = contact id
  curl -sS "https://api.hubapi.com/crm/v3/objects/contacts/$1?properties=interested_solution,inquiry_message,thunder_utm_source,thunder_lead_source" \
    -H "Authorization: Bearer $KEY"
}

hs_email_count() {
  curl -sS "https://api.hubapi.com/crm/v3/objects/contacts/search" \
    -H "Authorization: Bearer $KEY" -H 'content-type: application/json' \
    -d '{"filterGroups":[{"filters":[{"propertyName":"email","operator":"EQ","value":"'"$EMAIL"'"}]}],"limit":10}' \
    | jq -r '.total // 0'
}

echo "email: $EMAIL"
echo

# --- submission 1 -----------------------------------------------------------
echo "== submission 1 (expect create) =="
R1="$(post_lead "digital-signage" "update test - first" "facebook")"
echo "$R1" | jq . 2>/dev/null || { echo "$R1"; echo "non-JSON — server up?"; exit 1; }
a1="$(echo "$R1"  | jq -r '.action       // empty')"
id1="$(echo "$R1" | jq -r '.crmContactId // empty')"
lead1="$(echo "$R1" | jq -r '.lead_id    // empty')"
s1="$(echo "$R1"  | jq -r '.crm_status   // empty')"

[ "$s1" = "ok" ] || { no "sub1 crm_status = '$s1' — read the pnpm dev log '[crm:lead] upsert failed — <reason>'"; printf 'result: %d passed, %d failed\n' "$pass" "$fail"; exit 1; }
{ [ -n "$id1" ] && [ "$id1" != "null" ]; } || { no "sub1 crmContactId is empty"; exit 1; }
[ "$a1" = "created" ] && ok "sub1 action = created" || info "sub1 action = $a1 (email pre-existed — update test still valid)"
info "sub1 crmContactId = $id1   lead_id = $lead1"
echo

echo "== waiting ${INDEX_WAIT}s for HubSpot Search API to index the new contact =="
sleep "$INDEX_WAIT"
echo

# --- submission 2 (same email, different data) ----------------------------
echo "== submission 2 (same email, interested=thunder-care, utm_source=google) =="
R2="$(post_lead "thunder-care" "update test - second" "google")"
echo "$R2" | jq . 2>/dev/null || { echo "$R2"; exit 1; }
a2="$(echo "$R2"  | jq -r '.action       // empty')"
id2="$(echo "$R2" | jq -r '.crmContactId // empty')"
lead2="$(echo "$R2" | jq -r '.lead_id    // empty')"
s2="$(echo "$R2"  | jq -r '.crm_status   // empty')"

[ "$s2" = "ok" ]         && ok "sub2 crm_status = ok"                      || no "sub2 crm_status = '$s2'"
[ "$id2" = "$id1" ]      && ok "same crmContactId ($id2) — no new contact" || no "crmContactId changed: $id1 -> $id2"
[ "$lead2" != "$lead1" ] && ok "new leads row ($lead2)"                    || no "lead_id unchanged — expected one row per submission"

if   [ "$a2" = "updated" ]; then
  ok "sub2 action = updated"
elif [ "$a2" = "created" ] && [ "$id2" = "$id1" ]; then
  ok "sub2 action = created but same id (409 fallback — Search API lag; raise INDEX_WAIT for a clean 'updated')"
else
  no "sub2 action = '$a2' with id $id2 (want 'updated', or 'created' with the same id)"
fi
echo

# --- read the contact back from HubSpot ----------------------------------
echo "== contact read-back (GET /crm/v3/objects/contacts/$id2) =="
C="$(hs_contact "$id2")"
echo "$C" | jq '.properties | {interested_solution, inquiry_message, thunder_utm_source, thunder_lead_source}' 2>/dev/null || echo "$C"
is="$(echo "$C" | jq -r '.properties.interested_solution // empty')"
im="$(echo "$C" | jq -r '.properties.inquiry_message     // empty')"
us="$(echo "$C" | jq -r '.properties.thunder_utm_source  // empty')"

[ "$is" = "thunder_care" ]         && ok "interested_solution = thunder_care (last write wins)"   || no "interested_solution = '$is' (want thunder_care)"
[ "$im" = "update test - second" ] && ok "inquiry_message = last write"                           || no "inquiry_message = '$im' (want 'update test - second')"
[ "$us" = "facebook" ]             && ok "thunder_utm_source = facebook (FIRST touch kept, D-04)" || no "thunder_utm_source = '$us' (want facebook — first-touch merge failed)"
echo

# --- duplicate check ----------------------------------------------------
echo "== duplicate check (search contacts by email) =="
n="$(hs_email_count)"
[ "$n" = "1" ] && ok "search by email -> 1 result (no duplicate)" || no "search by email -> $n results (want 1)"
echo

printf 'result: \033[32m%d passed\033[0m, \033[31m%d failed\033[0m\n' "$pass" "$fail"
[ "$fail" -eq 0 ]

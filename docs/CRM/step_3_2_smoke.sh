#!/usr/bin/env bash
# Step 3.2 — HubSpot Contact upsert smoke test (TC-3.2-01..07)
#
# Runs against a local `pnpm dev` server. Keep the `pnpm dev` terminal
# visible while this runs — the [crm:hubspot:*] / [crm:lead] logs there are
# part of the evidence (drop-log = TC-3.2-07, "upsert failed — <reason>" =
# why a call failed).
#
# Usage:
#   docs/CRM/step_3_2_smoke.sh
#   BASE_URL=http://localhost:3001 docs/CRM/step_3_2_smoke.sh
#   EMAIL=poc-known@example.com    docs/CRM/step_3_2_smoke.sh   # reuse an email
#   INDEX_WAIT=60                  docs/CRM/step_3_2_smoke.sh   # slower indexing

set -u

BASE_URL="${BASE_URL:-http://localhost:3000}"
ENV_FILE="${ENV_FILE:-.env}"
EMAIL="${EMAIL:-poc-$(date +%s)@example.com}"
INDEX_WAIT="${INDEX_WAIT:-35}"

pass=0
fail=0
ok()   { printf '  \033[32mPASS\033[0m %s\n' "$1"; pass=$((pass + 1)); }
no()   { printf '  \033[31mFAIL\033[0m %s\n' "$1"; fail=$((fail + 1)); }
info() { printf '  \033[36m*\033[0m %s\n' "$1"; }

command -v jq >/dev/null || { echo "jq not installed"; exit 1; }
curl -sS -o /dev/null "$BASE_URL" 2>/dev/null \
  || { echo "server not reachable at $BASE_URL — start it with: pnpm dev"; exit 1; }

# ---------------------------------------------------------------------------
echo "== TC-3.2-01  Service Key authenticates against HubSpot =="
raw="$(grep -E '^HUBSPOT_SERVICE_KEY=' "$ENV_FILE" 2>/dev/null | head -1 | cut -d= -f2-)"
KEY="$(printf '%s' "$raw" | tr -d '\042\047[:space:]')"   # strip " ' and whitespace
if [ -z "$KEY" ]; then
  no "HUBSPOT_SERVICE_KEY not found in $ENV_FILE"
else
  code="$(curl -sS -o /dev/null -w '%{http_code}' \
    "https://api.hubapi.com/crm/v3/objects/contacts?limit=1" \
    -H "Authorization: Bearer $KEY")"
  case "$code" in
    200) ok "HubSpot direct GET -> 200 (token valid)" ;;
    401) no "HubSpot direct GET -> 401 (token bad / expired / rotated — get a fresh one from PM)" ;;
    403) no "HubSpot direct GET -> 403 (token valid but missing a scope)" ;;
    *)   no "HubSpot direct GET -> $code" ;;
  esac
fi
echo

# ---------------------------------------------------------------------------
post_lead() { # $1 = interested slug   $2 = inquiry_message
  curl -sS "$BASE_URL/api/crm/lead" -H 'content-type: application/json' -d '{
    "first_name":"Somchai","last_name":"Prasert","company_name":"ABC Company",
    "position":"IT Manager","mobile":"0811111111","email":"'"$EMAIL"'",
    "interested_solutions":["'"$1"'"],"inquiry_message":"'"$2"'",
    "qualification":{"screen_count":"21-50","usage_type":"multi-branch"},
    "consent":{"status":"granted","purpose":"sales_contact","source":"website",
               "timestamp":"2026-09-04T10:00:00+07:00"},
    "acquisition":{"source":"website","medium":"organic","campaign":null,
      "utm_source":"facebook","utm_medium":"cpc","utm_campaign":"thunderone_poc",
      "landing_page":"/th"}}'
}

patch_channel() { # $1 = lead_id   $2 = channel
  curl -sS -X PATCH "$BASE_URL/api/crm/lead" -H 'content-type: application/json' \
    -d '{"lead_id":"'"$1"'","channel":"'"$2"'"}'
}

echo "== TC-3.2-02 / 05 / 07  new email -> create =="
info "email: $EMAIL"
R1="$(post_lead "digital-signage" "first submission")"
echo "$R1" | jq . 2>/dev/null || echo "$R1"
p1="$(echo "$R1"  | jq -r '.provider     // empty')"
a1="$(echo "$R1"  | jq -r '.action       // empty')"
id1="$(echo "$R1" | jq -r '.crmContactId // empty')"
s1="$(echo "$R1"  | jq -r '.crm_status   // empty')"
lead1="$(echo "$R1" | jq -r '.lead_id    // empty')"

[ "$p1" = "hubspot" ]                  && ok "provider = hubspot"          || no "provider = '$p1' (want hubspot)"
[ "$a1" = "created" ]                  && ok "action = created"            || no "action = '$a1' (email may already exist)"
{ [ -n "$id1" ] && [ "$id1" != "null" ]; } && ok "crmContactId = $id1 (TC-05)" || no "crmContactId is null"
[ "$s1" = "ok" ]                       && ok "crm_status = ok"             || no "crm_status = '$s1' — read the pnpm dev log: '[crm:lead] upsert failed — <reason>'"
info "lead_id = $lead1"
info "TC-07: pnpm dev log should show '[crm:hubspot:mapper] dropped N ... (kept in canonical): thunder_consent_*, thunder_utm_medium, ...'"
echo

if [ "$s1" != "ok" ]; then
  printf '\033[31mstopping — CRM create failed. fix token/scope, restart pnpm dev, re-run.\033[0m\n'
  exit 1
fi

echo "== waiting ${INDEX_WAIT}s for HubSpot Search API indexing =="
sleep "$INDEX_WAIT"
echo

echo "== TC-3.2-03 / 04  same email -> update, no duplicate =="
R2="$(post_lead "thunder-care" "second submission")"
echo "$R2" | jq . 2>/dev/null || echo "$R2"
a2="$(echo "$R2"  | jq -r '.action       // empty')"
id2="$(echo "$R2" | jq -r '.crmContactId // empty')"
s2="$(echo "$R2"  | jq -r '.crm_status   // empty')"

[ "$a2" = "updated" ] && ok "action = updated (found by email)"        || no "action = '$a2' (want updated — raise INDEX_WAIT if indexing lag)"
[ "$id2" = "$id1" ]   && ok "same crmContactId ($id2) — no duplicate"  || no "crmContactId changed: $id1 -> $id2"
[ "$s2" = "ok" ]      && ok "crm_status = ok"                          || no "crm_status = '$s2'"
echo

echo "== channel second-write  PATCH /api/crm/lead (lead_id, channel=line) =="
RC="$(patch_channel "$lead1" "line")"
echo "$RC" | jq . 2>/dev/null || echo "$RC"
[ "$(echo "$RC" | jq -r '.crm_status // empty')" = "ok" ] && ok "channel patch crm_status = ok" \
  || no "channel patch crm_status = '$(echo "$RC" | jq -r '.crm_status // empty')'"
if [ -n "$KEY" ]; then
  pc="$(curl -sS "https://api.hubapi.com/crm/v3/objects/contacts/$id2?properties=preferred_contact_channel,screen_count,usage_type" \
    -H "Authorization: Bearer $KEY" | jq -r '.properties.preferred_contact_channel // empty')"
  [ "$pc" = "line" ] && ok "preferred_contact_channel = line (read back from HubSpot)" \
    || no "preferred_contact_channel = '$pc' (want line)"
fi
echo

echo "== manual checks =="
info "screen_count / usage_type on the contact should read '21–50' / 'multi_branch' (portal option labels)"
info "TC-3.2-03  HubSpot -> Contacts -> $EMAIL : firstname/lastname/email/mobilephone/jobtitle/company + custom props; interested_solution should be 'thunder_care' after the update (last write wins)"
info "TC-3.2-06  Supabase SQL:"
info "   select id, crm_contact_id, canonical->>'email' from leads where canonical->>'email' = '$EMAIL' order by created_at desc;"
info "   -> crm_contact_id should equal $id1"
echo

printf 'result: \033[32m%d passed\033[0m, \033[31m%d failed\033[0m\n' "$pass" "$fail"
[ "$fail" -eq 0 ]

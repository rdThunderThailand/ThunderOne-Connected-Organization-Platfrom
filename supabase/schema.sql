-- === Step 0.12.6 — Website lead <-> LINE identity store ===
--
-- Brief: docs/CRM/LineOA/Step_0_12_5_to_0_12_6_Dev_Brief.md (§4.1, §4.2, §4.6, §6)
--
-- HOW TO APPLY (PoC — no migration tooling):
--   1. Supabase Dashboard -> SQL Editor -> paste this file -> Run.
--   2. Dashboard -> Project Settings -> API -> "Exposed schemas" ->
--      add `line_user`  (PostgREST / supabase-js reject a schema that is
--      not exposed; the server client pins db.schema = "line_user" —
--      src/features/db/client.ts).
--
-- SECURITY: every write comes from a backend route handler using
-- SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS. RLS is switched on with
-- NO policies so the anon key — public by design — gets zero access to the
-- PII in `leads.canonical`.

create schema if not exists line_user;

-- gen_random_uuid()
create extension if not exists pgcrypto;

-- One row per Talk-to-us / Request Demo submission (brief §4.1). `canonical`
-- is the exact payload POST /api/crm/lead validated, so the lead_id always
-- points back to it.
create table if not exists line_user.leads (
  id                    uuid        primary key default gen_random_uuid(),
  canonical             jsonb       not null,
  crm_contact_id        text,                    -- from the CRM connector; null if that upsert failed
  line_user_id          text,                    -- verified LINE `sub`; null until linked
  line_identity_status  text        not null default 'unlinked'
                          check (line_identity_status in ('unlinked', 'linked')),
  linked_at             timestamptz,
  summary_delivered_at  timestamptz,             -- set when the Step 0.11 push succeeds (brief §6 / decision 5a)
  created_at            timestamptz not null default now()
);

-- Opaque, single-use link tokens (decision 2a). The raw token never lands
-- in the table — only sha256(token). Expiry + one-time use are both
-- enforced by the conditional UPDATE in POST /api/line/link-lead.
create table if not exists line_user.lead_link_tokens (
  token_hash    text        primary key,         -- sha256(raw token), lowercase hex
  lead_id       uuid        not null references line_user.leads (id) on delete cascade,
  line_summary  jsonb       not null,            -- LineLeadSummaryInput — the summary text is rebuilt from this at redeem time
  expires_at    timestamptz not null,
  consumed_at   timestamptz,
  created_at    timestamptz not null default now()
);

create index if not exists lead_link_tokens_lead_id_idx
  on line_user.lead_link_tokens (lead_id);

alter table line_user.leads            enable row level security;
alter table line_user.lead_link_tokens enable row level security;

// === Supabase admin client (server-only) — Step 0.12.6 ===
//
// Backend routes use this to persist the Website lead <-> LINE identity
// mapping (Postgres schema `line_user`, see supabase/schema.sql). It
// authenticates with SUPABASE_SERVICE_ROLE_KEY, which BYPASSES RLS — so
// this module must only ever be imported by route handlers running on the
// server. The key is not `NEXT_PUBLIC_`, is never logged, and never
// reaches the client bundle.
//
// `db.schema` pins every query to the `line_user` schema; that schema must
// also be added under Dashboard -> Project Settings -> API -> "Exposed
// schemas" or PostgREST rejects the request.

import { createClient } from "@supabase/supabase-js";

function build() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createClient(url, serviceRoleKey, {
    db: { schema: "line_user" },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let cached: ReturnType<typeof build> | null = null;

/** Lazily build (and memoize) the service-role client. Throws if the env is missing. */
export function getSupabaseAdmin(): ReturnType<typeof build> {
  cached ??= build();
  return cached;
}

/** True when both Supabase env vars are present — lets a route fail fast with a clear error. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

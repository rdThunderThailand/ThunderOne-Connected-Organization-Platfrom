import type { UseCaseDetailData } from "../types";
import { ANNOUNCE_ALL_EMPLOYEES_DATA } from "./announceAllEmployees";

// Registry mapping slug -> structural data + i18n namespace. page.tsx looks
// up the slug here; unregistered slugs (any of the other USE_CASES entries
// that don't have authored detail content yet) fall through to notFound().
// Adding a new use case detail page later means adding one entry here plus
// its own data/<slug>.ts and messages/{th,en}/use-case-detail-<slug>.json —
// no new components or routes required.
export const USE_CASE_DETAIL_REGISTRY: Record<string, UseCaseDetailData> = {
  "announce-all-employees": ANNOUNCE_ALL_EMPLOYEES_DATA,
};

export function getUseCaseDetailData(slug: string): UseCaseDetailData | undefined {
  return USE_CASE_DETAIL_REGISTRY[slug];
}

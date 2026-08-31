// === LINE webhook signature verification ===
//
// LINE signs every webhook request with HMAC-SHA256 over the raw request
// body, keyed by the channel secret, base64-encoded in the
// `x-line-signature` header (docs/CRM/LineOA/lineOA.md §3: "Verify request
// signature ด้วย Channel Secret ก่อนประมวลผล").
//
// Verify BEFORE parsing the body — the signature covers the exact bytes
// LINE sent, so it must be checked against `request.text()`, not a
// re-serialized object.

import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyLineSignature(
  rawBody: string,
  signature: string | null | undefined,
  channelSecret: string,
): boolean {
  if (!signature || !channelSecret) return false;

  const expected = createHmac("sha256", channelSecret)
    .update(rawBody, "utf8")
    .digest();

  let received: Buffer;
  try {
    received = Buffer.from(signature, "base64");
  } catch {
    return false;
  }

  // timingSafeEqual throws on a length mismatch — guard first.
  return received.length === expected.length && timingSafeEqual(received, expected);
}

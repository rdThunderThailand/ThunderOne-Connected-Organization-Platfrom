// === Verify a LIFF ID token server-side (Step 0.12 §10, §12) ===
//
// The LIFF page sends the ID token it got from `liff.getIDToken()`. §12:
// "อย่าเชื่อ userId ที่ client ส่งมาโดยตรง; ให้ใช้ verified LINE ID token" —
// so we never take a client-sent userId, we POST the token to LINE and let
// LINE validate the signature + expiry + audience.
//
//   POST https://api.line.me/oauth2/v2.1/verify   (form-urlencoded)
//     id_token   = <the JWT from liff.getIDToken()>
//     client_id  = LINE_LOGIN_CHANNEL_ID  (the LIFF app's LINE Login channel)
//
// 200 → { iss, sub, aud, exp, iat, name?, picture?, email? }
//   `sub` is the LINE userId. Because the LINE Login channel and the
//   Messaging API OA sit under the same provider ("ThunderOne"), that
//   `sub` equals the OA webhook's `source.userId`, so it is a valid
//   push target for the Step 0.11 summary.
//
// Server-only. Do NOT log the id_token (§12).

const LINE_VERIFY_URL = "https://api.line.me/oauth2/v2.1/verify";

export type VerifyLineIdTokenResult =
  | { ok: true; userId: string }
  | { ok: false; status: number; detail: string };

function clientId(): string {
  const id = process.env.LINE_LOGIN_CHANNEL_ID?.trim();
  if (!id) throw new Error("LINE_LOGIN_CHANNEL_ID is not set");
  return id;
}

export async function verifyLineIdToken(
  idToken: string,
): Promise<VerifyLineIdTokenResult> {
  const aud = clientId();

  let res: Response;
  try {
    res = await fetch(LINE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ id_token: idToken, client_id: aud }),
    });
  } catch (error) {
    return {
      ok: false,
      status: 0,
      detail: error instanceof Error ? error.message : String(error),
    };
  }

  const text = await res.text();
  if (!res.ok) {
    // LINE returns { error, error_description } — safe to surface, carries
    // no secret.
    return { ok: false, status: res.status, detail: text };
  }

  let payload: { sub?: unknown; aud?: unknown };
  try {
    payload = JSON.parse(text) as { sub?: unknown; aud?: unknown };
  } catch {
    return { ok: false, status: res.status, detail: "verify: non-JSON response" };
  }

  // LINE already enforces aud === client_id and exp — re-check aud
  // defensively so a misrouted token can never link the wrong account.
  if (payload.aud !== aud) {
    return { ok: false, status: res.status, detail: "verify: aud mismatch" };
  }
  if (typeof payload.sub !== "string" || payload.sub.length === 0) {
    return { ok: false, status: res.status, detail: "verify: missing sub" };
  }

  return { ok: true, userId: payload.sub };
}

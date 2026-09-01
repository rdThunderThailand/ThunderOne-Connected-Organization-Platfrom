// === Outbound LINE Messaging API calls ===
//
// BEYOND round-1 scope — docs/CRM/LineOA/lineOA 31aug.md §10 defers
// auto-reply / bot logic. Added so the backend can send a message to a
// known LINE userId (push) or answer an inbound event (reply). `push` is
// what Step 0.11 (lineOA 1sep.md) uses for the Talk-to-us summary.
//
// Uses LINE_CHANNEL_ACCESS_TOKEN — server-only, never expose to the client
// (§6). `.trim()` tolerates a stray space / newline in the env value.

const LINE_MESSAGING_API = "https://api.line.me/v2/bot";

/** One LINE message object, e.g. `{ type: "text", text: "hi" }`. */
export type LineMessage = { type: string; [key: string]: unknown };

export type LineSendResult =
  | { ok: true }
  | { ok: false; status: number; detail: string };

function accessToken(): string {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("LINE_CHANNEL_ACCESS_TOKEN is not set");
  return token;
}

async function post(path: string, body: unknown): Promise<LineSendResult> {
  let res: Response;
  try {
    res = await fetch(`${LINE_MESSAGING_API}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken()}`,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    return {
      ok: false,
      status: 0,
      detail: error instanceof Error ? error.message : String(error),
    };
  }

  if (res.ok) return { ok: true };
  return { ok: false, status: res.status, detail: await res.text() };
}

/**
 * Push up to 5 messages to a user / group / room by id. Costs against the
 * monthly push quota. `to` is the LINE userId (e.g. from a webhook event's
 * `source.userId`).
 */
export function pushLineMessages(
  to: string,
  messages: LineMessage[],
): Promise<LineSendResult> {
  return post("/message/push", { to, messages });
}

/**
 * Reply to an inbound event with up to 5 messages, using the event's
 * `replyToken`. Free, but the token is single-use and expires ~1 minute
 * after the event.
 */
export function replyLineMessages(
  replyToken: string,
  messages: LineMessage[],
): Promise<LineSendResult> {
  return post("/message/reply", { replyToken, messages });
}

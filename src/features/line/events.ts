// === LINE webhook payload → the few fields the PoC logs ===
//
// Round-1 scope only needs event type + LINE userId + message text +
// timestamp (docs/CRM/LineOA/lineOA 31aug.md §3, §7). This is a LENIENT reader,
// not a validation gate: unknown keys and unknown event types pass
// through, they just collapse to `unhandled`.

import { z } from "zod";

const lineSourceSchema = z
  .object({
    type: z.string().optional(),
    userId: z.string().optional(),
  })
  .passthrough();

const lineEventSchema = z
  .object({
    type: z.string().optional(),
    timestamp: z.number().optional(),
    replyToken: z.string().optional(),
    source: lineSourceSchema.optional(),
    message: z
      .object({
        type: z.string().optional(),
        text: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

const lineWebhookBodySchema = z
  .object({
    destination: z.string().optional(),
    events: z.array(lineEventSchema).default([]),
  })
  .passthrough();

type RawLineEvent = z.infer<typeof lineEventSchema>;

/** What the PoC keeps from one webhook event, ready to log. */
export type LineEventSummary =
  | {
      kind: "follow";
      userId: string | null;
      replyToken: string | null;
      timestamp: number | null;
    }
  | {
      kind: "message:text";
      userId: string | null;
      replyToken: string | null;
      text: string;
      timestamp: number | null;
    }
  | {
      kind: "unhandled";
      type: string;
      messageType: string | null;
      userId: string | null;
      timestamp: number | null;
    };

function toSummary(event: RawLineEvent): LineEventSummary {
  const userId = event.source?.userId ?? null;
  const replyToken = event.replyToken ?? null;
  const timestamp = event.timestamp ?? null;

  if (event.type === "follow") {
    return { kind: "follow", userId, replyToken, timestamp };
  }

  if (event.type === "message" && event.message?.type === "text") {
    return {
      kind: "message:text",
      userId,
      replyToken,
      text: event.message.text ?? "",
      timestamp,
    };
  }

  return {
    kind: "unhandled",
    type: event.type ?? "unknown",
    messageType: event.message?.type ?? null,
    userId,
    timestamp,
  };
}

/**
 * Extract the loggable summary of every event in a LINE webhook body.
 * Returns `[]` for a body that does not match the expected shape (e.g.
 * the LINE console "Verify" ping, which carries an empty `events` array).
 */
export function parseLineWebhookEvents(payload: unknown): LineEventSummary[] {
  const parsed = lineWebhookBodySchema.safeParse(payload);
  if (!parsed.success) return [];
  return parsed.data.events.map(toSummary);
}

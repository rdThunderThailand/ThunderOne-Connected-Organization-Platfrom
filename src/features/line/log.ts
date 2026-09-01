// === PoC audit line for a received LINE event ===
//
// docs/CRM/LineOA/lineOA 31aug.md §3: "Log เฉพาะข้อมูลที่จำเป็นสำหรับ PoC เช่น
// event type, LINE userId, message text, timestamp โดยไม่ log
// secret/token". §9 Definition of Done: prove the backend can read the
// LINE userId and the message text.
//
// TEMPORARY (§15): plain `console`, and the raw message text is logged
// verbatim. Swap for a structured audit log — and drop or hash the text —
// before this endpoint handles real user conversations.

import type { LineEventSummary } from "./events";

const TAG = "[line:webhook]";

export function logLineEvent(event: LineEventSummary): void {
  const ts = event.timestamp ?? "-";

  switch (event.kind) {
    case "follow":
      console.info(`${TAG} follow userId=${event.userId ?? "-"} ts=${ts}`);
      return;
    case "message:text":
      console.info(
        `${TAG} message:text userId=${event.userId ?? "-"} ts=${ts} ` +
          `text=${JSON.stringify(event.text)}`,
      );
      return;
    case "unhandled":
      console.info(
        `${TAG} unhandled type=${event.type} ` +
          `messageType=${event.messageType ?? "-"} ` +
          `userId=${event.userId ?? "-"} ts=${ts}`,
      );
      return;
  }
}

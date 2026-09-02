// === "คุยผ่าน LINE" → LIFF Talk-to-us hand-off (Step 0.12.6) ===
//
// For Digital Signage the wizard mints a one-time `lead_token` bound to the
// persisted lead (POST /api/line/lead-token) and sends the customer to the
// LIFF Endpoint page with it. That page verifies the LINE identity and
// pushes the §5 summary to the real user — no hardcoded userId
// (docs/CRM/LineOA/Step_0_12_5_to_0_12_6_Dev_Brief.md §4).

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;

/** False until NEXT_PUBLIC_LIFF_ID is set (LIFF app created + env deployed). */
export const isLiffConfigured = Boolean(LIFF_ID);

export function liffTalkToUsUrl(leadToken: string): string {
  return `https://liff.line.me/${LIFF_ID}?lead_token=${encodeURIComponent(leadToken)}`;
}

type DeferredTab = { settle: (url: string) => void; cancel: () => void };

/**
 * Open a tab NOW (inside the click handler) so the pop-up blocker doesn't
 * kill it after the `await` for the token. `settle(url)` points it at the
 * real URL once the token is back; if the browser blocked the tab, it
 * navigates the current tab instead. `cancel()` closes it on failure.
 */
export function openDeferredTab(): DeferredTab {
  const tab = typeof window !== "undefined" ? window.open("", "_blank") : null;
  return {
    settle: (url) => {
      if (tab && !tab.closed) tab.location.href = url;
      else if (typeof window !== "undefined") window.location.assign(url);
    },
    cancel: () => tab?.close(),
  };
}

// Placeholder for non-Digital-Signage topics — they have no LINE deep link
// yet (out of scope for Step 0.12).
export function openLineOA(): void {
  console.log("[TalkToUs] openLineOA() — non-DS topic, no LINE deep link yet");
}

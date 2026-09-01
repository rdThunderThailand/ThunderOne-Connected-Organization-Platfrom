"use client";

// === LiffTalkToUsClient — the LIFF Endpoint page UI (PoC, Step 0.12) ===
//
// Runs entirely in the LINE in-app browser. Flow (brief step-0.12 §9):
//   1. read `lead_token` from the URL (put there by the website button)
//   2. liff.init() + LINE Login if needed
//   3. get the LINE ID token
//   4. POST { lead_token, id_token } → /api/line/link-lead
//   5. show success / error
//
// `@line/liff` is loaded with a dynamic import so it never touches the
// server bundle. Real init is gated on NEXT_PUBLIC_LIFF_ID — until that env
// var exists (Phase 4) the page renders the `config-missing` state instead
// of throwing.

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export type LiffTalkToUsCopy = {
  heading: string;
  initializing: string;
  loggingIn: string;
  linking: string;
  linkedTitle: string;
  linkedBody: string;
  errorTitle: string;
  errorBody: string;
  missingToken: string;
  configMissing: string;
};

// Inlined at build time by Next (NEXT_PUBLIC_*). Undefined until the LIFF
// app is created in the LINE console and its id is added to the env.
const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;

type Phase =
  | "config-missing"
  | "initializing"
  | "logging-in"
  | "linking"
  | "linked"
  | "error";

export function LiffTalkToUsClient({ copy }: { copy: LiffTalkToUsCopy }) {
  const leadToken = useSearchParams().get("lead_token");
  const [phase, setPhase] = useState<Phase>(
    LIFF_ID ? "initializing" : "config-missing",
  );
  const [detail, setDetail] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // React 18 runs effects twice in dev — the ref keeps the LIFF flow to
    // one pass.
    if (!LIFF_ID || startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;
    const fail = (message: string) => {
      if (cancelled) return;
      setDetail(message);
      setPhase("error");
    };

    void (async () => {
      if (!leadToken) {
        fail(copy.missingToken);
        return;
      }

      try {
        const { default: liff } = await import("@line/liff");
        await liff.init({ liffId: LIFF_ID });

        if (!liff.isLoggedIn()) {
          if (!cancelled) setPhase("logging-in");
          liff.login({ redirectUri: window.location.href });
          return; // browser navigates away to the LINE Login screen
        }

        const idToken = liff.getIDToken();
        if (!idToken) {
          fail("LINE did not return an ID token");
          return;
        }

        if (!cancelled) setPhase("linking");

        // /api/line/link-lead lands in Phase 2. Until then this 404s and the
        // page shows the error state — expected for the stub.
        const res = await fetch("/api/line/link-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead_token: leadToken, id_token: idToken }),
        });

        if (!res.ok) {
          fail(`link-lead responded ${res.status}`);
          return;
        }

        if (!cancelled) setPhase("linked");
      } catch (error) {
        fail(error instanceof Error ? error.message : String(error));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [leadToken, copy.missingToken]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-brand-navy">{copy.heading}</h1>

      {phase === "config-missing" && (
        <p className="text-sm text-slate-500">{copy.configMissing}</p>
      )}
      {phase === "initializing" && <Status text={copy.initializing} />}
      {phase === "logging-in" && <Status text={copy.loggingIn} />}
      {phase === "linking" && <Status text={copy.linking} />}

      {phase === "linked" && (
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-emerald-600">
            {copy.linkedTitle}
          </p>
          <p className="text-sm text-slate-600">{copy.linkedBody}</p>
        </div>
      )}

      {phase === "error" && (
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-rose-600">{copy.errorTitle}</p>
          <p className="text-sm text-slate-600">{copy.errorBody}</p>
          {detail && (
            <p className="mt-2 break-all text-xs text-slate-400">{detail}</p>
          )}
        </div>
      )}
    </main>
  );
}

function Status({ text }: { text: string }) {
  return (
    <p className="flex items-center gap-2 text-sm text-slate-500">
      <span className="h-2 w-2 animate-pulse rounded-full bg-brand-blue" />
      {text}
    </p>
  );
}

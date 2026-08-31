"use client";

// === Talk to us panel: multi-step side panel opened from the Navbar's
// "Talk to us" button (state lives in useTalkToUsStore so the trigger in
// components/layout/Navbar.tsx and this panel don't need prop-drilling).
// Slides in from the right on desktop (clamped width), full-screen on
// mobile. Backdrop click / X / Esc all close it; wizard state resets only
// after the slide-out transition finishes so content doesn't visibly
// change mid-animation. ===

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type TalkToUsStep, useTalkToUsStore } from "@/store/talkToUsStore";
import { ChannelStep } from "./steps/ChannelStep";
import { ConfirmationStep } from "./steps/ConfirmationStep";
import { DetailsStep } from "./steps/DetailsStep";
import { QuestionsStep } from "./steps/QuestionsStep";
import { TopicStep } from "./steps/TopicStep";
import { ProgressDots } from "./ui/ProgressDots";
import { useFocusTrap } from "./useFocusTrap";

const ANIMATION_MS = 300;
const PROGRESS_TOTAL = 4;

// Confirmation has no dots.
const PROGRESS_INDEX: Partial<Record<TalkToUsStep, number>> = {
  topic: 0,
  questions: 1,
  details: 2,
  channel: 3,
};

export function TalkToUsPanel() {
  const t = useTranslations("TalkToUsPanel");
  const isOpen = useTalkToUsStore((s) => s.isOpen);
  const step = useTalkToUsStore((s) => s.step);
  const selectedTopic = useTalkToUsStore((s) => s.selectedTopic);
  const close = useTalkToUsStore((s) => s.close);
  const reset = useTalkToUsStore((s) => s.reset);
  const back = useTalkToUsStore((s) => s.back);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const containerRef = useFocusTrap(isOpen);

  // Adjust mount/visible synchronously during render when `isOpen` changes
  // (React's "adjusting state when a prop changes" pattern) instead of in
  // an effect, so opening/closing starts on the same commit rather than
  // one render later.
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setMounted(true);
    } else {
      setVisible(false);
    }
  }

  // Slide in on the frame after mounting — the panel needs a real first
  // paint at translate-x-full before switching to translate-x-0, or the
  // browser won't animate the transition.
  useEffect(() => {
    if (!mounted || !isOpen || visible) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [mounted, isOpen, visible]);

  // Unmount and reset the wizard only after the slide-out transition ends,
  // so the panel's content doesn't visibly change mid-animation.
  useEffect(() => {
    if (isOpen || !mounted) return;
    closeTimeoutRef.current = setTimeout(() => {
      setMounted(false);
      reset();
    }, ANIMATION_MS);
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [isOpen, mounted, reset]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (!mounted) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mounted]);

  if (!mounted) return null;

  const showBack = step === "questions" || step === "details";
  const showProgress = step in PROGRESS_INDEX;

  const title =
    step === "questions" && selectedTopic
      ? t(`topic.items.${selectedTopic}.label`)
      : step === "details"
        ? t("details.title")
        : t("topic.title");

  const subtitle =
    step === "topic"
      ? t("topic.subtitle")
      : step === "details"
        ? t("details.subtitle")
        : step === "channel"
          ? t("channel.subtitle")
          : null;

  return (
    <div className="fixed inset-0 z-50" aria-hidden={!isOpen}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("topic.title")}
        tabIndex={-1}
        className={`absolute inset-y-0 right-0 flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out md:w-[clamp(380px,20vw,440px)] ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          {showBack ? (
            <button
              type="button"
              onClick={() => back()}
              aria-label={t("back")}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <span className="w-8 shrink-0" />
          )}

          <h2 className="flex-1 truncate text-base font-bold text-brand-navy">{title}</h2>

          <button
            type="button"
            onClick={close}
            aria-label={t("close")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {subtitle && <p className="px-5 pt-3 text-sm text-slate-500">{subtitle}</p>}

        {showProgress && (
          <div className="px-5 pt-4">
            <ProgressDots total={PROGRESS_TOTAL} current={PROGRESS_INDEX[step] ?? 0} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === "topic" && <TopicStep />}
          {step === "questions" && <QuestionsStep />}
          {step === "details" && <DetailsStep />}
          {step === "channel" && <ChannelStep />}
          {step === "confirmation" && <ConfirmationStep />}
        </div>
      </div>
    </div>
  );
}

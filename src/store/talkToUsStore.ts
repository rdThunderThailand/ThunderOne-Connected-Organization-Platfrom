import { create } from "zustand";
import { openLineOA } from "@/components/talk-to-us/lineOA";
import { buildLeadPayload, type LeadDraft } from "@/components/talk-to-us/leadPayload";
import type { TopicKey } from "@/components/talk-to-us/types";

export type TalkToUsStep = "topic" | "questions" | "details" | "channel" | "confirmation";
export type TalkToUsChannel = "line" | "callback";
export type SubmitStatus = "idle" | "submitting" | "error";

// String fields collected on the `details` step (question.md ขั้นที่ 3).
// `answers` (step-2 discovery) and `consent` are handled separately.
type DetailField =
  | "position"
  | "industry"
  | "orgSize"
  | "firstName"
  | "lastName"
  | "companyName"
  | "email"
  | "mobile"
  | "preferredTime";

type TalkToUsState = {
  isOpen: boolean;
  step: TalkToUsStep;
  selectedTopic: TopicKey | null;
  // Step-2 answers, one entry per question id. Always an array — a
  // single-select question just holds a 1-element array.
  answers: Record<string, string[]>;

  // details step
  position: string;
  industry: string;
  orgSize: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  mobile: string;
  consent: boolean;
  preferredTime: string;

  // submit
  submitStatus: SubmitStatus;
  crmContactId: string | null; // kept for logging/debug, not shown in the UI

  // channel
  selectedChannel: TalkToUsChannel | null;
};

type TalkToUsActions = {
  open: () => void;
  // Open already scoped to a topic (per-solution "Talk to us" CTAs) —
  // skips the topic picker and lands straight on that topic's questions.
  openWithTopic: (topicKey: TopicKey) => void;
  close: () => void;
  reset: () => void;
  selectTopic: (topicKey: TopicKey) => void;
  toggleAnswer: (questionId: string, value: string, multi: boolean) => void;
  setDetail: (field: DetailField, value: string) => void;
  setConsent: (value: boolean) => void;
  goToStep: (step: TalkToUsStep) => void;
  back: () => void;
  // Validate-free: DetailsStep gates required fields; this just fires the
  // POST and advances to `channel` on success, or flips to "error".
  submitLead: () => Promise<void>;
  chooseLine: () => void;
  chooseCallback: () => void;
};

const initialState: TalkToUsState = {
  isOpen: false,
  step: "topic",
  selectedTopic: null,
  answers: {},
  position: "",
  industry: "",
  orgSize: "",
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  mobile: "",
  consent: false,
  preferredTime: "",
  submitStatus: "idle",
  crmContactId: null,
  selectedChannel: null,
};

// Linear flow, so the step to go back to can just be looked up rather than
// tracked as a history stack. `channel` has no entry — the lead is already
// in the CRM by then, so the panel hides Back there.
const PREVIOUS_STEP: Partial<Record<TalkToUsStep, TalkToUsStep>> = {
  questions: "topic",
  details: "questions",
};

export const useTalkToUsStore = create<TalkToUsState & TalkToUsActions>((set, get) => ({
  ...initialState,

  open: () => set({ isOpen: true }),
  openWithTopic: (topicKey) =>
    set({ ...initialState, isOpen: true, selectedTopic: topicKey, step: "questions" }),
  close: () => set({ isOpen: false }),
  reset: () => set(initialState),

  selectTopic: (topicKey) => set({ selectedTopic: topicKey, answers: {}, step: "questions" }),

  toggleAnswer: (questionId, value, multi) =>
    set((s) => {
      const current = s.answers[questionId] ?? [];
      let next: string[];
      if (multi) {
        next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
      } else {
        next = current[0] === value ? [] : [value];
      }
      return { answers: { ...s.answers, [questionId]: next } };
    }),

  setDetail: (field, value) => set({ [field]: value } as Partial<TalkToUsState>),
  setConsent: (value) => set({ consent: value }),

  goToStep: (step) => set({ step }),

  back: () => {
    const previous = PREVIOUS_STEP[get().step];
    if (previous) set({ step: previous });
  },

  submitLead: async () => {
    const s = get();
    if (!s.selectedTopic || s.submitStatus === "submitting") return;

    set({ submitStatus: "submitting" });

    const draft: LeadDraft = {
      selectedTopic: s.selectedTopic,
      answers: s.answers,
      position: s.position,
      industry: s.industry,
      orgSize: s.orgSize,
      firstName: s.firstName,
      lastName: s.lastName,
      companyName: s.companyName,
      email: s.email,
      mobile: s.mobile,
      consent: s.consent,
      preferredTime: s.preferredTime,
    };

    try {
      const res = await fetch("/api/crm/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildLeadPayload(draft)),
      });
      const json = (await res.json().catch(() => null)) as
        | { ok?: boolean; crmContactId?: string }
        | null;

      if (res.ok && json?.ok) {
        set({
          submitStatus: "idle",
          crmContactId: json.crmContactId ?? null,
          step: "channel",
        });
      } else {
        set({ submitStatus: "error" });
      }
    } catch {
      set({ submitStatus: "error" });
    }
  },

  chooseLine: () => {
    openLineOA();
    set({ selectedChannel: "line", step: "confirmation" });
  },

  chooseCallback: () => set({ selectedChannel: "callback", step: "confirmation" }),
}));

import { create } from "zustand";
import { openLineOA } from "@/components/talk-to-us/lineOA";
import type { TopicKey } from "@/components/talk-to-us/types";

export type TalkToUsStep = "topic" | "questions" | "channel" | "callback" | "confirmation";
export type TalkToUsChannel = "line" | "callback";

type TalkToUsState = {
  isOpen: boolean;
  step: TalkToUsStep;
  selectedTopic: string | null;
  answers: Record<string, string>;
  selectedChannel: TalkToUsChannel | null;
  contactPhone: string;
  preferredTime: string | null;
};

type TalkToUsActions = {
  open: () => void;
  // Open already scoped to a topic (per-solution "Talk to us" CTAs) —
  // skips the topic picker and lands straight on that topic's questions.
  openWithTopic: (topicKey: TopicKey) => void;
  close: () => void;
  reset: () => void;
  selectTopic: (topicKey: string) => void;
  setAnswer: (questionId: string, value: string) => void;
  goToStep: (step: TalkToUsStep) => void;
  back: () => void;
  chooseLine: () => void;
  chooseCallback: () => void;
  submitCallback: (phone: string, preferredTime: string | null) => void;
};

const initialState: TalkToUsState = {
  isOpen: false,
  step: "topic",
  selectedTopic: null,
  answers: {},
  selectedChannel: null,
  contactPhone: "",
  preferredTime: null,
};

// Linear flow, so the step to go back to can just be looked up rather than
// tracked as a history stack. "callback" is a sub-step of "channel" (see
// ChannelStep's "ฝากเบอร์ติดต่อ" card — TODO: confirm this sub-step with
// design, the source design only shows the LINE/callback choice screen).
const PREVIOUS_STEP: Partial<Record<TalkToUsStep, TalkToUsStep>> = {
  questions: "topic",
  channel: "questions",
  callback: "channel",
};

export const useTalkToUsStore = create<TalkToUsState & TalkToUsActions>((set, get) => ({
  ...initialState,

  open: () => set({ isOpen: true }),
  openWithTopic: (topicKey) =>
    set({ isOpen: true, selectedTopic: topicKey, step: "questions", answers: {} }),
  close: () => set({ isOpen: false }),
  reset: () => set(initialState),

  selectTopic: (topicKey) => set({ selectedTopic: topicKey, step: "questions" }),

  setAnswer: (questionId, value) =>
    set((s) => ({ answers: { ...s.answers, [questionId]: value } })),

  goToStep: (step) => set({ step }),

  back: () => {
    const previous = PREVIOUS_STEP[get().step];
    if (previous) set({ step: previous });
  },

  chooseLine: () => {
    // TODO: connect to backend API — POST { selectedTopic, answers, selectedChannel: "line" }
    console.log("[TalkToUs] submit (line)", {
      selectedTopic: get().selectedTopic,
      answers: get().answers,
      selectedChannel: "line",
    });
    openLineOA();
    set({ selectedChannel: "line", step: "confirmation" });
  },

  chooseCallback: () => set({ selectedChannel: "callback", step: "callback" }),

  submitCallback: (phone, preferredTime) => {
    // TODO: connect to backend API — POST { selectedTopic, answers, selectedChannel: "callback", contactPhone, preferredTime }
    console.log("[TalkToUs] submit (callback)", {
      selectedTopic: get().selectedTopic,
      answers: get().answers,
      selectedChannel: "callback",
      contactPhone: phone,
      preferredTime,
    });
    set({ contactPhone: phone, preferredTime, step: "confirmation" });
  },
}));

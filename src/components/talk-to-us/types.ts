export type TopicKey =
  | "digital-signage"
  | "thunder-care"
  | "communication"
  | "asset-intelligence"
  | "not-sure";

export type QuestionConfig = {
  id: string;
  options: string[];
  // When true the option list is a multi-select (question.md marks these
  // "เลือกได้หลายข้อ"). The store keeps every answer as a string[], so a
  // single-select is just a 1-element array — this flag only changes the
  // toggle behaviour and the "choose one / choose any" hint.
  multi?: boolean;
};

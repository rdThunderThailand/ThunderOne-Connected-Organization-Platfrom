// === Hand-drawn flat illustration: a person surrounded by scattered
// communication channels (mail, chat, screen), with a question-mark bubble
// over their head — used by SituationOutcomeSection's "Situation" column.
// No external asset dependency; approximates the reference design's
// character art using plain SVG shapes. ===

export function ConfusedPersonIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-48 w-48" role="img" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="#EFF4FF" />

      <g>
        <circle cx="38" cy="55" r="21" fill="white" stroke="#E2E8F0" strokeWidth="2" />
        <path
          d="M28 49h20v13a2 2 0 0 1-2 2H30a2 2 0 0 1-2-2Z"
          fill="none"
          stroke="#2F5FE0"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M28 50l10 8 10-8" fill="none" stroke="#2F5FE0" strokeWidth="2" strokeLinejoin="round" />
      </g>

      <g>
        <circle cx="168" cy="60" r="21" fill="white" stroke="#E2E8F0" strokeWidth="2" />
        <path
          d="M157 51h22a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-10l-7 6v-6h-5a3 3 0 0 1-3-3V54a3 3 0 0 1 3-3Z"
          fill="#16A34A"
        />
      </g>

      <g>
        <circle cx="42" cy="152" r="21" fill="white" stroke="#E2E8F0" strokeWidth="2" />
        <rect x="31" y="145" width="22" height="15" rx="2" fill="none" stroke="#F59E0B" strokeWidth="2" />
        <line x1="42" y1="160" x2="42" y2="164" stroke="#F59E0B" strokeWidth="2" />
        <line x1="36" y1="164" x2="48" y2="164" stroke="#F59E0B" strokeWidth="2" />
      </g>

      <ellipse cx="103" cy="178" rx="42" ry="10" fill="#E2E8F0" />

      <path
        d="M75 118c0-16 12-28 28-28s28 12 28 28v34a6 6 0 0 1-6 6H81a6 6 0 0 1-6-6Z"
        fill="#0B1B42"
      />

      <path
        d="M70 122c-8 4-13 12-13 20"
        fill="none"
        stroke="#0B1B42"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M136 122c8 4 13 12 13 20"
        fill="none"
        stroke="#0B1B42"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="57" cy="146" r="7" fill="#F4C199" />
      <circle cx="149" cy="146" r="7" fill="#F4C199" />

      <circle cx="103" cy="88" r="26" fill="#F4C199" />
      <circle cx="94" cy="88" r="2.5" fill="#0B1B42" />
      <circle cx="112" cy="88" r="2.5" fill="#0B1B42" />
      <path d="M96 99c3 3 11 3 14 0" fill="none" stroke="#0B1B42" strokeWidth="2" strokeLinecap="round" />

      <circle cx="132" cy="52" r="17" fill="white" stroke="#2F5FE0" strokeWidth="2" />
      <text x="132" y="59" fontSize="20" fontWeight="700" fill="#2F5FE0" textAnchor="middle">
        ?
      </text>
    </svg>
  );
}

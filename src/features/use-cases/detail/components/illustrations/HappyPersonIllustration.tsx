// === Hand-drawn flat illustration: a smiling person giving a thumbs-up,
// with a green checkmark badge — used by SituationOutcomeSection's
// "Outcome" column. Mirrors ConfusedPersonIllustration's plain-SVG
// approach, no external asset dependency. ===

export function HappyPersonIllustration() {
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-48 w-48" role="img" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="#ECFDF5" />

      <ellipse cx="103" cy="178" rx="42" ry="10" fill="#D1FAE5" />

      <path
        d="M75 118c0-16 12-28 28-28s28 12 28 28v34a6 6 0 0 1-6 6H81a6 6 0 0 1-6-6Z"
        fill="#16A34A"
      />

      <path
        d="M70 122c-8 4-13 12-13 20"
        fill="none"
        stroke="#16A34A"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="57" cy="146" r="7" fill="#F4C199" />

      <g>
        <path
          d="M136 96c8 2 13 8 13 16v10"
          fill="none"
          stroke="#16A34A"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <g transform="translate(140,86) rotate(-15)">
          <rect x="-8" y="0" width="16" height="24" rx="7" fill="#F4C199" />
          <rect x="-6" y="-14" width="12" height="18" rx="6" fill="#F4C199" />
        </g>
      </g>

      <circle cx="103" cy="88" r="26" fill="#F4C199" />
      <path d="M92 84a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0" fill="#0B1B42" />
      <path d="M108 84a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0" fill="#0B1B42" />
      <path
        d="M92 96c4 5 12 5 16 0"
        fill="none"
        stroke="#0B1B42"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <circle cx="150" cy="130" r="26" fill="white" stroke="#D1FAE5" strokeWidth="4" />
      <circle cx="150" cy="130" r="19" fill="#16A34A" />
      <path
        d="M141 130l6 6 12-13"
        fill="none"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

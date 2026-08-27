// === Flat cartoon person avatars for the "Who's Involved" section — four
// visually distinct characters (skin tone, hair, attire, accessories) drawn
// as plain SVG, matching the repo's other hand-drawn illustrations. No
// external asset / avatar-service dependency. `variant` (0-3) picks the
// character; it wraps with a tinted circular background of its own. ===

type PersonAvatarProps = {
  variant: number;
  className?: string;
};

type Character = {
  bg: string;
  skin: string;
  skinShade: string;
  hair: string;
  shirt: string;
  hairStyle: "short" | "long" | "buzz" | "bun";
  glasses: boolean;
  beard: boolean;
};

const CHARACTERS: Character[] = [
  // Executive — neat short hair, glasses, navy suit
  {
    bg: "#E9F1FF",
    skin: "#F1C9A5",
    skinShade: "#E0AE86",
    hair: "#2B2B33",
    shirt: "#132a63",
    hairStyle: "short",
    glasses: true,
    beard: false,
  },
  // Communication / HR — long hair, teal top
  {
    bg: "#E6FaF3",
    skin: "#F8D9C0",
    skinShade: "#E7BD9C",
    hair: "#7A4A28",
    shirt: "#0D9488",
    hairStyle: "long",
    glasses: false,
    beard: false,
  },
  // Manager — buzz cut, beard, warm shirt
  {
    bg: "#FFF2E4",
    skin: "#C68A5E",
    skinShade: "#AE754B",
    hair: "#241606",
    shirt: "#B4530F",
    hairStyle: "buzz",
    glasses: false,
    beard: true,
  },
  // Employee — hair bun, purple top
  {
    bg: "#F1ECFE",
    skin: "#8A5A38",
    skinShade: "#734829",
    hair: "#15121C",
    shirt: "#6D33D6",
    hairStyle: "bun",
    glasses: false,
    beard: false,
  },
];

export function PersonAvatar({ variant, className = "" }: PersonAvatarProps) {
  const c = CHARACTERS[variant % CHARACTERS.length];
  const clip = `person-avatar-clip-${variant}`;

  return (
    <svg viewBox="0 0 128 128" className={className} role="img" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <circle cx="64" cy="64" r="64" />
        </clipPath>
      </defs>

      <circle cx="64" cy="64" r="64" fill={c.bg} />

      <g clipPath={`url(#${clip})`}>
        {/* shoulders / torso */}
        <path d="M20 128c0-24 20-38 44-38s44 14 44 38Z" fill={c.shirt} />
        <path
          d="M50 92c4 7 24 7 28 0"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.18"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* neck */}
        <path d="M57 78h14v10c0 6-3 9-7 9s-7-3-7-9Z" fill={c.skinShade} />

        {/* head */}
        <circle cx="64" cy="58" r="25" fill={c.skin} />
        <circle cx="39" cy="59" r="4.5" fill={c.skin} />
        <circle cx="89" cy="59" r="4.5" fill={c.skin} />

        {/* hair back layer for long style */}
        {c.hairStyle === "long" && (
          <path d="M36 56c-4 8-5 30-1 48l11-3c-4-16-4-32-2-45Zm56 0c4 8 5 30 1 48l-11-3c4-16 4-32 2-45Z" fill={c.hair} />
        )}

        {/* bun */}
        {c.hairStyle === "bun" && <circle cx="64" cy="28" r="9" fill={c.hair} />}

        {/* beard */}
        {c.beard && (
          <path
            d="M42 60c1 17 11 30 22 30s21-13 22-30c-3 10-9 15-22 15s-19-5-22-15Z"
            fill={c.hair}
          />
        )}

        {/* hair top */}
        {c.hairStyle === "buzz" ? (
          <path d="M41 58a23 23 0 0 1 46 0c0-16-10-26-23-26s-23 10-23 26Z" fill={c.hair} opacity="0.92" />
        ) : (
          <path
            d="M39 60a25 25 0 0 1 50 0c0-9-1-16-7-20-3 5-9 8-18 8s-15-3-18-8c-6 4-7 11-7 20Z"
            fill={c.hair}
          />
        )}

        {/* face */}
        <circle cx="55.5" cy="58" r="2.6" fill="#1f2937" />
        <circle cx="72.5" cy="58" r="2.6" fill="#1f2937" />
        <path
          d="M56 67c4 5 12 5 16 0"
          fill="none"
          stroke="#1f2937"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* glasses */}
        {c.glasses && (
          <g fill="none" stroke="#1f2937" strokeWidth="2">
            <circle cx="55.5" cy="58" r="7.5" />
            <circle cx="72.5" cy="58" r="7.5" />
            <path d="M63 58h2" />
          </g>
        )}
      </g>
    </svg>
  );
}

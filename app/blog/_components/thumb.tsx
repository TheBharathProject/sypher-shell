/**
 * Deterministic colored thumbnail block for posts that don't have a hero image.
 * Picks a color and the first letter of the title from the slug — same input,
 * same output every render. Stand-in until real images get wired up.
 */

const PALETTES = [
  ["#fef3c7", "#92400e"], // amber
  ["#dbeafe", "#1e3a8a"], // blue
  ["#dcfce7", "#14532d"], // green
  ["#fce7f3", "#831843"], // pink
  ["#ede9fe", "#4c1d95"], // violet
  ["#fee2e2", "#7f1d1d"], // red
  ["#e0f2fe", "#075985"], // sky
  ["#fef9c3", "#713f12"], // yellow-warm
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

interface Props {
  seed: string;
  title: string;
  variant?: "featured" | "card";
}

export function Thumb({ seed, title, variant = "card" }: Props) {
  const idx = hash(seed) % PALETTES.length;
  const [bg, fg] = PALETTES[idx];
  const letter = title.replace(/[^a-zA-Z]/g, "").slice(0, 1).toUpperCase() || "S";

  return (
    <div
      className={`thumb thumb-${variant}`}
      style={{ background: bg, color: fg }}
      aria-hidden
    >
      <span className="thumb-letter">{letter}</span>
    </div>
  );
}

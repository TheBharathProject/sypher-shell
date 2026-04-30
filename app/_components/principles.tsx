interface Principle {
  title: string;
  body: string;
  icon: React.ReactNode;
}

const Icon = ({ d }: { d: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const principles: Principle[] = [
  {
    title: "Small tools. Sharp blades.",
    body: "One tool, one job, done well. Nothing tries to be everything. Ten focused things over one cluttered one.",
    icon: <Icon d="M8 3 4 21 21 12 4 3l4 18" />,
  },
  {
    title: "Different niches. Same shape.",
    body: "Reels today, options data tomorrow, captions next month. The shape never changes: input → decode → output you can use.",
    icon: <Icon d="M3 9h18M3 15h18M9 3v18M15 3v18" />,
  },
  {
    title: "Ship → soak → simplify.",
    body: "Push fast, watch what people use, cut what they don't. The product gets smaller, not bigger, over time.",
    icon: <Icon d="M3 12h4l3-9 4 18 3-9h4" />,
  },
];

export function Principles() {
  return (
    <section id="manifesto" className="bg-deep border-t border-b border-hairline">
      <div className="section-wrap py-20 md:py-28 text-center">
        <p className="t-eyebrow mb-4">What we believe</p>
        <h2 className="t-display text-[clamp(28px,4vw,44px)] max-w-[640px] mx-auto">
          Sharp tools for{" "}
          <span className="t-display-italic">specific</span> problems.
        </h2>
        <p className="mt-5 text-[15px] text-ink-muted max-w-[520px] mx-auto">
          Three operating principles. Everything we build follows them, or we
          don&rsquo;t ship it.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {principles.map((p) => (
            <article key={p.title} className="card">
              <div className="size-10 rounded-lg bg-paper-deep flex items-center justify-center text-ink mb-5">
                {p.icon}
              </div>
              <h3 className="text-[18px] font-semibold tracking-tight">
                {p.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

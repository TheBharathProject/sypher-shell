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
      <div className="section-wrap py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="t-eyebrow mb-4">What we believe</p>
            <h2 className="t-display text-[clamp(30px,4.2vw,48px)]">
              Sharp tools for <span className="t-display-italic">specific</span> problems.
            </h2>
            <p className="mt-5 max-w-[280px] text-[15px] leading-relaxed text-ink-muted">
              Sypher only works if each product gets smaller, clearer, and more
              usable over time.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((p, index) => (
              <article
                key={p.title}
                className={`card text-left ${index === 0 ? "md:col-span-2 md:grid md:grid-cols-[72px_minmax(0,1fr)] md:gap-6" : ""}`}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-paper-deep text-ink">
                      {p.icon}
                    </div>
                    <span className="text-[12px] uppercase tracking-[0.18em] text-ink-faint">
                      0{index + 1}
                    </span>
                  </div>
                </div>
                <div className={index === 0 ? "mt-5 md:mt-0" : "mt-5"}>
                  <h3 className="text-[20px] font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-ink-muted">
                    {p.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

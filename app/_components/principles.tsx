interface Principle {
  title: string;
  body: string;
}

const principles: Principle[] = [
  {
    title: "Small tools. Sharp blades.",
    body: "One tool, one job, done well. Nothing tries to be everything.",
  },
  {
    title: "Different niches. Same shape.",
    body: "Reels today, trading data tomorrow. The shape never changes: input → decode → output.",
  },
  {
    title: "Ship → soak → simplify.",
    body: "Push fast, watch what people use, cut what they don't. Smaller, not bigger.",
  },
];

export function Principles() {
  return (
    <section id="manifesto" className="border-t border-hairline">
      <div className="section-wrap py-16 md:py-20">
        <h2 className="t-display text-[clamp(24px,3.2vw,38px)] max-w-[400px] mb-10">
          What we believe.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-hairline border border-hairline rounded-xl overflow-hidden">
          {principles.map((p) => (
            <div key={p.title} className="bg-card px-6 py-7">
              <h3 className="text-[15px] font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

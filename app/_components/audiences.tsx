interface Audience {
  title: string;
  body: string;
  quote: string;
}

const audiences: Audience[] = [
  {
    title: "The creator",
    body: "You post on Instagram, YouTube, or TikTok and you study creators in your niche to figure out what works.",
    quote: "I want to know what's actually landing — not guess from the algorithm.",
  },
  {
    title: "The trader",
    body: "You trade Indian F&O and want clean intraday data plus a place to test ideas without paying broker-tier prices.",
    quote: "Give me the data, give me a chart, let me work.",
  },
  {
    title: "The maker",
    body: "You build small things on the internet and want sharp tools that respect your time and your wallet.",
    quote: "₹99 a month for one tool that actually works? Sold.",
  },
];

export function Audiences() {
  return (
    <section className="bg-deep border-t border-b border-hairline">
      <div className="section-wrap py-20 md:py-28 text-center">
        <p className="t-eyebrow mb-4">Who it&rsquo;s for</p>
        <h2 className="t-display text-[clamp(28px,4vw,44px)] max-w-[640px] mx-auto">
          Built for{" "}
          <span className="t-display-italic">specific people</span> with
          specific problems.
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {audiences.map((a) => (
            <article key={a.title} className="card">
              <h3 className="text-[18px] font-semibold tracking-tight">
                {a.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                {a.body}
              </p>
              <blockquote className="mt-4 pt-4 border-l-2 border-saffron pl-3 text-[13px] italic text-ink-muted">
                &ldquo;{a.quote}&rdquo;
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

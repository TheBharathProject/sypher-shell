interface Audience {
  title: string;
  body: string;
  quote: string;
}

const audiences: Audience[] = [
  {
    title: "The job seeker",
    body: "You are applying seriously, talking to recruiters, rewriting resumes, and you need a calmer system than a spreadsheet plus memory.",
    quote: "I just want one place for the whole search.",
  },
  {
    title: "The creator",
    body: "You study creators in your niche because you need signal, not recycled advice. You want to see what is actually landing right now.",
    quote: "Show me the pattern, then get out of the way.",
  },
  {
    title: "The trader",
    body: "You want clean workflows, practical data, and tools that cost less than the vague promise of a full terminal.",
    quote: "Give me the useful surface, not the enterprise ceremony.",
  },
];

export function Audiences() {
  return (
    <section className="bg-deep border-t border-b border-hairline">
      <div className="section-wrap py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="t-eyebrow mb-4">Who it&rsquo;s for</p>
            <h2 className="t-display text-[clamp(30px,4.2vw,48px)]">
              Different niches. Same appetite for focused tools.
            </h2>
            <p className="mt-5 max-w-[280px] text-[15px] leading-relaxed text-ink-muted">
              The audience changes. The shape does not: one specific person,
              one blocked workflow, one sharp product.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {audiences.map((a, index) => (
              <article key={a.title} className="border-t border-hairline pt-5 text-left">
                <p className="text-[12px] uppercase tracking-[0.16em] text-ink-faint">
                  0{index + 1}
                </p>
                <h3 className="mt-5 t-display text-[24px]">{a.title}</h3>
                <p className="mt-4 text-[14px] leading-relaxed text-ink-muted">
                  {a.body}
                </p>
                <blockquote className="mt-5 text-[13px] italic leading-relaxed text-ink-muted">
                  &ldquo;{a.quote}&rdquo;
                </blockquote>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

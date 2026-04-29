interface Step {
  num: string;
  title: string;
  body: string;
  meta: string;
}

const steps: Step[] = [
  {
    num: "01",
    title: "Pick.",
    body: "Drop in two creator handles. The ones you secretly study. The ones you wish you posted like.",
    meta: "input · 30 seconds",
  },
  {
    num: "02",
    title: "Decode.",
    body: "Audio in, transcripts out. Each top reel gets a hook breakdown — what it&rsquo;s doing, why it&rsquo;s landing, what archetype it follows.",
    meta: "machine · ~4 minutes",
  },
  {
    num: "03",
    title: "Repurpose.",
    body: "Three reel concepts re-written in your voice and your niche. Steal-worthy. Post by tomorrow.",
    meta: "output · ready before chai",
  },
];

export function Method() {
  return (
    <section className="hairline-top">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <p className="t-section-marker mb-6">// 03 / method</p>
            <h2 className="t-display text-[44px] leading-[0.95] md:text-[64px]">
              How it works,
              <br />
              <span className="t-display-italic">briefly</span>.
            </h2>
            <p className="t-mono mt-6 max-w-sm text-sm leading-relaxed text-bone-muted">
              Demonstrated with Reel Hooks. The other tools follow the same
              shape: input → decode → output you can use.
            </p>
          </div>

          <ol className="md:col-span-8">
            {steps.map((s, i) => (
              <li
                key={s.num}
                className={`grid grid-cols-12 gap-4 py-10 md:gap-8 md:py-12 ${
                  i !== 0 ? "border-t border-hairline" : ""
                }`}
              >
                <span className="t-display col-span-12 text-[64px] leading-[0.85] text-bone md:col-span-2 md:text-[96px]">
                  <span className="text-bone-faint">{s.num.charAt(0)}</span>
                  {s.num.charAt(1)}
                </span>
                <div className="col-span-12 md:col-span-7">
                  <h3 className="t-display text-[36px] leading-[1] text-bone md:text-[52px]">
                    {s.title}
                  </h3>
                  <p
                    className="t-mono mt-3 max-w-md text-[14px] leading-relaxed text-bone-muted md:text-[15px]"
                    dangerouslySetInnerHTML={{ __html: s.body }}
                  />
                </div>
                <span className="col-span-12 self-end text-right md:col-span-3">
                  <span className="t-mono inline-block text-[10px] uppercase tracking-[0.2em] text-bone-faint">
                    {s.meta}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

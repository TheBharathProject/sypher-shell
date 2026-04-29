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
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-4">
            <p className="t-section-marker mb-5">// 03 / method</p>
            <h2 className="t-display text-[36px] leading-[0.95] md:text-[52px]">
              How it works,
              <br />
              <span className="t-display-italic">briefly</span>.
            </h2>
            <p className="t-mono mt-5 max-w-sm text-[13px] leading-relaxed text-bone-muted md:text-[14px]">
              Demonstrated with Reel Hooks. The other tools follow the same
              shape: input → decode → output you can use.
            </p>
          </div>

          <ol className="md:col-span-8">
            {steps.map((s, i) => (
              <li
                key={s.num}
                className={`grid grid-cols-12 gap-3 py-7 md:gap-6 md:py-8 ${
                  i !== 0 ? "border-t border-hairline" : ""
                }`}
              >
                <span className="t-display col-span-12 text-[48px] leading-[0.85] text-bone md:col-span-2 md:text-[64px]">
                  <span className="text-bone-faint">{s.num.charAt(0)}</span>
                  {s.num.charAt(1)}
                </span>
                <div className="col-span-12 md:col-span-7">
                  <h3 className="t-display text-[28px] leading-[1] text-bone md:text-[36px]">
                    {s.title}
                  </h3>
                  <p
                    className="t-mono mt-2.5 max-w-md text-[13px] leading-relaxed text-bone-muted md:text-[14px]"
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

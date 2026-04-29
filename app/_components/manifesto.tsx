interface Principle {
  number: string;
  title: string;
  body: string;
}

const principles: Principle[] = [
  {
    number: "i.",
    title: "Small tools. Sharp blades.",
    body: "One tool, one job, done well. Nothing tries to be everything. We&rsquo;d rather ship ten focused things than one cluttered one.",
  },
  {
    number: "ii.",
    title: "Rupee first. Dollar later.",
    body: "Built and priced for India before anywhere else. ₹99 isn&rsquo;t a marketing trick. It&rsquo;s the unit we work in.",
  },
  {
    number: "iii.",
    title: "Ship → soak → simplify.",
    body: "We push fast, watch what people use, then cut what they don&rsquo;t. The product gets smaller, not bigger, over time.",
  },
];

export function Manifesto() {
  return (
    <section id="manifesto" className="hairline-top hairline-bottom">
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-5 md:sticky md:top-12 md:self-start">
            <p className="t-section-marker mb-5">// 01 / decode</p>
            <h2 className="t-display text-[36px] leading-[0.95] md:text-[52px]">
              Every viral reel is{" "}
              <span className="t-display-italic">encrypted.</span>
              <br />
              We <span className="relative inline-block">
                decrypt
                <span
                  className="absolute -bottom-0.5 left-0 right-0 h-[3px] bg-saffron"
                  aria-hidden
                />
              </span>
              <span className="t-display-italic text-saffron">.</span>
            </h2>
            <p className="t-mono mt-6 max-w-md text-[13px] leading-relaxed text-bone-muted md:text-[14px]">
              Three operating principles. Everything we build follows them, or
              we don&rsquo;t ship it.
            </p>
          </div>

          <ul className="md:col-span-7 md:pt-2">
            {principles.map((p, i) => (
              <li
                key={p.number}
                className={`flex gap-5 py-6 md:gap-8 md:py-7 ${
                  i !== 0 ? "border-t border-hairline" : ""
                }`}
              >
                <span className="t-display flex-none text-[24px] text-bone-faint md:text-[30px]">
                  {p.number}
                </span>
                <div>
                  <h3 className="t-display text-[24px] leading-[1.05] text-bone md:text-[32px]">
                    {p.title}
                  </h3>
                  <p
                    className="t-mono mt-2.5 max-w-lg text-[13px] leading-relaxed text-bone-muted md:text-[14px]"
                    dangerouslySetInnerHTML={{ __html: p.body }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

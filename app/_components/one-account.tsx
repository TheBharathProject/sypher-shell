const facts = [
  { num: "1", label: "sign-up for everything" },
  { num: "0", label: "bundles or lock-in" },
  { num: "∞", label: "tools, one home" },
];

export function OneAccount() {
  return (
    <section className="border-t border-hairline">
      <div className="section-wrap py-16 md:py-20">
        <div className="md:flex md:items-center md:gap-16">
          <div className="md:flex-1">
            <h2 className="t-display text-[clamp(26px,3.6vw,42px)] max-w-[480px]">
              One sign-up. Every tool, one place.
            </h2>
            <p className="mt-4 text-[15px] text-ink-muted max-w-[400px] leading-relaxed">
              One Sypher account gets you into every tool we ship. Each has its
              own optional subscription — you only pay for what you use.
            </p>
          </div>

          <div className="mt-10 md:mt-0 md:flex-shrink-0 flex gap-8 md:gap-12">
            {facts.map((f) => (
              <div key={f.label} className="text-center">
                <p className="t-display text-[clamp(32px,4vw,52px)] text-saffron leading-none">
                  {f.num}
                </p>
                <p className="mt-1.5 text-[12px] text-ink-faint max-w-[80px] leading-snug">
                  {f.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

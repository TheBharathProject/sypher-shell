export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 pt-10 pb-12 md:px-10 md:pt-14 md:pb-16">
        {/* eyebrow */}
        <div className="reveal reveal-1 t-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>// sypher</span>
          <span className="opacity-40">·</span>
          <span>small tools, decoded</span>
          <span className="opacity-40">·</span>
          <span>v0.1.0</span>
        </div>

        {/* headline — tightened */}
        <h1 className="t-display mt-7 text-[clamp(40px,6.4vw,84px)]">
          <span className="reveal reveal-2 block">Small tools</span>
          <span className="reveal reveal-3 block">
            that <span className="t-display-italic">decode</span>
          </span>
          <span className="reveal reveal-4 block">the thing</span>
          <span className="reveal reveal-5 block">
            you&rsquo;re{" "}
            <span className="relative inline-block">
              stuck on
              <span
                className="absolute left-0 right-0 -bottom-1 h-[5px] bg-decode origin-left scale-x-0 will-change-transform"
                style={{
                  animation:
                    "draw-x 0.9s cubic-bezier(0.7,0,0.3,1) 0.95s both",
                }}
                aria-hidden
              />
            </span>
            <span className="t-display-italic text-saffron">.</span>
          </span>
        </h1>

        {/* sub */}
        <p className="reveal reveal-6 t-mono mt-8 max-w-lg text-[14px] leading-relaxed text-bone-muted md:text-[15px]">
          A growing library of small SaaS tools &mdash; each one focused on a
          single specific job. Reels today, trading data tomorrow, something
          else next month. One tool, one problem, ₹99-ish a month.
        </p>

        {/* status line */}
        <div className="reveal reveal-7 mt-10 inline-flex flex-wrap items-center gap-x-3 gap-y-1 border border-hairline px-3.5 py-2 text-[11px] uppercase tracking-[0.16em]">
          <span className="t-mono text-decode">●</span>
          <span className="t-mono text-bone">tool 01: reel hooks</span>
          <span className="t-mono text-bone-muted">·</span>
          <span className="t-mono text-bone-muted">launching this month</span>
          <span className="t-mono text-bone-muted">·</span>
          <span className="t-mono text-bone">₹99/mo</span>
          <span className="t-mono cursor-blink"></span>
        </div>
      </div>

      {/* corner sigil */}
      <div
        className="pointer-events-none absolute right-6 top-10 hidden text-right md:block md:right-10"
        aria-hidden
      >
        <div className="t-mono text-[10px] leading-[1.4] tracking-[0.2em] text-bone-faint">
          <div>0XSY · PHER</div>
          <div>·····</div>
          <div>{`{`}DECODE{`}`}</div>
        </div>
      </div>
    </section>
  );
}

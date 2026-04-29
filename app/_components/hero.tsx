export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-20 md:px-10 md:pt-24 md:pb-32">
        {/* eyebrow */}
        <div className="reveal reveal-1 t-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>// sypher</span>
          <span className="opacity-40">·</span>
          <span>toolbelt for creators</span>
          <span className="opacity-40">·</span>
          <span>v0.1.0</span>
          <span className="opacity-40">·</span>
          <span>mumbai</span>
        </div>

        {/* headline */}
        <h1 className="t-display mt-10 text-[clamp(48px,9vw,148px)]">
          <span className="reveal reveal-2 block">Tools for creators</span>
          <span className="reveal reveal-3 block">
            who ship <span className="t-display-italic">faster</span>
          </span>
          <span className="reveal reveal-4 block">than the</span>
          <span className="reveal reveal-5 block">
            <span className="relative inline-block">
              algorithm
              <span
                className="absolute left-0 right-0 -bottom-1 h-[6px] bg-decode origin-left scale-x-0 will-change-transform"
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
        <p className="reveal reveal-6 t-mono mt-12 max-w-xl text-[15px] leading-relaxed text-bone-muted md:text-[16px]">
          A growing factory of small, sharp tools that decode what&rsquo;s
          working in your niche &mdash; and turn it into your next post. Built
          for the Indian creator economy. Priced like one too.
        </p>

        {/* status line — terminal-style */}
        <div className="reveal reveal-7 mt-14 inline-flex flex-wrap items-center gap-x-3 gap-y-1 border border-hairline px-4 py-2.5 text-[12px] uppercase tracking-[0.16em]">
          <span className="t-mono text-decode">●</span>
          <span className="t-mono text-bone">tool 01: reel hooks</span>
          <span className="t-mono text-bone-muted">·</span>
          <span className="t-mono text-bone-muted">launching this month</span>
          <span className="t-mono text-bone-muted">·</span>
          <span className="t-mono text-bone">₹99/mo</span>
          <span className="t-mono cursor-blink"></span>
        </div>
      </div>

      {/* corner sigil — purely decorative */}
      <div
        className="pointer-events-none absolute right-6 top-12 hidden text-right md:block md:right-10"
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

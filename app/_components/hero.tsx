export function Hero() {
  return (
    <section className="section-wrap pt-16 pb-16 md:pt-24 md:pb-20 text-center">
      <span className="pill mb-8">
        <span className="pill-dot" aria-hidden />
        Free for the first 100 sign-ups · No spam
      </span>

      <h1 className="t-display text-[clamp(36px,5.4vw,68px)] max-w-[820px] mx-auto text-balance">
        Small tools that decode the thing you&rsquo;re{" "}
        <span className="t-display-italic text-saffron">stuck on</span>.
      </h1>

      <p className="mt-6 text-[16px] md:text-[17px] leading-relaxed text-ink-muted max-w-[600px] mx-auto">
        A growing library of small SaaS tools — each focused on one specific
        job. Reels today, trading data tomorrow, something else next month.
        One tool, one problem, ₹99-ish a month.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
        <a href="#waitlist" className="btn btn-primary">
          Join the waitlist
          <span className="arrow" aria-hidden>→</span>
        </a>
        <a href="#tools" className="btn btn-secondary">
          See what&rsquo;s coming
        </a>
      </div>

      <p className="mt-5 text-[13px] text-ink-faint">
        Tool 01 launching this month · ₹99/mo
      </p>
    </section>
  );
}

export function Hero() {
  return (
    <section className="section-wrap pt-16 pb-12 md:pt-24 md:pb-16 text-center">
      <p className="t-eyebrow mb-6">A growing library of sharp tools</p>
      <h1 className="t-display text-[clamp(40px,5.6vw,72px)] max-w-[760px] mx-auto text-balance">
        One tool. One problem.{" "}
        <span className="text-saffron">Solved well.</span>
      </h1>
      <p className="mt-6 text-[16px] leading-relaxed text-ink-muted max-w-[520px] mx-auto">
        Sypher builds small, focused tools — each one sharp for a single job.
        One account, everything in one place.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <a href="#products" className="btn btn-primary">
          See what we&rsquo;re building{" "}
          <span className="arrow" aria-hidden>
            →
          </span>
        </a>
        <a href="#waitlist" className="btn btn-secondary">
          Join waitlist
        </a>
      </div>
    </section>
  );
}

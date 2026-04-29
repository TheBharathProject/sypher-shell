export function ClosingCta() {
  return (
    <section id="waitlist" className="hairline-top">
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-14 md:items-end">
          <div className="md:col-span-7">
            <p className="t-section-marker mb-5">// 05 / waitlist</p>
            <h2 className="t-display text-[36px] leading-[0.95] md:text-[56px]">
              Want Reel Hooks{" "}
              <span className="t-display-italic text-saffron">first?</span>
            </h2>
            <p className="t-mono mt-4 max-w-md text-[13px] leading-relaxed text-bone-muted md:text-[14px]">
              One email when Tool 01 goes live, with a launch-only discount
              for the first 100 sign-ups. No spam, ever.
            </p>
          </div>

          <div className="md:col-span-5">
            <form
              action="https://formspree.io/f/your_form_id"
              method="POST"
              aria-label="Waitlist signup"
            >
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@inbox.in"
                className="input-line"
                autoComplete="email"
              />
              <div className="mt-5 flex items-center justify-between">
                <span className="t-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
                  &gt; transmit
                </span>
                <button type="submit" className="button-arrow">
                  ping me
                  <span className="arrow">→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

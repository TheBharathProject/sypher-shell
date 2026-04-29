export function ClosingCta() {
  return (
    <section className="hairline-top">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-40">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <p className="t-section-marker mb-6">// 04 / waitlist</p>
            <h2 className="t-display text-[clamp(48px,8vw,112px)] leading-[0.92]">
              Reel Hooks
              <br />
              <span className="t-display-italic text-saffron">launches soon.</span>
              <br />
              Want it first?
            </h2>
          </div>

          <div className="md:col-span-5 md:pt-8">
            <p className="t-mono max-w-md text-[14px] leading-relaxed text-bone-muted">
              No spam. One email when Tool 01 goes live, with a launch-only
              code for the first 100 creators.
            </p>

            <form
              action="https://formspree.io/f/your_form_id"
              method="POST"
              className="mt-10"
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
              <div className="mt-6 flex items-center justify-between">
                <span className="t-mono text-[11px] uppercase tracking-[0.18em] text-bone-faint">
                  &gt; transmit_email
                </span>
                <button type="submit" className="button-arrow">
                  ping me
                  <span className="arrow">→</span>
                </button>
              </div>
            </form>

            <p className="t-mono mt-8 text-[11px] uppercase tracking-[0.16em] text-bone-faint">
              {`{`} you can also just <a href="mailto:dixit.shubh18@gmail.com" className="text-bone hover:text-decode transition-colors">email</a> {`}`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

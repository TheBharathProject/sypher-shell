export function ClosingCta() {
  return (
    <section id="waitlist">
      <div className="section-wrap py-24 md:py-32 text-center">
        <h2 className="t-display text-[clamp(36px,5vw,60px)] max-w-[760px] mx-auto text-balance">
          Sharp tools deserve a{" "}
          <span className="t-display-italic">calmer home</span>.
        </h2>
        <p className="mt-5 text-[15px] md:text-[16px] text-ink-muted max-w-[520px] mx-auto">
          Drop your email below. One message when Tool 01 is live, with a
          launch-only discount for the first 100. No spam, ever.
        </p>

        <form
          action="https://formspree.io/f/your_form_id"
          method="POST"
          className="mt-10 max-w-[440px] mx-auto flex flex-col sm:flex-row gap-2"
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
          <button type="submit" className="btn btn-primary shrink-0">
            Notify me
            <span className="arrow" aria-hidden>→</span>
          </button>
        </form>

        <p className="mt-4 text-[13px] text-ink-faint">
          Or just{" "}
          <a
            href="mailto:buildwithshubham.dixit@gmail.com"
            className="text-ink underline underline-offset-4 decoration-hairline hover:decoration-ink"
          >
            email
          </a>
          .
        </p>
      </div>
    </section>
  );
}

import { WaitlistForm } from "./waitlist-form";

export function ClosingCta() {
  return (
    <section id="waitlist" className="border-t border-hairline bg-deep">
      <div className="section-wrap py-16 md:py-20 text-center">
        <h2 className="t-display text-[clamp(32px,4.8vw,58px)] max-w-[580px] mx-auto text-balance">
          Be first when the next{" "}
          <span className="text-saffron">tool ships</span>.
        </h2>
        <p className="mt-4 text-[15px] text-ink-muted max-w-[420px] mx-auto">
          One email per launch. First 100 get a discount. No spam, ever.
        </p>

        <WaitlistForm source="homepage_closing_cta" />

        <p className="mt-4 text-[12px] text-ink-faint">
          Or{" "}
          <a
            href="mailto:buildwithshubham.dixit@gmail.com"
            className="text-ink-muted underline underline-offset-4 decoration-hairline hover:text-ink hover:decoration-ink transition-colors"
          >
            email directly
          </a>
          .
        </p>
      </div>
    </section>
  );
}

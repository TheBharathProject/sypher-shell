import { WaitlistForm } from "./waitlist-form";

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

        <WaitlistForm source="homepage_closing_cta" />

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

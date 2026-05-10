import Link from "next/link";
import { WaitlistForm } from "./waitlist-form";

export function ClosingCta() {
  return (
    <section id="waitlist" className="border-t border-hairline">
      <div className="section-wrap py-24 md:py-36">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="t-eyebrow mb-4">Future launches</p>
          <h2 className="t-display text-[clamp(34px,5vw,56px)] text-balance">
            Join the waitlist for whatever ships next.
          </h2>
          <p className="mx-auto mt-5 max-w-[580px] text-[15px] leading-[1.75] text-ink-muted md:text-[16px]">
            Pegasus is already live. If you want the next Sypher product
            without watching too closely, leave your email and get one useful
            note when it is ready.
          </p>

          <div className="mx-auto mt-10 max-w-[460px] rounded-[22px] border border-hairline bg-card px-6 py-7">
            <p className="text-[12px] uppercase tracking-[0.18em] text-ink-faint">
              Waitlist for the next drops
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
              One useful email when the next product goes live.
            </p>

            <WaitlistForm source="homepage_closing_cta" />
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/pegasus" className="btn btn-primary">
              Open Pegasus
              <span className="arrow" aria-hidden>
                →
              </span>
            </Link>
            <Link href="/blog" className="btn btn-secondary">
              Read the build notes
            </Link>
          </div>

          <p className="mt-5 text-[13px] text-ink-faint">
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
      </div>
    </section>
  );
}

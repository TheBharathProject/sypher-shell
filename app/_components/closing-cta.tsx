import Link from "next/link";
import { WaitlistForm } from "./waitlist-form";

export function ClosingCta() {
  return (
    <section id="waitlist">
      <div className="section-wrap py-24 md:py-32">
        <div className="rounded-[32px] border border-hairline bg-deep px-6 py-8 md:px-10 md:py-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
            <div>
              <p className="t-eyebrow mb-4">Next move</p>
              <h2 className="t-display max-w-[680px] text-[clamp(34px,5vw,62px)] text-balance">
                Open the live tool now, or join the line for the next one.
              </h2>
              <p className="mt-5 max-w-[560px] text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
                Pegasus is already running. If you only care about what ships
                next, drop your email and get one message when the next tool is
                ready. No launch funnel theatre.
              </p>

              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
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
            </div>

            <div className="rounded-[24px] border border-hairline bg-card px-5 py-6 text-center md:px-6">
              <p className="text-[12px] uppercase tracking-[0.18em] text-ink-faint">
                Waitlist for the next drops
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                One useful email when the next product goes live.
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
          </div>
        </div>
      </div>
    </section>
  );
}

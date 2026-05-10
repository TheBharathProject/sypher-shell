import Link from "next/link";
import { WaitlistForm } from "./waitlist-form";

export function ClosingCta() {
  return (
    <section id="waitlist" className="border-t border-hairline">
      <div className="section-wrap py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <p className="t-eyebrow mb-4">Next move</p>
            <h2 className="t-display max-w-[640px] text-[clamp(34px,5vw,58px)] text-balance">
              One useful email when the next tool is ready.
            </h2>
            <p className="mt-5 max-w-[540px] text-[15px] leading-relaxed text-ink-muted md:text-[16px]">
              Pegasus is already live. If you only care about what ships next,
              join the waitlist and get one message when the next product is
              ready. Or just open the live tool now.
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

          <div>
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
    </section>
  );
}

import Link from "next/link";

const pegasusHighlights = [
  "Track applications, notes, and resume versions in one place.",
  "Keep recruiter context attached to the actual role.",
  "Use a job-hunt tool, not a sales CRM pretending to fit.",
];

export function Hero() {
  return (
    <section className="section-wrap pt-16 pb-18 md:pt-24 md:pb-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div>
          <span className="pill mb-6">
            <span className="pill-dot" aria-hidden />
            Pegasus is live · Reel Hooks is next
          </span>

          <h1 className="t-display max-w-[760px] text-[clamp(40px,6vw,74px)] text-balance">
            Small tools that help when a specific workflow gets stuck.
          </h1>

          <p className="mt-6 max-w-[620px] text-[17px] leading-[1.75] text-ink-muted md:text-[18px]">
            Sypher is a small library of focused software products. Each one is
            built for a clear job, a clear user, and a price that feels easy to
            justify. Pegasus is live now for job seekers. Reel Hooks is next for
            creator research.
          </p>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link href="/pegasus" className="btn btn-primary">
              Open Pegasus
              <span className="arrow" aria-hidden>
                →
              </span>
            </Link>
            <a href="#tools" className="btn btn-secondary">
              Browse the library
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-faint">
            <span>1 tool live now</span>
            <span className="hidden sm:inline">·</span>
            <span>1 tool in queue</span>
            <span className="hidden sm:inline">·</span>
            <span>Independent subscriptions</span>
          </div>
        </div>

        <aside className="border-t border-hairline pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
          <p className="t-eyebrow">Live now</p>
          <h2 className="t-display mt-3 text-[clamp(30px,4vw,40px)]">Pegasus</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
            A quieter way to track your job hunt, built for people applying to
            roles, not for a sales team.
          </p>

          <div className="mt-6 space-y-3">
            {pegasusHighlights.map((item) => (
              <div key={item} className="flex items-start gap-3 text-[14px] leading-relaxed text-ink-muted">
                <span className="mt-[7px] inline-block size-1.5 shrink-0 rounded-full bg-saffron" aria-hidden />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link
            href="/pegasus"
            className="mt-6 inline-flex text-[14px] font-medium text-ink underline decoration-hairline underline-offset-4 hover:decoration-ink"
          >
            Open the live tool
          </Link>

          <div className="mt-8 border-t border-hairline pt-5">
            <p className="t-eyebrow">Next</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
              Reel Hooks for creator research. Launching soon at the same
              lightweight price point.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

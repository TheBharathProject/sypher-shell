import Link from "next/link";

const heroStats = [
  { value: "1", label: "tool live now", detail: "Pegasus is already open." },
  { value: "1", label: "tool in queue", detail: "Reel Hooks is next up." },
  { value: "₹99", label: "entry-point target", detail: "India-first pricing, tool by tool." },
];

const pegasusHighlights = [
  "Track applications without spreadsheet drift.",
  "Keep recruiter context, notes, and resumes together.",
  "Use one calm workspace instead of a patched-together stack.",
];

export function Hero() {
  return (
    <section className="section-wrap pt-14 pb-16 md:pt-20 md:pb-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,400px)] lg:items-start">
        <div>
          <span className="pill mb-6 bg-card/80">
            <span className="pill-dot" aria-hidden />
            Pegasus is live · Reel Hooks is next
          </span>

          <h1 className="t-display max-w-[760px] text-[clamp(40px,6vw,78px)] text-balance">
            Small tools for the exact thing blocking your work.
          </h1>

          <p className="mt-6 max-w-[640px] text-[17px] leading-[1.75] text-ink-muted md:text-[18px]">
            Sypher is a growing library of small software products. Each one is
            built for a specific problem, a specific person, and a price that
            feels easy to justify. Pegasus is live today for job seekers. Reel
            Hooks is next for creator research.
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

          <p className="mt-5 text-[13px] text-ink-faint">
            Independent subscriptions · No bundles · No factory bloat
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat) => (
              <article key={stat.label} className="rounded-[18px] border border-hairline bg-card px-5 py-4">
                <div className="t-display text-[30px] text-ink">{stat.value}</div>
                <p className="mt-1 text-[12px] uppercase tracking-[0.16em] text-ink-faint">
                  {stat.label}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
                  {stat.detail}
                </p>
              </article>
            ))}
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-[28px] border border-hairline bg-card p-6 md:p-7">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-saffron/60 to-transparent" />

          <div className="rounded-[22px] border border-hairline bg-paper p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="pill bg-card">
                <span className="pill-dot" aria-hidden />
                Live now
              </span>
              <span className="text-[12px] font-mono text-ink-faint">/pegasus</span>
            </div>

            <h2 className="t-display mt-5 text-[clamp(30px,4vw,42px)]">Pegasus</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
              A quieter way to track your job hunt, built for people applying to
              roles, not for a sales team.
            </p>

            <div className="mt-6 space-y-2">
              {pegasusHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-[14px] border border-hairline bg-card px-4 py-3 text-[14px] leading-relaxed text-ink-muted"
                >
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
          </div>

          <div className="mt-4 rounded-[22px] border border-dashed border-hairline px-5 py-5">
            <p className="t-eyebrow">Next in queue</p>
            <h3 className="t-display mt-3 text-[26px]">Reel Hooks</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
              Compare creators in your niche, pull their strongest reels, and
              turn that signal into concepts you can actually post.
            </p>
            <p className="mt-4 text-[13px] text-ink-faint">Launching soon · ₹99/mo target</p>
          </div>
        </aside>
      </div>
    </section>
  );
}

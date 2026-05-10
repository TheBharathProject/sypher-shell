import Link from "next/link";

const pegasusHighlights = [
  "Track applications, notes, and resume versions in one place.",
  "Keep recruiter context attached to the role instead of scattered across tabs.",
  "Use a job-hunt tool, not a sales CRM pretending to fit.",
];

export function Hero() {
  return (
    <section className="section-wrap pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="max-w-[760px]">
        <span className="pill mb-6">
          <span className="pill-dot" aria-hidden />
          Live now on Sypher
        </span>

        <h1 className="t-display text-[clamp(42px,6.2vw,78px)] text-balance">
          Pegasus is a quieter way to track your job hunt.
        </h1>

        <p className="mt-6 max-w-[620px] text-[17px] leading-[1.75] text-ink-muted md:text-[18px]">
          Built for people applying to roles, talking to recruiters, saving
          resume versions, and trying to keep the whole search from turning into
          a spreadsheet plus memory.
        </p>

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Link href="/pegasus" className="btn btn-primary">
            Open Pegasus
            <span className="arrow" aria-hidden>
              →
            </span>
          </Link>
          <Link href="/blog" className="btn btn-secondary">
            Read the blog
          </Link>
        </div>

        <div className="mt-10 space-y-3 border-t border-hairline pt-6">
          {pegasusHighlights.map((item) => (
            <div key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-muted">
              <span className="mt-[8px] inline-block size-1.5 shrink-0 rounded-full bg-saffron" aria-hidden />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Maker() {
  return (
    <section id="maker" className="border-b border-hairline">
      <div className="section-wrap py-20 md:py-28">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-[26px] border border-hairline bg-deep px-6 py-7 md:px-8 md:py-9">
            <p className="t-eyebrow mb-4">Maker</p>
            <h2 className="t-display text-[clamp(30px,4.2vw,48px)]">
              Built by <span className="t-display-italic">Shubham</span>, with a bias toward smaller software.
            </h2>
            <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-ink-muted">
              Sypher is the wrapper that makes the next product faster to ship
              without turning the current one into a mess. Shared infra where it
              helps, separate products where it matters.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[18px] border border-hairline bg-card px-4 py-4">
                <p className="text-[12px] uppercase tracking-[0.16em] text-ink-faint">Build</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                  Ship the smallest credible version first.
                </p>
              </div>
              <div className="rounded-[18px] border border-hairline bg-card px-4 py-4">
                <p className="text-[12px] uppercase tracking-[0.16em] text-ink-faint">Watch</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                  Learn from real usage, not roadmap fantasy.
                </p>
              </div>
              <div className="rounded-[18px] border border-hairline bg-card px-4 py-4">
                <p className="text-[12px] uppercase tracking-[0.16em] text-ink-faint">Trim</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                  Remove weight until the tool feels obvious.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <article className="card rounded-[24px]">
              <p className="t-eyebrow">Reach out</p>
              <p className="mt-4 text-[14px] leading-relaxed text-ink-muted">
                Questions, blunt feedback, or a tool idea that should exist:
              </p>
              <p className="mt-4 text-[15px]">
                <a
                  href="mailto:buildwithshubham.dixit@gmail.com"
                  className="text-ink underline underline-offset-4 decoration-hairline hover:decoration-ink"
                >
                  buildwithshubham.dixit@gmail.com
                </a>
              </p>
            </article>

            <article className="card rounded-[24px]">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                  <span className="size-1.5 rounded-full bg-ink-faint" aria-hidden />
                  Also shipped
                </span>
                <span className="text-[12px] text-ink-faint font-mono">
                  /merge-up
                </span>
              </div>
              <h3 className="text-[20px] font-semibold tracking-tight">
                Merge Up
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
                A puzzle game where you merge numbered blocks to reach higher
                scores and unlock levels.
              </p>
              <p className="mt-3 text-[13px] text-ink-faint">
                Privacy-first: only a username and score, nothing personal.
              </p>
              <div className="mt-5 pt-4 border-t border-hairline flex items-center gap-4 text-[12px]">
                <a
                  href="/mergeup-privacy-policy.md"
                  className="text-ink-muted hover:text-ink"
                >
                  Privacy
                </a>
                <a
                  href="/merge_up_terms_of_service.md"
                  className="text-ink-muted hover:text-ink"
                >
                  Terms
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

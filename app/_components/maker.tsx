export function Maker() {
  return (
    <section id="maker" className="bg-deep border-t border-b border-hairline">
      <div className="section-wrap py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <p className="t-eyebrow mb-4">Maker</p>
            <h2 className="t-display text-[clamp(28px,4vw,44px)]">
              Built by{" "}
              <span className="t-display-italic">Shubham</span>.
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-ink-muted max-w-[520px]">
              Solo founder. Ships across niches — creator analytics, trading
              data, mobile games, whatever needs a sharp tool. Sypher is the
              wrapper that makes shipping the next one cheaper.
            </p>
            <p className="mt-3 text-[14px] text-ink-muted">
              <a
                href="mailto:buildwithshubham.dixit@gmail.com"
                className="text-ink underline underline-offset-4 decoration-hairline hover:decoration-ink"
              >
                buildwithshubham.dixit@gmail.com
              </a>
            </p>
          </div>

          <div className="md:col-span-5">
            <article className="card">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.12em] text-saffron">
                  <span className="size-1.5 rounded-full bg-saffron" aria-hidden />
                  Live · Play Store
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

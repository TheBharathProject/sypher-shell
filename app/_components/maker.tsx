export function Maker() {
  return (
    <section id="maker" className="border-t border-b border-hairline bg-deep">
      <div className="section-wrap py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div>
            <p className="t-eyebrow mb-4">One place</p>
            <h2 className="t-display text-[clamp(32px,4.4vw,52px)]">
              One sign-in across Sypher tools.
            </h2>
            <p className="mt-5 max-w-[58ch] text-[15px] leading-relaxed text-ink-muted">
              As the shelf grows, the goal stays simple: one identity, one home,
              separate focused products. No bundle pressure, no giant suite
              pretending to fit everyone.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              <div className="border-t border-hairline pt-4">
                <p className="text-[12px] uppercase tracking-[0.16em] text-ink-faint">Values</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                  Small tools over heavy platforms.
                </p>
              </div>
              <div className="border-t border-hairline pt-4">
                <p className="text-[12px] uppercase tracking-[0.16em] text-ink-faint">Values</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                  Privacy and clarity over growth theatre.
                </p>
              </div>
              <div className="border-t border-hairline pt-4">
                <p className="text-[12px] uppercase tracking-[0.16em] text-ink-faint">Values</p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                  More tools coming soon, one by one.
                </p>
              </div>
            </div>
          </div>

          <article className="border-t border-hairline pt-5 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-10">
            <p className="t-eyebrow mb-4">Built by</p>
            <h3 className="t-display text-[clamp(28px,3.8vw,40px)]">
              Shubham Dixit.
            </h3>
            <p className="mt-5 max-w-[38ch] text-[15px] leading-relaxed text-ink-muted">
              I build small software products that stay focused on one job at a
              time. Sypher is where those products live.
            </p>
            <p className="mt-5 text-[15px]">
              <a
                href="mailto:buildwithshubham.dixit@gmail.com"
                className="text-ink underline underline-offset-4 decoration-hairline hover:decoration-ink"
              >
                buildwithshubham.dixit@gmail.com
              </a>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

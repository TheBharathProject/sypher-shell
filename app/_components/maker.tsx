export function Maker() {
  return (
    <section id="maker" className="border-t border-b border-hairline bg-deep">
      <div className="section-wrap py-20 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <article>
            <p className="t-eyebrow mb-4">Built by</p>
            <h2 className="t-display text-[clamp(30px,4.2vw,48px)]">
              Shubham Dixit.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[15px] leading-relaxed text-ink-muted">
              I build small software products that stay focused on one job.
              Sypher is the home for those tools. Pegasus is the first live one.
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

          <article className="border-t border-hairline pt-5">
            <p className="t-eyebrow">Coming soon</p>
            <h3 className="t-display mt-3 text-[28px]">
              More tools will follow.
            </h3>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-muted">
              Slowly, one by one. The goal is a small shelf of focused products,
              not a cluttered suite.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Maker() {
  return (
    <section id="about" className="border-t border-b border-hairline bg-deep">
      <div className="section-wrap py-24 md:py-32">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="t-eyebrow mb-4">One account</p>
          <h2 className="t-display text-[clamp(32px,4.6vw,56px)] text-balance">
            One sign-in for a shelf of small tools.
          </h2>
          <p className="mx-auto mt-5 max-w-[620px] text-[15px] leading-[1.75] text-ink-muted md:text-[16px]">
            Sypher is meant to stay simple: one account, separate focused
            products, and no pressure to pretend everything belongs in one
            giant suite.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-[980px] gap-5 lg:grid-cols-2">
          <article className="rounded-[20px] border border-hairline bg-card p-7 text-center lg:text-left">
            <p className="t-eyebrow">Values</p>
            <h3 className="t-display mt-5 text-[clamp(26px,3.2vw,36px)]">
              Calm product design over product sprawl.
            </h3>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[16px] border border-hairline bg-paper px-4 py-5">
                <p className="text-[14px] leading-relaxed text-ink-muted">
                  Small tools over heavy platforms.
                </p>
              </div>
              <div className="rounded-[16px] border border-hairline bg-paper px-4 py-5">
                <p className="text-[14px] leading-relaxed text-ink-muted">
                  Privacy and clarity over growth theatre.
                </p>
              </div>
              <div className="rounded-[16px] border border-hairline bg-paper px-4 py-5">
                <p className="text-[14px] leading-relaxed text-ink-muted">
                  More tools coming soon, one by one.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[20px] border border-hairline bg-card p-7 text-center lg:text-left">
            <p className="t-eyebrow">Built by</p>
            <h3 className="t-display mt-5 text-[clamp(26px,3.2vw,36px)]">
              Shubham Dixit.
            </h3>
            <p className="mx-auto mt-5 max-w-[42ch] text-[15px] leading-[1.75] text-ink-muted lg:mx-0 lg:text-[16px]">
              I build small software products that stay useful, opinionated,
              and easy to understand. Sypher is where those tools live.
            </p>
            <p className="mt-6 text-[14px]">
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

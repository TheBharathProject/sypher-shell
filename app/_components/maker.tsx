export function Maker() {
  return (
    <section id="maker" className="hairline-top">
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-14">
          {/* About */}
          <div className="md:col-span-5">
            <p className="t-section-marker mb-5">// 04 / maker</p>
            <h2 className="t-display text-[36px] leading-[0.95] md:text-[52px]">
              By <span className="t-display-italic">Shubham</span>.
              <br />
              From Mumbai.
            </h2>
            <p className="t-mono mt-6 max-w-md text-[13px] leading-relaxed text-bone-muted md:text-[14px]">
              Solo founder. Builds quietly, ships often. Sypher is the next
              chapter — a small studio for small tools that creators in India
              actually want to pay ₹99 for.
            </p>
            <p className="t-mono mt-4 max-w-md text-[13px] leading-relaxed text-bone-muted md:text-[14px]">
              Before this, a few other things shipped. One that&rsquo;s still
              live →
            </p>
          </div>

          {/* Shipped — Merge Up card */}
          <div className="md:col-span-7">
            <p className="t-section-marker mb-3">also shipped</p>

            <article className="border border-hairline bg-paper-deep p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="t-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-saffron">
                  <span className="size-1.5 rounded-full bg-saffron" />
                  live · play store
                </span>
                <span className="t-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
                  /merge-up
                </span>
              </div>

              <h3 className="t-display mt-7 text-[32px] leading-[1] md:text-[44px]">
                Merge Up
              </h3>
              <p className="t-mono mt-2.5 text-[13px] leading-relaxed text-bone md:text-[14px]">
                A puzzle game where you merge numbered blocks to reach higher
                scores and unlock levels.
              </p>
              <p className="t-mono mt-3 max-w-md text-[12px] leading-relaxed text-bone-muted md:text-[13px]">
                Built and published on the Play Store. Collects only a game
                username and score for leaderboards — nothing personal.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-y-2 border-t border-hairline pt-3">
                <div className="t-mono flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-bone-muted">
                  <a
                    href="/mergeup-privacy-policy.md"
                    className="hover:text-bone transition-colors"
                  >
                    privacy policy
                  </a>
                  <a
                    href="/merge_up_terms_of_service.md"
                    className="hover:text-bone transition-colors"
                  >
                    terms
                  </a>
                </div>
                <a
                  href="mailto:buildwithshubham.dixit@gmail.com"
                  className="t-mono text-[10px] uppercase tracking-[0.18em] text-bone hover:text-decode transition-colors"
                >
                  contact maker →
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

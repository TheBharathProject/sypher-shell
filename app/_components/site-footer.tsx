export function SiteFooter() {
  return (
    <footer id="waitlist" className="hairline-top mt-32">
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="t-eyebrow mb-4">// transmission ends</p>
            <h3 className="t-display text-[44px] leading-[0.95] md:text-[64px]">
              Mumbai <span className="t-display-italic text-saffron">→</span>{" "}
              World.
            </h3>
            <p className="t-mono mt-6 max-w-md text-sm leading-relaxed text-bone-muted">
              Built quietly. Shipped fast. Priced for the rupee. If you make
              things on the internet, this is for you.
            </p>
          </div>

          <div className="md:col-span-5">
            <p className="t-eyebrow mb-4">// links</p>
            <ul className="t-mono space-y-2 text-sm">
              <li>
                <a
                  href="/mergeup-privacy-policy.md"
                  className="text-bone-muted hover:text-bone transition-colors"
                >
                  privacy policy
                </a>
              </li>
              <li>
                <a
                  href="/merge_up_terms_of_service.md"
                  className="text-bone-muted hover:text-bone transition-colors"
                >
                  terms of service
                </a>
              </li>
              <li>
                <a
                  href="mailto:dixit.shubh18@gmail.com"
                  className="text-bone-muted hover:text-bone transition-colors"
                >
                  email →
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/TheBharathProject"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bone-muted hover:text-bone transition-colors"
                >
                  github ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline-divider mt-16" />

        <div className="t-mono mt-6 flex flex-col items-start justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-bone-faint md:flex-row md:items-center">
          <span>© 2026 sypher · made in mumbai</span>
          <span>v0.1.0 · last decoded {new Date().toISOString().slice(0, 10)}</span>
        </div>
      </div>
    </footer>
  );
}

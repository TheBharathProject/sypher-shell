export function SiteFooter() {
  return (
    <footer className="hairline-top">
      <div className="mx-auto max-w-[1200px] px-6 py-10 md:px-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="t-eyebrow mb-3">// transmission ends</p>
            <h3 className="t-display text-[28px] leading-[0.95] md:text-[36px]">
              Mumbai{" "}
              <span className="t-display-italic text-saffron">→</span> World.
            </h3>
            <p className="t-mono mt-3 max-w-md text-[12px] leading-relaxed text-bone-muted md:text-[13px]">
              Built quietly. Shipped fast. Priced for the rupee.
            </p>
          </div>

          <div className="md:col-span-5">
            <p className="t-eyebrow mb-3">// links</p>
            <ul className="t-mono grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] md:text-[13px]">
              <li>
                <a
                  href="#manifesto"
                  className="text-bone-muted hover:text-bone transition-colors"
                >
                  manifesto
                </a>
              </li>
              <li>
                <a
                  href="#tools"
                  className="text-bone-muted hover:text-bone transition-colors"
                >
                  tools
                </a>
              </li>
              <li>
                <a
                  href="#maker"
                  className="text-bone-muted hover:text-bone transition-colors"
                >
                  maker
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
              <li>
                <a
                  href="/mergeup-privacy-policy.md"
                  className="text-bone-faint hover:text-bone transition-colors"
                >
                  merge up privacy
                </a>
              </li>
              <li>
                <a
                  href="/merge_up_terms_of_service.md"
                  className="text-bone-faint hover:text-bone transition-colors"
                >
                  merge up terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline-divider mt-10" />

        <div className="t-mono mt-5 flex flex-col items-start justify-between gap-2 text-[10px] uppercase tracking-[0.18em] text-bone-faint md:flex-row md:items-center">
          <span>© 2026 sypher · made in mumbai</span>
          <span>v0.1.0 · last decoded {new Date().toISOString().slice(0, 10)}</span>
        </div>
      </div>
    </footer>
  );
}

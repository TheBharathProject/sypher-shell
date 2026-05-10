export function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-deep/50">
      <div className="section-wrap grid gap-8 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:py-12">
        <div>
          <div className="flex items-center gap-3 text-[14px] text-ink-muted">
            <span className="inline-flex size-7 items-center justify-center rounded-full border border-hairline bg-card text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron">
              S
            </span>
            <span>
              <span className="font-medium text-ink">Sypher</span> · made by Shubham Dixit
            </span>
          </div>
          <p className="mt-4 max-w-[420px] text-[14px] leading-relaxed text-ink-muted">
            A small library of focused tools. One specific problem per product,
            priced separately, shipped quietly.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-[13px] text-ink-muted">
          <nav className="grid content-start gap-2">
            <a href="#tools" className="hover:text-ink">
              Library
            </a>
            <a href="#manifesto" className="hover:text-ink">
              Principles
            </a>
            <a href="#faq" className="hover:text-ink">
              FAQ
            </a>
            <a href="/blog" className="hover:text-ink">
              Blog
            </a>
          </nav>

          <nav className="grid content-start gap-2">
            <a
              href="https://github.com/TheBharathProject"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink"
            >
              GitHub
            </a>
            <a href="/privacy" className="hover:text-ink">
              Privacy
            </a>
            <a href="/terms" className="hover:text-ink">
              Terms
            </a>
            <a href="mailto:buildwithshubham.dixit@gmail.com" className="hover:text-ink">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

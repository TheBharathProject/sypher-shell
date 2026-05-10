export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="section-wrap grid gap-8 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:py-12">
        <div>
          <div className="flex items-center gap-3 text-[14px] text-ink-muted">
            <span className="inline-block size-2 rounded-full bg-saffron" aria-hidden />
            <span>
              <span className="text-ink font-medium">Sypher</span> · made by Shubham Dixit
            </span>
          </div>
          <p className="mt-3 max-w-[420px] text-[14px] leading-relaxed text-ink-muted">
            Pegasus is live. More focused tools are on the way.
          </p>
        </div>

        <div className="grid gap-8 text-[13px] text-ink-muted sm:grid-cols-3">
          <nav className="grid content-start gap-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">Products</p>
            <a href="/pegasus" className="hover:text-ink">
              Pegasus
            </a>
            <a href="/mergeup-privacy-policy.md" className="hover:text-ink">
              Merge Up Privacy
            </a>
            <a href="/merge_up_terms_of_service.md" className="hover:text-ink">
              Merge Up Terms
            </a>
          </nav>

          <nav className="grid content-start gap-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">Studio</p>
            <a href="/blog" className="hover:text-ink">
              Blog
            </a>
            <a href="#waitlist" className="hover:text-ink">
              Waitlist
            </a>
            <a
              href="https://github.com/TheBharathProject"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink"
            >
              GitHub
            </a>
          </nav>

          <nav className="grid content-start gap-2">
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">Legal</p>
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

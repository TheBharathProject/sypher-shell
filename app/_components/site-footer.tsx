export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="section-wrap py-10 md:py-12 flex flex-col md:flex-row items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 text-[14px] text-ink-muted">
            <span className="inline-block size-2 rounded-full bg-saffron" aria-hidden />
            <span>
              <span className="text-ink font-medium">Sypher</span> · made by Shubham Dixit
            </span>
          </div>
          <p className="mt-3 max-w-[420px] text-[14px] leading-relaxed text-ink-muted">
            Focused tools, separate subscriptions, quieter software.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-muted">
          <a href="#tools" className="hover:text-ink">
            Tools
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
    </footer>
  );
}

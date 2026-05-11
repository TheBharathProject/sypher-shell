export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="section-wrap py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-block size-2 rounded-full bg-saffron"
                aria-hidden
              />
              <span className="text-[15px] font-medium text-ink">Sypher</span>
            </div>
            <p className="text-[13px] text-ink-muted leading-relaxed max-w-[220px]">
              Small tools for specific problems. Built in India.
            </p>
            <a
              href="mailto:buildwithshubham.dixit@gmail.com"
              className="mt-3 inline-block text-[13px] text-ink-faint hover:text-ink transition-colors"
            >
              buildwithshubham.dixit@gmail.com
            </a>
          </div>

          {/* Tools */}
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-faint mb-4">
              Tools
            </p>
            <nav className="flex flex-col gap-3 text-[14px] text-ink-muted">
              <a href="/pegasus" className="hover:text-ink transition-colors">
                Pegasus — Job tracker
              </a>
              <a
                href="https://chromewebstore.google.com/detail/pegasus-%E2%80%94-job-clipper/oghjgddbopcpgdbpgijkkaabiaebedgp"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink transition-colors"
              >
                Pegasus — Chrome extension
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.merge.mergeup"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink transition-colors"
              >
                Merge Up — Puzzle game
              </a>
              <span className="text-ink-faint">Reel Hooks — coming soon</span>
            </nav>
          </div>

          {/* Sypher */}
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-faint mb-4">
              Sypher
            </p>
            <nav className="flex flex-col gap-3 text-[14px] text-ink-muted">
              <a href="/blog" className="hover:text-ink transition-colors">
                Blog
              </a>
              <a
                href="https://github.com/TheBharathProject"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink transition-colors"
              >
                GitHub
              </a>
              <a href="/privacy" className="hover:text-ink transition-colors">
                Privacy policy
              </a>
              <a href="/terms" className="hover:text-ink transition-colors">
                Terms of service
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-ink-faint">
          <span>
            &copy; {new Date().getFullYear()} Sypher &middot; made by Shubham
            Dixit
          </span>
          <span>India &#127470;&#127475;</span>
        </div>
      </div>
    </footer>
  );
}

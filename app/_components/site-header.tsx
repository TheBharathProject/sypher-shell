import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-hairline bg-paper/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="section-wrap flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-medium text-ink">
          <span className="inline-block size-2 rounded-full bg-saffron" aria-hidden />
          Sypher
        </Link>

        <nav className="flex items-center gap-6 text-[14px] text-ink-muted">
          <a href="#tools" className="hover:text-ink transition-colors hidden sm:inline">
            Tools
          </a>
          <a href="#faq" className="hover:text-ink transition-colors hidden sm:inline">
            FAQ
          </a>
          <Link href="/blog" className="hover:text-ink transition-colors">
            Blog
          </Link>
          <a href="#waitlist" className="btn btn-primary py-2 px-4 text-[13px]">
            Join waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}

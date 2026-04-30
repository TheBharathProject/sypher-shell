import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="hairline-bottom">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 md:px-10 md:py-5">
        <Link href="/" className="t-mono flex items-center gap-2 text-[13px] tracking-wide">
          <span className="inline-block size-2 rounded-full bg-decode" aria-hidden />
          <span className="font-medium text-bone">sypher</span>
          <span className="text-bone-muted">/in</span>
        </Link>

        <nav className="t-mono flex items-center gap-5 text-[11px] uppercase tracking-[0.18em] text-bone-muted">
          <a href="/#tools" className="hover:text-bone transition-colors">
            tools
          </a>
          <Link href="/blog" className="hover:text-bone transition-colors">
            blog
          </Link>
          <a href="/#manifesto" className="hidden hover:text-bone transition-colors sm:inline">
            manifesto
          </a>
          <a href="/#maker" className="hidden hover:text-bone transition-colors sm:inline">
            maker
          </a>
          <a href="/#waitlist" className="text-bone hover:text-decode transition-colors">
            waitlist&nbsp;↗
          </a>
        </nav>
      </div>
    </header>
  );
}

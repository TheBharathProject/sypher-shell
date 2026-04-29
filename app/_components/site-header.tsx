import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="hairline-bottom">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <Link href="/" className="t-mono flex items-center gap-2 text-sm tracking-wide">
          <span className="inline-block size-2 rounded-full bg-decode" aria-hidden />
          <span className="font-medium text-bone">sypher</span>
          <span className="text-bone-muted">/in</span>
        </Link>

        <nav className="t-mono flex items-center gap-6 text-[12px] uppercase tracking-[0.18em] text-bone-muted">
          <a href="#tools" className="hover:text-bone transition-colors">
            tools
          </a>
          <a href="#manifesto" className="hidden hover:text-bone transition-colors sm:inline">
            manifesto
          </a>
          <a href="#waitlist" className="text-bone hover:text-decode transition-colors">
            waitlist&nbsp;↗
          </a>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b border-hairline bg-paper/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="section-wrap flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-medium text-ink">
          <span className="inline-block size-2 rounded-full bg-saffron" aria-hidden />
          Sypher
        </Link>

        <nav className="flex items-center gap-4 sm:gap-5 text-[13px] text-ink-muted">
          <a href="#products" className="hover:text-ink transition-colors hidden sm:inline">
            Tools
          </a>
          <Link href="/blog" className="hover:text-ink transition-colors hidden sm:inline">
            Blog
          </Link>
          <ThemeToggle />
          <a
            href="#waitlist"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-ink text-card border border-ink hover:bg-ink/90 transition-colors"
          >
            Join waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}

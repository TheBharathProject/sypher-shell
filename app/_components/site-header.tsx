import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b border-hairline bg-paper/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="section-wrap flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3 text-[15px] font-medium text-ink">
          <span className="inline-flex size-7 items-center justify-center rounded-full border border-hairline bg-card text-[11px] font-semibold uppercase tracking-[0.18em] text-saffron">
            S
          </span>
          Sypher
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-[13px] text-ink-muted sm:justify-end">
          <a href="#tools" className="pill bg-card hover:text-ink">
            Library
          </a>
          <a href="#manifesto" className="pill bg-card hover:text-ink hidden sm:inline-flex">
            Principles
          </a>
          <a href="#faq" className="pill bg-card hover:text-ink hidden sm:inline-flex">
            FAQ
          </a>
          <Link href="/blog" className="pill bg-card hover:text-ink">
            Blog
          </Link>
          <ThemeToggle />
          <Link href="/pegasus" className="btn btn-primary py-2 px-4 text-[13px]">Open Pegasus</Link>
        </nav>
      </div>
    </header>
  );
}

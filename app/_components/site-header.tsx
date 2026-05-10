import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="border-b border-hairline bg-paper/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="section-wrap flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-medium text-ink">
          <span className="inline-block size-2 rounded-full bg-saffron" aria-hidden />
          Sypher
        </Link>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] text-ink-muted sm:justify-end sm:gap-x-5">
          <a href="#products" className="hover:text-ink transition-colors">
            Products
          </a>
          <a href="#about" className="hover:text-ink transition-colors">
            About
          </a>
          <a href="#waitlist" className="hover:text-ink transition-colors">
            Waitlist
          </a>
          <Link href="/blog" className="hover:text-ink transition-colors">
            Blog
          </Link>
          <ThemeToggle />
          <Link href="/pegasus" className="btn btn-primary">
            Open Pegasus
          </Link>
        </nav>
      </div>
    </header>
  );
}

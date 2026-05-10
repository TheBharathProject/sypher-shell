import Link from "next/link";

const products = [
  {
    name: "Pegasus",
    href: "/pegasus",
    external: false,
    state: "Live now",
    kicker: "Job hunt tracker",
    body:
      "A quieter way to track applications, recruiter conversations, notes, and resume versions.",
    cta: "Open Pegasus",
  },
  {
    name: "Merge Up",
    href: "https://play.google.com/store/apps/details?id=com.merge.mergeup",
    external: true,
    state: "On Android",
    kicker: "Puzzle game",
    body:
      "A lightweight merge puzzle game with a cleaner, simpler play loop built on the same small-product shelf.",
    cta: "Open in Play Store",
  },
];

export function Hero() {
  return (
    <section id="products" className="section-wrap pt-20 pb-28 md:pt-28 md:pb-36">
      <div className="text-center">
        <span className="pill mb-6">
          <span className="pill-dot" aria-hidden />
          Live on Sypher
        </span>

        <h1 className="t-display mx-auto max-w-[900px] text-[clamp(40px,6vw,72px)] text-balance">
          Small products, clearly placed, for the jobs you actually do.
        </h1>

        <p className="mx-auto mt-6 max-w-[700px] text-[16px] leading-[1.75] text-ink-muted md:text-[17px]">
          Sypher is a small shelf of focused tools. Right now that means
          Pegasus for job seekers and Merge Up on mobile, with more products
          coming slowly and on purpose.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:items-center">
          <Link href="/pegasus" className="btn btn-primary">
            Open Pegasus
            <span className="arrow" aria-hidden>
              →
            </span>
          </Link>
          <Link href="/blog" className="btn btn-secondary">
            Read the blog
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-5 md:grid-cols-2">
        {products.map((product) => {
          const body = (
            <div className="group h-full rounded-[20px] border border-hairline bg-card p-7 text-left transition duration-200 hover:-translate-y-0.5 hover:border-ink">
              <div className="flex items-center justify-between gap-4">
                <p className="t-eyebrow">{product.state}</p>
                <span className="text-[13px] text-ink-faint">{product.kicker}</span>
              </div>
              <h2 className="t-display mt-6 text-[clamp(30px,4vw,38px)]">
                {product.name}
              </h2>
              <p className="mt-4 max-w-[46ch] text-[14px] leading-[1.75] text-ink-muted md:text-[15px]">
                {product.body}
              </p>
              <div className="mt-8 inline-flex items-center gap-2 text-[13px] font-medium text-ink">
                <span>{product.cta}</span>
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </div>
          );

          return product.external ? (
            <a
              key={product.name}
              href={product.href}
              target="_blank"
              rel="noreferrer"
              className="block h-full"
            >
              {body}
            </a>
          ) : (
            <Link key={product.name} href={product.href} className="block h-full">
              {body}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

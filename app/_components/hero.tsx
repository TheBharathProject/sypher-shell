import Link from "next/link";

const products = [
  {
    name: "Pegasus",
    slug: "/pegasus",
    state: "Live now",
    kicker: "Job hunt tracker",
    body:
      "A quieter way to track applications, recruiter conversations, notes, and resume versions.",
    cta: "Open Pegasus",
  },
  {
    name: "Merge Up",
    slug: "/mergeup-privacy-policy.md",
    state: "Also shipped",
    kicker: "Puzzle game",
    body:
      "A lightweight merge puzzle game built and shipped as part of the same product shelf.",
    cta: "See product info",
  },
];

export function Hero() {
  return (
    <section className="section-wrap pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="text-center">
        <span className="pill mb-6">
          <span className="pill-dot" aria-hidden />
          Live on Sypher
        </span>

        <h1 className="t-display mx-auto max-w-[880px] text-[clamp(42px,6.2vw,80px)] text-balance">
          Small products, clearly placed, for the jobs you actually do.
        </h1>

        <p className="mx-auto mt-6 max-w-[650px] text-[17px] leading-[1.75] text-ink-muted md:text-[18px]">
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

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <article key={product.name} className="card rounded-[22px] p-7 text-left">
            <div className="flex items-center justify-between gap-4">
              <p className="t-eyebrow">{product.state}</p>
              <span className="text-[12px] text-ink-faint font-mono">{product.slug}</span>
            </div>
            <h2 className="t-display mt-4 text-[34px]">{product.name}</h2>
            <p className="mt-2 text-[15px] text-ink">{product.kicker}</p>
            <p className="mt-4 max-w-[48ch] text-[14px] leading-relaxed text-ink-muted">
              {product.body}
            </p>
            <Link
              href={product.slug}
              className="mt-6 inline-flex text-[14px] font-medium text-ink underline decoration-hairline underline-offset-4 hover:decoration-ink"
            >
              {product.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

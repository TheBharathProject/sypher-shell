import Link from "next/link";
import { liveTools, upcomingTools, type Tool } from "@/lib/tools-registry";

export function ToolsSection() {
  const live = liveTools();
  const upcoming = upcomingTools();

  return (
    <section id="tools">
      <div className="section-wrap py-20 md:py-28">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
          <div>
            <p className="t-eyebrow mb-4">The library</p>
            <h2 className="t-display max-w-[700px] text-[clamp(30px,4.2vw,48px)]">
              Live now, next up, and never bundled into one giant product.
            </h2>
          </div>
          <div className="rounded-[18px] border border-hairline bg-deep px-5 py-4 text-[14px] leading-relaxed text-ink-muted">
            Each tool is its own product. Pay for one, ignore the rest, and
            never inherit features that belong to someone else&rsquo;s workflow.
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p className="t-eyebrow">Live now</p>
              <p className="text-[13px] text-ink-faint">
                Open the real thing, not a mock waitlist.
              </p>
            </div>
            {live.length > 0 ? (
              live.map((t) => <ToolCard key={t.slug} tool={t} state="live" />)
            ) : (
              <ToolCardEmpty />
            )}
          </div>

          <div className="space-y-4">
            <article className="rounded-[22px] border border-hairline bg-deep px-5 py-5">
              <p className="t-eyebrow">Next in queue</p>
              <h3 className="t-display mt-3 text-[26px]">The roadmap stays small on purpose.</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                Sypher is not trying to become a suite. It is trying to become a
                shelf of precise tools that earn their keep individually.
              </p>
            </article>

            {upcoming.length > 0 ? (
              upcoming.map((t) => <ToolCard key={t.slug} tool={t} state="upcoming" />)
            ) : (
              <ToolCardEmpty />
            )}

            {live.length === 0 && upcoming.length === 0 ? <ToolCardEmpty /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolCard({ tool, state }: { tool: Tool; state: "live" | "upcoming" }) {
  const live = state === "live";
  const inner = (
    <>
      <div className="mb-6 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.12em] ${
            live ? "text-saffron" : "text-ink-faint"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              live ? "bg-saffron" : "bg-ink-faint"
            }`}
            aria-hidden
          />
          {live ? "Live" : "Coming soon"}
        </span>
        <span className="text-[12px] text-ink-faint font-mono">
          /{tool.slug}
        </span>
      </div>

      <h3 className="t-display text-[30px]">{tool.name}</h3>
      <p className="mt-2 text-[16px] leading-relaxed text-ink">
        {tool.tagline}
      </p>
      <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-ink-muted">
        {tool.description}
      </p>

      {tool.seoKeywords?.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {tool.seoKeywords.slice(0, 3).map((keyword) => (
            <span key={keyword} className="pill bg-paper px-3 py-1.5 text-[12px]">
              {keyword}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex items-center justify-between border-t border-hairline pt-4 text-[13px]">
        {tool.priceInr ? (
          <span className="font-medium text-ink">
            ₹{tool.priceInr}
            <span className="text-ink-faint">/mo</span>
          </span>
        ) : (
          <span className="text-ink-faint">{live ? "Available now" : "Independent pricing"}</span>
        )}
        <span className="text-ink-faint">
          {live ? "Open tool →" : tool.launchHint ?? "soon"}
        </span>
      </div>
    </>
  );

  if (live) {
    return (
      <Link href={`/${tool.slug}`} className="card card-hover block rounded-[24px] p-7">
        {inner}
      </Link>
    );
  }
  return <div className="card rounded-[24px] p-7">{inner}</div>;
}

function ToolCardEmpty() {
  return (
    <article className="card flex min-h-[220px] flex-col justify-between border-dashed rounded-[24px] p-7">
      <span className="text-[12px] uppercase tracking-[0.12em] text-ink-faint">
        Tool coming
      </span>
      <h3 className="t-display text-[28px] text-ink-faint">In planning</h3>
      <span className="text-[12px] text-ink-faint">
        Idea → roadmap → ship
      </span>
    </article>
  );
}

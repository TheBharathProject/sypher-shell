import Link from "next/link";
import { liveTools, upcomingTools, type Tool } from "@/lib/tools-registry";

export function ToolsSection() {
  const live = liveTools();
  const upcoming = upcomingTools();

  return (
    <section id="tools">
      <div className="section-wrap py-20 md:py-28">
        <div>
          <p className="t-eyebrow mb-4">The library</p>
          <h2 className="t-display max-w-[700px] text-[clamp(30px,4.2vw,48px)]">
            Live now, next up, and never bundled into one giant product.
          </h2>
          <p className="mt-5 max-w-[580px] text-[15px] leading-relaxed text-ink-muted">
            Every tool stands alone. Pay for one, ignore the rest, and never
            inherit features that belong to someone else&rsquo;s workflow.
          </p>
        </div>

        <div className="mt-14 space-y-12">
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="t-eyebrow">Live now</p>
              <p className="text-[13px] text-ink-faint">Open the real thing, not a placeholder.</p>
            </div>

            <div className="mt-5 grid gap-4">
              {live.length > 0 ? live.map((t) => <ToolCard key={t.slug} tool={t} state="live" />) : <ToolCardEmpty />}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="t-eyebrow">Next up</p>
              <p className="text-[13px] text-ink-faint">Roadmap stays deliberately small.</p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {upcoming.length > 0 ? upcoming.map((t) => <ToolCard key={t.slug} tool={t} state="upcoming" />) : <ToolCardEmpty />}
            </div>
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

      <h3 className="t-display text-[28px]">{tool.name}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink">
        {tool.tagline}
      </p>
      <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-ink-muted">
        {tool.description}
      </p>

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
      <Link href={`/${tool.slug}`} className="card card-hover block rounded-[20px] p-7">
        {inner}
      </Link>
    );
  }
  return <div className="card rounded-[20px] p-7">{inner}</div>;
}

function ToolCardEmpty() {
  return (
    <article className="card flex min-h-[200px] flex-col justify-between border-dashed rounded-[20px] p-7">
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

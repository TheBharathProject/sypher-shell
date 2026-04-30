import Link from "next/link";
import { liveTools, upcomingTools, type Tool } from "@/lib/tools-registry";

export function ToolsSection() {
  const live = liveTools();
  const upcoming = upcomingTools();

  return (
    <section id="tools">
      <div className="section-wrap py-20 md:py-28 text-center">
        <p className="t-eyebrow mb-4">The library</p>
        <h2 className="t-display text-[clamp(28px,4vw,44px)] max-w-[640px] mx-auto">
          One tool, one problem.{" "}
          <span className="t-display-italic">Pay only for what you use.</span>
        </h2>
        <p className="mt-5 text-[15px] text-ink-muted max-w-[540px] mx-auto">
          Each tool is its own product. Open one in a tab and forget the rest
          exist. Your subscription to one doesn&rsquo;t auto-charge for any
          other.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {live.map((t) => (
            <ToolCard key={t.slug} tool={t} state="live" />
          ))}
          {upcoming.map((t) => (
            <ToolCard key={t.slug} tool={t} state="upcoming" />
          ))}
          {Math.max(0, 2 - live.length - upcoming.length) > 0 &&
            Array.from({ length: 2 - live.length - upcoming.length }).map(
              (_, i) => <ToolCardEmpty key={`empty-${i}`} />,
            )}
        </div>
      </div>
    </section>
  );
}

function ToolCard({ tool, state }: { tool: Tool; state: "live" | "upcoming" }) {
  const live = state === "live";
  const inner = (
    <>
      <div className="flex items-center justify-between mb-6">
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

      <h3 className="text-[22px] font-semibold tracking-tight">{tool.name}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
        {tool.tagline}
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
        {tool.description}
      </p>

      <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between text-[13px]">
        {tool.priceInr ? (
          <span className="font-medium text-ink">
            ₹{tool.priceInr}
            <span className="text-ink-faint">/mo</span>
          </span>
        ) : (
          <span />
        )}
        <span className="text-ink-faint">
          {live ? "Open →" : tool.launchHint ?? "soon"}
        </span>
      </div>
    </>
  );

  if (live) {
    return (
      <Link href={`/${tool.slug}`} className="card card-hover block">
        {inner}
      </Link>
    );
  }
  return <div className="card">{inner}</div>;
}

function ToolCardEmpty() {
  return (
    <article className="card border-dashed flex flex-col justify-between min-h-[200px]">
      <span className="text-[12px] uppercase tracking-[0.12em] text-ink-faint">
        Tool coming
      </span>
      <h3 className="text-[20px] text-ink-faint">In planning</h3>
      <span className="text-[12px] text-ink-faint">
        Idea → roadmap → ship
      </span>
    </article>
  );
}

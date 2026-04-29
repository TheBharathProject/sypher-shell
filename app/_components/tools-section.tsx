import Link from "next/link";
import { liveTools, upcomingTools, type Tool } from "@/lib/tools-registry";

export function ToolsSection() {
  const live = liveTools();
  const upcoming = upcomingTools();
  const totalSlots = Math.max(3, live.length + upcoming.length);

  return (
    <section id="tools">
      <div className="mx-auto max-w-[1200px] px-6 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-4">
            <p className="t-section-marker mb-5">// 02 / tools</p>
            <h2 className="t-display text-[36px] leading-[0.95] md:text-[52px]">
              The{" "}
              <span className="t-display-italic">library</span>.
            </h2>
            <p className="t-mono mt-5 max-w-sm text-[13px] leading-relaxed text-bone-muted md:text-[14px]">
              Each tool is its own focused product. Pay for what you use. Open
              one in a tab and forget the rest exist.
            </p>

            {live.length === 0 && (
              <div className="t-mono mt-6 inline-flex items-center gap-3 border border-hairline px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-bone-muted">
                <span className="size-1.5 rounded-full bg-decode" aria-hidden />
                <span>Library opening this month</span>
              </div>
            )}
          </div>

          <div className="md:col-span-8">
            {live.length > 0 && (
              <>
                <p className="t-section-marker mb-3">live</p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {live.map((t) => (
                    <ToolCardLive key={t.slug} tool={t} />
                  ))}
                </div>
              </>
            )}

            {upcoming.length > 0 && (
              <>
                <p
                  className={`t-section-marker mb-3 ${
                    live.length > 0 ? "mt-10" : ""
                  }`}
                >
                  decoding next
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {upcoming.map((t) => (
                    <ToolCardUpcoming key={t.slug} tool={t} />
                  ))}
                  {Array.from({
                    length: Math.max(
                      0,
                      Math.min(2, totalSlots - upcoming.length - live.length),
                    ),
                  }).map((_, i) => (
                    <ToolCardEmpty key={`empty-${i}`} index={live.length + upcoming.length + i + 1} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolCardLive({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group relative block border border-hairline bg-paper-deep p-5 transition-colors hover:border-bone hover:bg-bone hover:text-paper md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="t-mono text-[10px] uppercase tracking-[0.18em] text-decode group-hover:text-saffron">
          live
        </span>
        <span className="t-mono text-[10px] uppercase tracking-[0.18em] opacity-50">
          /{tool.slug}
        </span>
      </div>

      <h3 className="t-display mt-8 text-[26px] leading-[1] md:text-[34px]">
        {tool.name}
      </h3>
      <p className="t-mono mt-2.5 text-[12px] leading-relaxed opacity-80 md:text-[13px]">
        {tool.tagline}
      </p>

      <div className="mt-7 flex items-center justify-between border-t border-current/10 pt-3">
        {tool.priceInr ? (
          <span className="t-mono text-[11px] uppercase tracking-[0.16em]">
            ₹{tool.priceInr}/mo
          </span>
        ) : (
          <span />
        )}
        <span className="t-mono text-[11px] uppercase tracking-[0.16em]">
          open <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

function ToolCardUpcoming({ tool }: { tool: Tool }) {
  return (
    <article className="cipher-seal relative border border-hairline bg-paper-deep p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="t-mono inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-decode">
          <span className="size-1.5 rounded-full bg-decode animate-pulse" />
          decoding
        </span>
        <span className="t-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
          /{tool.slug}
        </span>
      </div>

      <h3 className="t-display mt-7 text-[26px] leading-[1] md:text-[34px]">
        {tool.name}
      </h3>
      <p className="t-mono mt-2.5 text-[12px] leading-relaxed text-bone-muted md:text-[13px]">
        {tool.tagline}
      </p>
      <p className="t-mono mt-4 max-w-md text-[12px] leading-relaxed text-bone md:text-[13px]">
        {tool.description}
      </p>

      <div className="mt-7 flex items-center justify-between border-t border-hairline pt-3">
        {tool.priceInr ? (
          <span className="t-mono text-[11px] uppercase tracking-[0.16em] text-bone">
            ₹{tool.priceInr}/mo
          </span>
        ) : (
          <span />
        )}
        <span className="t-mono text-[11px] uppercase tracking-[0.16em] text-bone-muted">
          {tool.launchHint ?? "soon"}
        </span>
      </div>
    </article>
  );
}

function ToolCardEmpty({ index }: { index: number }) {
  const label = String(index).padStart(2, "0");
  return (
    <article className="cipher-seal flex min-h-[210px] flex-col justify-between border border-dashed border-hairline-bright p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <span className="t-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
          tool {label}
        </span>
        <span className="t-mono text-[10px] uppercase tracking-[0.18em] text-bone-faint">
          ████████
        </span>
      </div>
      <h3 className="t-display text-[24px] leading-[1] text-bone-faint md:text-[30px]">
        Encrypted.
      </h3>
      <p className="t-mono text-[10px] uppercase tracking-[0.16em] text-bone-faint">
        ideas → roadmap → ship
      </p>
    </article>
  );
}

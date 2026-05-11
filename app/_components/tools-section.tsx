export function ToolsSection() {
  return (
    <section id="products" className="border-t border-hairline bg-deep">
      <div className="section-wrap py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {/* Pegasus */}
          <a href="/pegasus" className="card card-hover block">
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-saffron">
                <span className="size-1.5 rounded-full bg-saffron" aria-hidden />
                Live
              </span>
              <span className="text-[11px] text-ink-faint font-mono">/pegasus</span>
            </div>
            <h3 className="text-[22px] font-semibold tracking-tight">Pegasus</h3>
            <p className="mt-2 text-[14px] text-ink-muted leading-relaxed">
              A quieter way to track your job hunt. Log applications, track stages, and
              stay on top of follow-ups — without the noise of a full-blown ATS.
            </p>
            <div className="mt-5 pt-4 border-t border-hairline flex items-center justify-end text-[13px] text-ink-faint">
              Open Pegasus →
            </div>
          </a>

          {/* Merge Up */}
          <a
            href="https://play.google.com/store/apps/details?id=com.merge.mergeup"
            target="_blank"
            rel="noopener noreferrer"
            className="card card-hover block"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-saffron">
                <span className="size-1.5 rounded-full bg-saffron" aria-hidden />
                Live · Play Store
              </span>
              <span className="text-[11px] text-ink-faint font-mono">/merge-up</span>
            </div>
            <h3 className="text-[22px] font-semibold tracking-tight">Merge Up</h3>
            <p className="mt-2 text-[14px] text-ink-muted leading-relaxed">
              A puzzle game where you merge numbered tiles to reach higher scores.
              Privacy-first — only a username and score, nothing personal.
            </p>
            <div className="mt-5 pt-4 border-t border-hairline flex items-center justify-end text-[13px] text-ink-faint">
              Get on Play Store →
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

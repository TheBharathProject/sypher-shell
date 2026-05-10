interface QA {
  q: string;
  a: string;
}

const faqs: QA[] = [
  {
    q: "What is Sypher exactly?",
    a: "A small studio that ships small internet tools one at a time. Each product focuses on a single job for a specific kind of user, instead of trying to become a giant suite.",
  },
  {
    q: "What is live right now?",
    a: "Pegasus. It is a calm job-application tracker for managing roles, recruiter threads, resumes, and interview notes without using a sales CRM for your personal job hunt.",
  },
  {
    q: "What is shipping next?",
    a: "Reel Hooks. It is for creators who want to compare standout reels in their niche, understand why they worked, and turn that into ideas they can actually use.",
  },
  {
    q: "Do I have to subscribe to everything?",
    a: "No. Every tool stands on its own. Paying for one product does not silently sign you up for the rest, and the goal is to keep each subscription easy to understand.",
  },
  {
    q: "Why keep the tools so small?",
    a: "Because focused products are easier to trust, easier to learn, and easier to price fairly. The moment a tool starts carrying features for five unrelated users, it gets slower and worse.",
  },
  {
    q: "Will my data be sold or used to train models?",
    a: "No. Customer data, payments, and anything you store inside a tool stay private to you. Sypher sells software, not customer information.",
  },
  {
    q: "Who builds this?",
    a: "Shubham Dixit. Solo founder. Ships quietly, iterates often, and keeps the software smaller when possible.",
  },
];

export function FAQ() {
  return (
    <section id="faq">
      <div className="section-wrap py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14">
          <div>
            <p className="t-eyebrow mb-4">Questions</p>
            <h2 className="t-display text-[clamp(30px,4.2vw,48px)]">
              The practical questions people usually ask first.
            </h2>
            <p className="mt-5 max-w-[290px] text-[15px] leading-relaxed text-ink-muted">
              The point of this page is clarity. The point of the products is the
              same.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((item, i) => (
              <details key={i} className="card group rounded-[20px] [&[open]]:border-ink">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <span className="text-[15px] md:text-[16px] font-medium tracking-tight">
                    {item.q}
                  </span>
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-ink-faint transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 max-w-[62ch] text-[14px] leading-relaxed text-ink-muted">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

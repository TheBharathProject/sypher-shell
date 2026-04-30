interface QA {
  q: string;
  a: string;
}

const faqs: QA[] = [
  {
    q: "What is Sypher exactly?",
    a: "A small studio that ships small SaaS tools, one at a time. Each tool focuses on a single specific job for a single audience and is priced affordably. The first tool, Reel Hooks, launches this month.",
  },
  {
    q: "Why ₹99/month?",
    a: "Because that's the unit we work in. We're building for the Indian market first, where ₹99 is the price point that converts. Some tools may cost more — anything heavy on AI inference will be a Pro tier — but the goal is for the entry-level price to feel like nothing.",
  },
  {
    q: "Do I have to subscribe to all tools?",
    a: "No. Each tool is its own product with its own subscription. Paying for Reel Hooks doesn't auto-charge you for anything else, and you can cancel any tool independently from your account page.",
  },
  {
    q: "What's actually launching first?",
    a: "Reel Hooks. You give it two Instagram creators in your niche, and once a week you get the top 10 reels from each — with full transcripts, hook breakdowns explaining what's working, and three reel concepts rewritten in your voice ready to post.",
  },
  {
    q: "Will my data be sold or used to train models?",
    a: "No. Subscriptions, payments, and content you analyze stay private to you. We're not in the data brokerage business — we sell tools, not customer information.",
  },
  {
    q: "Who builds this?",
    a: "Shubham Dixit. Solo founder. Builds quietly, ships often. Reach out at buildwithshubham.dixit@gmail.com.",
  },
];

export function FAQ() {
  return (
    <section id="faq">
      <div className="section-wrap py-20 md:py-28">
        <div className="text-center">
          <p className="t-eyebrow mb-4">Questions</p>
          <h2 className="t-display text-[clamp(28px,4vw,44px)] max-w-[640px] mx-auto">
            You&rsquo;re probably{" "}
            <span className="t-display-italic">wondering</span>…
          </h2>
        </div>

        <div className="mt-14 max-w-[720px] mx-auto space-y-3">
          {faqs.map((item, i) => (
            <details key={i} className="card group [&[open]]:border-ink">
              <summary className="flex items-center justify-between cursor-pointer list-none gap-6">
                <span className="text-[15px] md:text-[16px] font-medium tracking-tight">
                  {item.q}
                </span>
                <span
                  className="size-7 shrink-0 rounded-full flex items-center justify-center text-ink-faint transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-[14px] leading-relaxed text-ink-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

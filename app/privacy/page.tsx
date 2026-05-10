import { SiteHeader } from "../_components/site-header";
import { SiteFooter } from "../_components/site-footer";

export const dynamic = "force-static";

export const metadata = {
  title: "Privacy",
  description:
    "How Sypher handles your data, who else sees it, and the controls you have over it.",
  alternates: { canonical: "https://sypher.in/privacy" },
};

const sections = [
  {
    heading: "What we collect",
    paragraphs: [
      "Sypher collects the smallest amount of personal data we can get away with while still being a useful set of tools. When you sign in, we receive your name, email, profile picture, and a stable account ID from your identity provider. That's the entire account record at the platform layer.",
      "Beyond that, the data inside each tool is whatever you put there. In Pegasus, that's the applications, notes, resumes, and AI prompts you create. In future tools, the categories will be different but the rule is the same: only what you explicitly hand over, never anything enriched, scraped, or cross-referenced against external databases.",
    ],
  },
  {
    heading: "What we don't collect",
    paragraphs: [
      "We don't track you across the web. There are no third-party analytics SDKs, no behavioural pixels, no fingerprinting, no ad networks. We don't read your inbox, scrape your social profiles, or pull anything from your browser beyond what you've explicitly typed into a Sypher interface.",
    ],
  },
  {
    heading: "Where it lives",
    paragraphs: [
      "Application data sits in a Postgres database, with row-level isolation per user. File uploads (resumes, cover letters, anything similar) go to Cloudflare R2 with private signed URLs — nobody outside the app can list or download them. Both tiers are encrypted in transit (TLS) and at rest. Backups follow the same encryption.",
      "When you ask one of our AI features to write a cover letter or critique a resume, the contents of that single request are passed to our LLM provider for inference and then discarded. The provider doesn't retain the prompt or use it for future training.",
    ],
  },
  {
    heading: "Who else sees it",
    paragraphs: [
      "A small set of vendors get a narrow slice of data, and only what they need to do their job:",
    ],
    bullets: [
      "Google — handles the OAuth sign-in handshake.",
      "Cloudflare R2 — stores files you've uploaded.",
      "Our LLM provider — receives the contents of an AI request only at the moment you trigger it.",
      "Stripe (when paid tools land) — handles the billing handshake. They see the email and payment method, never the contents of your account.",
    ],
  },
  {
    heading: "Your controls",
    paragraphs: [
      "You can edit or delete any item in any tool at any time. If you want everything gone — account included — email us and we'll wipe the row tree across every tool you've used. No retention games, no dark-patterned \"are you sure?\" loops designed to talk you out of it.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "We use one thing that walks like a cookie: a JWT in localStorage that proves you're logged in. We don't set tracking cookies, advertising cookies, or anything that would make a cookie banner necessary.",
    ],
  },
  {
    heading: "Tools inherit this policy",
    paragraphs: [
      "Every tool inside Sypher — Pegasus today, more tomorrow — operates under this same policy. If a specific tool needs to handle a category of data not covered here (say, recordings, or bank links), the tool's own page will describe that category before you give it to us, and the broader principles still apply.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "If we change anything material, we'll update the \"Last updated\" date below and post a note in the changelog. We won't quietly broaden what we collect.",
    ],
  },
  {
    heading: "Get in touch",
    paragraphs: [
      "Questions, requests, or concerns: reply to any system email. A real person reads it.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="section-wrap py-16 md:py-24">
        <article className="max-w-[680px] mx-auto">
          <header className="pb-10 border-b border-hairline">
            <p className="t-eyebrow mb-4">Sypher · Privacy</p>
            <h1 className="t-display text-[clamp(36px,5vw,56px)]">
              Your data, on a tight leash.
            </h1>
            <p className="mt-6 text-[17px] md:text-[19px] leading-[1.55] text-ink-muted t-display-italic">
              We built Sypher because the tools we wanted didn&rsquo;t exist — and the
              ones that did quietly turned the user into the product. Here&rsquo;s the
              honest version of what we keep, what we don&rsquo;t, and where the line is.
            </p>
            <p className="mt-8 t-eyebrow">Last updated · 8 May 2026</p>
          </header>

          <div className="mt-12 space-y-12">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="t-display text-[clamp(20px,2.6vw,28px)] mb-4">
                  {s.heading}
                </h2>
                {s.paragraphs.map((p) => (
                  <p
                    key={p}
                    className="mt-4 text-[16px] leading-[1.75] text-ink-muted first:mt-0"
                  >
                    {p}
                  </p>
                ))}
                {s.bullets ? (
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="pl-6 relative text-[16px] leading-[1.7] text-ink-muted before:content-['—'] before:absolute before:left-0 before:text-ink-faint"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

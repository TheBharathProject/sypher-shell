import { SiteHeader } from "../_components/site-header";
import { SiteFooter } from "../_components/site-footer";

export const dynamic = "force-static";

export const metadata = {
  title: "Terms",
  description: "Plain-English terms of use for Sypher and every tool inside it.",
  alternates: { canonical: "https://sypher.in/terms" },
};

const sections = [
  {
    heading: "Who we are",
    paragraphs: [
      "Sypher is an indie studio maintained by Shubham Dixit. Inside it sits a small set of focused tools — Pegasus today, more on the way. Sypher is not a venture-backed company, not a CRM, and not chasing your data. By using it you agree to the spirit of the deal below: we keep the tools calm and useful, you don't try to break them for other people.",
    ],
  },
  {
    heading: "Your account",
    paragraphs: [
      "You sign in via OAuth (Google for now). That means we never see a password and have nothing to leak. You're responsible for the upstream account you authenticate with; if it gets compromised, we have no way to know it wasn't really you.",
    ],
  },
  {
    heading: "What you can put in",
    paragraphs: [
      "Each tool has its own input — applications and resumes for Pegasus, reels for Reel Hooks, and so on. Common rule: only put in content that's yours to share. Don't upload someone else's resume without their consent, don't paste content you don't have rights to, and don't use the AI features to generate material you'd be embarrassed to defend.",
    ],
  },
  {
    heading: "What you can't",
    paragraphs: [
      "Don't try to extract data about other users. Don't probe the API for vulnerabilities without telling us first — we'll happily collaborate on responsible disclosure, but we won't tolerate quiet exploitation. Don't run automated scrapers against any community surface, public profile listing, or shared feed.",
    ],
  },
  {
    heading: "Free tools and paid tools",
    paragraphs: [
      "Some tools (like Pegasus) are free for individuals. Others (like Reel Hooks) carry a small subscription. Either way: we don't run ads, sell data, or cross-sell. Free doesn't come with a warranty or an uptime guarantee — we try to keep things running well; when we can't, we'll tell you straight rather than dressing it up.",
    ],
  },
  {
    heading: "Your content stays yours",
    paragraphs: [
      "Anything you put into a Sypher tool belongs to you. We get a narrow license to store and display it back to you, run AI requests you trigger, and host the files you upload — nothing more. We don't republish your data, and we don't train models on it.",
    ],
  },
  {
    heading: "Ending the relationship",
    paragraphs: [
      "You can delete your account at any time and the data goes with it across every tool. We may suspend an account if it's being used to harass, scrape, or break things — that's the only category that justifies a forced removal.",
    ],
  },
  {
    heading: "Changes",
    paragraphs: [
      "If we change these terms, we'll bump the \"Last updated\" date below and announce it in the changelog. We won't tuck consequential changes into a 4 AM patch.",
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      "If something here doesn't sit right, reply to any system email. We'd rather have the conversation than have you bounce out quietly.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="section-wrap py-16 md:py-24">
        <article className="max-w-[680px] mx-auto">
          <header className="pb-10 border-b border-hairline">
            <p className="t-eyebrow mb-4">Sypher · Terms</p>
            <h1 className="t-display text-[clamp(36px,5vw,56px)]">The handshake.</h1>
            <p className="mt-6 text-[17px] md:text-[19px] leading-[1.55] text-ink-muted t-display-italic">
              Plain-English terms of use. Read them once, ignore them most of the time,
              come back if something feels off. We tried to write the version a person
              can actually parse without a lawyer in the loop.
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
              </section>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

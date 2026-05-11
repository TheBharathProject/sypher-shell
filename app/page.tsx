import { SiteHeader } from "./_components/site-header";
import { Hero } from "./_components/hero";
import { ToolsSection } from "./_components/tools-section";
import { OneAccount } from "./_components/one-account";
import { Maker } from "./_components/maker";
import { Principles } from "./_components/principles";
import { ClosingCta } from "./_components/closing-cta";
import { SiteFooter } from "./_components/site-footer";

export const dynamic = "force-static";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sypher",
    url: "https://sypher.in",
    description:
      "A growing library of small SaaS tools, each focused on a single specific job.",
    founder: {
      "@type": "Person",
      name: "Shubham Dixit",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ToolsSection />
        <OneAccount />
        <Maker />
        <Principles />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}

import { SiteHeader } from "./_components/site-header";
import { Hero } from "./_components/hero";
import { Manifesto } from "./_components/manifesto";
import { ToolsSection } from "./_components/tools-section";
import { Method } from "./_components/method";
import { Maker } from "./_components/maker";
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
      "A factory of small, sharp tools for the Indian creator economy.",
    foundingLocation: {
      "@type": "Place",
      name: "Mumbai, India",
    },
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
        <Manifesto />
        <ToolsSection />
        <Method />
        <Maker />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}

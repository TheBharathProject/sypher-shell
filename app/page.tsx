import { SiteHeader } from "./_components/site-header";
import { Hero } from "./_components/hero";
import { Maker } from "./_components/maker";
import { SiteFooter } from "./_components/site-footer";

export const dynamic = "force-static";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sypher",
    url: "https://sypher.in",
    description:
      "Pegasus is live now on Sypher. More focused tools are coming soon.",
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
        <Maker />
      </main>
      <SiteFooter />
    </>
  );
}

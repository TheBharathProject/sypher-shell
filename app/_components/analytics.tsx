import Script from "next/script";

/**
 * Google Analytics (GA4). Only loads when NEXT_PUBLIC_GA_ID is set,
 * so localhost / preview deploys without the env var don't pollute analytics.
 *
 * To track a custom event from anywhere in the app:
 *   declare global { interface Window { gtag?: (...args: unknown[]) => void } }
 *   window.gtag?.("event", "waitlist_submitted", { source: "homepage" });
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', {
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
    </>
  );
}

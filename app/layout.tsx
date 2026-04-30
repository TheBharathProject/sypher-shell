import type { Metadata } from "next";
import { Instrument_Serif, Geist } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sypher.in"),
  title: {
    default: "Sypher — Small tools that decode the thing you're stuck on",
    template: "%s · Sypher",
  },
  description:
    "A growing library of small SaaS tools — each focused on a single specific job. Reels, trading data, captions, and more. One tool, one problem, ₹99-ish a month.",
  keywords: [
    "small saas tools",
    "creator tools",
    "trading data tools",
    "indie saas",
    "indian saas",
    "instagram reel analyzer",
  ],
  alternates: { canonical: "https://sypher.in" },
  openGraph: {
    type: "website",
    siteName: "Sypher",
    title: "Sypher — Small tools that decode the thing you're stuck on",
    description:
      "A growing library of small SaaS tools — each focused on a single specific job.",
    url: "https://sypher.in",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sypher",
    description:
      "Small tools that decode the thing you're stuck on.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}

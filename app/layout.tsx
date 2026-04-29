import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sypher.in"),
  title: {
    default: "Sypher — Tools for creators who ship faster than the algorithm",
    template: "%s · Sypher",
  },
  description:
    "A growing factory of small, sharp tools for the Indian creator economy. Decode what's working in your niche — and turn it into your next post.",
  keywords: [
    "creator tools",
    "instagram reel analyzer",
    "indian creator economy",
    "content research",
    "hook analysis",
  ],
  alternates: { canonical: "https://sypher.in" },
  openGraph: {
    type: "website",
    siteName: "Sypher",
    title: "Sypher — Tools for creators who ship faster than the algorithm",
    description:
      "A growing factory of small, sharp tools for the Indian creator economy.",
    url: "https://sypher.in",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sypher",
    description:
      "Tools for creators who ship faster than the algorithm.",
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
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-bone selection:bg-decode selection:text-ink">
        {children}
      </body>
    </html>
  );
}

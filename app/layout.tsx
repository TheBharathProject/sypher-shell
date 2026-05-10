import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "./_components/analytics";
import { StorageSync } from "./_components/storage-sync";

export const metadata: Metadata = {
  metadataBase: new URL("https://sypher.in"),
  title: {
    default: "Sypher — Small tools, clearly placed",
    template: "%s · Sypher",
  },
  description:
    "Pegasus and Merge Up live on Sypher. One sign-in, small focused products, and more tools coming soon.",
  keywords: [
    "small saas tools",
    "indie saas",
    "indian saas",
    "job application tracker",
    "mobile puzzle game",
    "pegasus",
    "merge up",
  ],
  alternates: { canonical: "https://sypher.in" },
  openGraph: {
    type: "website",
    siteName: "Sypher",
    title: "Sypher — Small tools, clearly placed",
    description:
      "Pegasus and Merge Up live on Sypher. More focused tools are coming soon.",
    url: "https://sypher.in",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sypher",
    description:
      "Pegasus and Merge Up live on Sypher. More focused tools are coming soon.",
  },
  robots: { index: true, follow: true },
};

// Inline boot script — runs before first paint to avoid a flash of the wrong
// theme on every page load. Reads localStorage["sypher.theme"] (the same key
// every Sypher tool uses on the same origin), falls back to OS preference,
// stamps data-theme on <html>. Pegasus uses the same boot logic.
const themeBootScript = `
try {
  var pref = localStorage.getItem('sypher.theme') || 'system';
  var resolved = pref === 'system'
    ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    : pref;
  document.documentElement.dataset.theme = resolved;
} catch (e) {
  document.documentElement.dataset.theme = 'light';
}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className="h-full antialiased">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <StorageSync />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

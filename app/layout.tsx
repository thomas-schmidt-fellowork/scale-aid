import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl, siteDescription, siteName } from "@/app/lib/site";
import TopBar from "@/app/components/top-bar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "gitarrenskalen lernen",
    "gitarre scales üben",
    "gitarre pentatonik trainer",
    "blues scale gitarre",
    "fretboard trainer",
  ],
  category: "education",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName,
    title: siteName,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(5,7,11,0.78)] backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-full max-w-[100rem] items-center px-6 sm:px-8 lg:px-10">
            <TopBar />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}

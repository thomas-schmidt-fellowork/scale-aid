import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Scale Aid",
  description: "Scale Aid helps you navigate the guitar fretboard with a clean note map through fret 24.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b border-white/10 bg-[rgba(5,7,11,0.78)] backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-full max-w-[100rem] items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_rgba(77,255,196,0.4)]" />
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white">
                Scale Aid
              </span>
            </div>
            <nav aria-label="Primary" className="flex min-h-9 items-center gap-2" />
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}

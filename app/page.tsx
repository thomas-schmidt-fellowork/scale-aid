import type { Metadata } from "next";
import Link from "next/link";

import { getSiteUrl, siteName } from "@/app/lib/site";

const landingDescription =
  "Scale Aid macht Scales üben auf der Gitarre leichter: mit A-Moll-Pentatonik starten, in jede Tonart wechseln, Blues Notes dazunehmen und Schritt für Schritt das Griffbrett erweitern.";

export const metadata: Metadata = {
  title: "Gitarrenskalen üben und lernen",
  description: landingDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Scale Aid für Gitarrenskalen",
    description: landingDescription,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Scale Aid für Gitarrenskalen",
    description: landingDescription,
  },
};

const siteUrl = getSiteUrl();
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl.origin,
      inLanguage: "de",
      description: landingDescription,
    },
    {
      "@type": "SoftwareApplication",
      name: siteName,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: new URL("/basic-scales", siteUrl).toString(),
      description: landingDescription,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      featureList: [
        "Mit der A-Moll-Pentatonik starten",
        "Pentatonik in jede Tonart auf dem Griffbrett übertragen",
        "Blues Notes und volle Tonleitern Schritt für Schritt dazunehmen",
      ],
    },
  ],
};

export default function Home() {
  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10 lg:py-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_16px_rgba(77,255,196,0.42)]" />
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/92">
              {siteName}
            </span>
          </div>

          <Link
            href="/basic-scales"
            className="inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold shadow-[0_10px_30px_rgba(77,255,196,0.18)] transition hover:brightness-105"
            style={{ color: "#04110d" }}
          >
            Basic Scales öffnen
          </Link>
        </header>

        <section className="grid flex-1 gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.72fr)] lg:items-center lg:py-10">
          <div className="max-w-4xl space-y-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]/90">
              Scales üben ohne Druck
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-[4.5rem] lg:leading-[0.97]">
              Mach mehr aus deiner A-Moll-Pentatonik.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/68">
              Starte mit dem Pattern, das du kennst. Spiele es in anderen Tonarten, nimm Blues Notes dazu und erweitere es Stück für Stück zur vollen Tonleiter über das Griffbrett.
            </p>

            <div>
              <Link
                href="/basic-scales"
                className="inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold shadow-[0_10px_30px_rgba(77,255,196,0.18)] transition hover:brightness-105"
                style={{ color: "#04110d" }}
              >
                Basic Scales starten
              </Link>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.025] p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/38">
              Lernweg
            </p>
            <div className="space-y-3">
              {[
                "Am-Pentatonik als Grundlage",
                "Pattern in jeder Tonart spielen",
                "Blues Notes gezielt einsetzen",
                "Zur vollständigen Tonleiter erweitern",
              ].map((step, index) => (
                <div key={step} className="flex items-center gap-3 text-sm text-white/66">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[rgba(77,255,196,0.18)] bg-[rgba(77,255,196,0.07)] text-xs font-semibold text-[var(--accent)]">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

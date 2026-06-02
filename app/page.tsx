import type { Metadata } from "next";
import Link from "next/link";

import { getSiteUrl, siteName } from "@/app/lib/site";

const landingDescription =
  "Scale Aid hilft dir dabei, aus der klassischen A-Moll-Pentatonik auszubrechen, Dur- und Molltonarten zu verstehen und das Fretboard Schritt für Schritt zu öffnen.";

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
        "Von der A-Moll-Pentatonik aus weiterlernen",
        "Dur und Moll auf dem Fretboard besser einordnen",
        "Das Griffbrett Schritt für Schritt längs erweitern",
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

      <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10 lg:py-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_16px_rgba(77,255,196,0.42)]" />
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/92">
              {siteName}
            </span>
          </div>

          <Link
            href="/basic-scales"
            className="inline-flex items-center text-sm font-medium text-white/62 transition hover:text-white"
          >
            Basic Scales öffnen
          </Link>
        </header>

        <section className="flex min-h-[calc(100svh-8rem)] items-center py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl space-y-8">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-[4.75rem] lg:leading-[0.96]">
              Raus aus der A-Moll-Pentatonik. Rein ins Verständnis für Dur, Moll und das ganze Fretboard.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/68">
              Scale Aid hilft dir dabei, vom bekannten Grundmuster aus weiterzugehen, Tonarten besser zu verstehen und dich Schritt für Schritt längs über das Griffbrett zu bewegen, damit du Songs nicht nur in einer Box begleitest.
            </p>

            <div>
              <Link
                href="/basic-scales"
                className="inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold !text-black shadow-[0_10px_30px_rgba(77,255,196,0.18)] transition hover:brightness-105"
                style={{ color: "#04110d" }}
              >
                Basic Scales starten
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-3xl space-y-5 pb-20" id="warum">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]/90">
            Warum das hilft
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Das Ziel ist, das Griffbrett nicht nur auswendig zu kennen, sondern musikalisch zu verstehen.
          </h2>
          <p className="text-base leading-8 text-white/64">
            Viele Gitarristen starten mit der klassischen A-Moll-Pentatonik und bleiben dann genau dort hängen. Scale Aid setzt an diesem Punkt an und macht den nächsten Schritt sichtbar: Was gehört zur Tonart, wie hängen Moll und Dur zusammen und wie öffnet sich das Pattern in weitere Lagen?
          </p>
          <p className="text-base leading-8 text-white/64">
            So wird aus einem bekannten Shape nach und nach echte Orientierung. Wenn du die Tonart eines Songs kennst, kannst du dadurch fundierter mitspielen und dich sicherer über den Hals bewegen.
          </p>
        </section>
      </div>
    </main>
  );
}

import type { Metadata } from "next";

import Fretboard from "@/app/components/fretboard";

const basicScalesDescription =
  "Interaktive Basic-Scales-Ansicht für Gitarre mit Pentatonik, Blues und vollen Skalen bis Bund 24.";

export const metadata: Metadata = {
  title: "Basic Scales",
  description: basicScalesDescription,
  alternates: {
    canonical: "/basic-scales",
  },
  openGraph: {
    title: "Basic Scales für Gitarre",
    description: basicScalesDescription,
    url: "/basic-scales",
  },
  twitter: {
    card: "summary",
    title: "Basic Scales für Gitarre",
    description: basicScalesDescription,
  },
};

export default function BasicScalesPage() {
  return (
    <main className="flex min-h-0 flex-1 overflow-hidden">
      <Fretboard maxFret={24} />
    </main>
  );
}
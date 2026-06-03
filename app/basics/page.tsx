import type { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
  title: "Basics",
  description: "Grundlagen zu Gitarrenskalen, Pentatonik und Blues Notes.",
  alternates: {
    canonical: "/basics",
  },
};

export default function BasicsPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <section className="flex flex-1 flex-col items-center justify-center py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]/90">
            Basics
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Inhalt kommt bald.
          </h1>
          <p className="mt-5 max-w-md text-base text-white/54">
            Hier entstehen Grundlagen zu Gitarrenskalen, Pentatonik und Blues Notes.
          </p>
          <div className="mt-10">
            <Link
              href="/"
              className="text-sm font-medium text-white/54 transition hover:text-white"
            >
              ← Zurück zur Startseite
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

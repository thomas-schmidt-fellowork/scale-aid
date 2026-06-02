import Fretboard from "@/app/components/fretboard";

export default function Home() {
  return (
    <main className="flex min-h-0 flex-1 overflow-hidden">
      <Fretboard maxFret={24} />
    </main>
  );
}

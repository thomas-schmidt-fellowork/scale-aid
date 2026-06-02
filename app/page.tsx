import Fretboard from "@/app/components/fretboard";

export default function Home() {
  return (
    <main className="flex flex-1 overflow-hidden">
      <Fretboard maxFret={24} />
    </main>
  );
}

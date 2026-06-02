const CHROMATIC_SCALE = [
  { pitchClass: "C", shortLabel: "C", fullLabel: "C" },
  { pitchClass: "C#", shortLabel: "C#", fullLabel: "C#/Db" },
  { pitchClass: "D", shortLabel: "D", fullLabel: "D" },
  { pitchClass: "D#", shortLabel: "D#", fullLabel: "D#/Eb" },
  { pitchClass: "E", shortLabel: "E", fullLabel: "E" },
  { pitchClass: "F", shortLabel: "F", fullLabel: "F" },
  { pitchClass: "F#", shortLabel: "F#", fullLabel: "F#/Gb" },
  { pitchClass: "G", shortLabel: "G", fullLabel: "G" },
  { pitchClass: "G#", shortLabel: "G#", fullLabel: "G#/Ab" },
  { pitchClass: "A", shortLabel: "A", fullLabel: "A" },
  { pitchClass: "A#", shortLabel: "A#", fullLabel: "A#/Bb" },
  { pitchClass: "B", shortLabel: "B", fullLabel: "B" },
] as const;

export type PitchClass = (typeof CHROMATIC_SCALE)[number]["pitchClass"];
export type NoteLabelMode = "sharp" | "full";

export type FretPosition = {
  fret: number;
  pitchClass: PitchClass;
  label: string;
  isOpen: boolean;
};

export type GuitarString = {
  stringNumber: 6 | 5 | 4 | 3 | 2 | 1;
  name: string;
  openPitchClass: PitchClass;
  positions: FretPosition[];
};

export const STANDARD_TUNING: readonly Omit<GuitarString, "positions">[] = [
  { stringNumber: 6, name: "Low E", openPitchClass: "E" },
  { stringNumber: 5, name: "A", openPitchClass: "A" },
  { stringNumber: 4, name: "D", openPitchClass: "D" },
  { stringNumber: 3, name: "G", openPitchClass: "G" },
  { stringNumber: 2, name: "B", openPitchClass: "B" },
  { stringNumber: 1, name: "High E", openPitchClass: "E" },
] as const;

const pitchIndexByClass = new Map(
  CHROMATIC_SCALE.map((note, index) => [note.pitchClass, index])
);

function getPitchAtFret(openPitchClass: PitchClass, fret: number) {
  const startIndex = pitchIndexByClass.get(openPitchClass);

  if (startIndex === undefined) {
    throw new Error(`Unknown pitch class: ${openPitchClass}`);
  }

  return CHROMATIC_SCALE[(startIndex + fret) % CHROMATIC_SCALE.length];
}

export function getFretboard(maxFret = 24, noteLabelMode: NoteLabelMode = "sharp"): GuitarString[] {
  const safeMaxFret = Number.isFinite(maxFret) ? Math.max(0, Math.floor(maxFret)) : 24;

  return STANDARD_TUNING.map((guitarString) => ({
    ...guitarString,
    positions: Array.from({ length: safeMaxFret + 1 }, (_, fret) => {
      const pitch = getPitchAtFret(guitarString.openPitchClass, fret);

      return {
        fret,
        pitchClass: pitch.pitchClass,
        label: noteLabelMode === "full" ? pitch.fullLabel : pitch.shortLabel,
        isOpen: fret === 0,
      };
    }),
  }));
}
const CHROMATIC_SCALE = [
  { pitchClass: "C", label: "C" },
  { pitchClass: "C#", label: "C#" },
  { pitchClass: "D", label: "D" },
  { pitchClass: "D#", label: "D#" },
  { pitchClass: "E", label: "E" },
  { pitchClass: "F", label: "F" },
  { pitchClass: "F#", label: "F#" },
  { pitchClass: "G", label: "G" },
  { pitchClass: "G#", label: "G#" },
  { pitchClass: "A", label: "A" },
  { pitchClass: "A#", label: "A#" },
  { pitchClass: "B", label: "B" },
] as const;

export type PitchClass = (typeof CHROMATIC_SCALE)[number]["pitchClass"];

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

export function getFretboard(maxFret = 24): GuitarString[] {
  const safeMaxFret = Number.isFinite(maxFret) ? Math.max(0, Math.floor(maxFret)) : 24;

  return STANDARD_TUNING.map((guitarString) => ({
    ...guitarString,
    positions: Array.from({ length: safeMaxFret + 1 }, (_, fret) => {
      const pitch = getPitchAtFret(guitarString.openPitchClass, fret);

      return {
        fret,
        pitchClass: pitch.pitchClass,
        label: pitch.label,
        isOpen: fret === 0,
      };
    }),
  }));
}
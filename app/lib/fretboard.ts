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
export type ScaleQuality = "major" | "minor";
export type ScaleFamily = "pentatonic" | "blues" | "diatonic";

export type ScaleDescriptor = {
  root: PitchClass;
  quality: ScaleQuality;
  family: ScaleFamily;
};

export type ScaleSelectorTarget = {
  root: PitchClass;
  rootFret: number;
};

export type FretWindow = {
  startFret: number;
  endFret: number;
};

export type PatternExpansion = {
  leftSteps: number;
  rightSteps: number;
};

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

export const PITCH_CLASSES: readonly PitchClass[] = CHROMATIC_SCALE.map(
  (note) => note.pitchClass
);

export const STANDARD_TUNING: readonly Omit<GuitarString, "positions">[] = [
  { stringNumber: 6, name: "Low E", openPitchClass: "E" },
  { stringNumber: 5, name: "A", openPitchClass: "A" },
  { stringNumber: 4, name: "D", openPitchClass: "D" },
  { stringNumber: 3, name: "G", openPitchClass: "G" },
  { stringNumber: 2, name: "B", openPitchClass: "B" },
  { stringNumber: 1, name: "High E", openPitchClass: "E" },
] as const;

export const DEFAULT_LEARNING_SCALE: ScaleDescriptor = {
  root: "A",
  quality: "minor",
  family: "pentatonic",
};

export const DEFAULT_MAX_FRET = 24;
export const DEFAULT_PENTATONIC_PATTERN_WINDOW: FretWindow = {
  startFret: 5,
  endFret: 8,
};

const SCALE_INTERVALS: Record<ScaleFamily, Record<ScaleQuality, readonly number[]>> = {
  blues: {
    major: [0, 2, 3, 4, 7, 9],
    minor: [0, 3, 5, 6, 7, 10],
  },
  diatonic: {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
  },
  pentatonic: {
    major: [0, 2, 4, 7, 9],
    minor: [0, 3, 5, 7, 10],
  },
};

const pitchIndexByClass = new Map(
  CHROMATIC_SCALE.map((note, index) => [note.pitchClass, index])
);

function getPitchClassAtInterval(root: PitchClass, semitones: number): PitchClass {
  const startIndex = pitchIndexByClass.get(root);

  if (startIndex === undefined) {
    throw new Error(`Unknown pitch class: ${root}`);
  }

  return CHROMATIC_SCALE[(startIndex + semitones) % CHROMATIC_SCALE.length].pitchClass;
}

export function getScalePitchClasses(descriptor: ScaleDescriptor): Set<PitchClass> {
  const intervals = SCALE_INTERVALS[descriptor.family][descriptor.quality];

  return new Set(intervals.map((interval) => getPitchClassAtInterval(descriptor.root, interval)));
}

export function getScaleAccentPitchClasses(descriptor: ScaleDescriptor): Set<PitchClass> {
  if (descriptor.family !== "blues") {
    return new Set();
  }

  const accentInterval = descriptor.quality === "major" ? 3 : 6;

  return new Set([getPitchClassAtInterval(descriptor.root, accentInterval)]);
}

export function getFullFretWindow(maxFret: number): FretWindow {
  return {
    startFret: 0,
    endFret: Math.max(0, Math.floor(maxFret)),
  };
}

export function getExpandedFretWindow(
  baseWindow: FretWindow,
  expansion: PatternExpansion,
  maxFret: number
): FretWindow {
  const safeMaxFret = Math.max(0, Math.floor(maxFret));

  return {
    startFret: Math.max(0, baseWindow.startFret - expansion.leftSteps),
    endFret: Math.min(safeMaxFret, baseWindow.endFret + expansion.rightSteps),
  };
}

export function getCollapsedScalePatternWindow(
  rootFret: number,
  quality: ScaleQuality,
  maxFret: number
): FretWindow {
  const safeMaxFret = Math.max(0, Math.floor(maxFret));
  const preferredStartFret = quality === "minor" ? rootFret : rootFret - 1;
  const normalizedStartFret = Math.max(
    0,
    Math.min(Math.floor(preferredStartFret), Math.max(0, safeMaxFret - 3))
  );

  return {
    startFret: normalizedStartFret,
    endFret: Math.min(safeMaxFret, normalizedStartFret + 3),
  };
}

export function isFretInWindow(fret: number, window: FretWindow): boolean {
  return fret >= window.startFret && fret <= window.endFret;
}

function getPitchAtFret(openPitchClass: PitchClass, fret: number) {
  const startIndex = pitchIndexByClass.get(openPitchClass);

  if (startIndex === undefined) {
    throw new Error(`Unknown pitch class: ${openPitchClass}`);
  }

  return CHROMATIC_SCALE[(startIndex + fret) % CHROMATIC_SCALE.length];
}

export function getLowestFretForPitchClass(
  openPitchClass: PitchClass,
  targetPitchClass: PitchClass,
  maxFret: number
) {
  const safeMaxFret = Math.max(0, Math.floor(maxFret));

  for (let fret = 0; fret <= safeMaxFret; fret += 1) {
    if (getPitchAtFret(openPitchClass, fret).pitchClass === targetPitchClass) {
      return fret;
    }
  }

  throw new Error(`Could not map ${targetPitchClass} on string ${openPitchClass}`);
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
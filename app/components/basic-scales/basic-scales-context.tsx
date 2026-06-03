'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  DEFAULT_LEARNING_SCALE,
  DEFAULT_MAX_FRET,
  DEFAULT_PENTATONIC_PATTERN_WINDOW,
  getCollapsedScalePatternWindow,
  getExpandedFretWindow,
  getLowestFretForPitchClass,
  STANDARD_TUNING,
  type FretWindow,
  type NoteLabelMode,
  type PatternLearningMode,
  type PatternExpansion,
  type PitchClass,
  type ScaleDescriptor,
  type ScaleFamily,
  type ScaleQuality,
} from "@/app/lib/fretboard";

type BasicScalesContextValue = {
  activePatternWindow: FretWindow;
  canExpandPatternLeft: boolean;
  canExpandPatternRight: boolean;
  learningScale: ScaleDescriptor;
  noteLabelMode: NoteLabelMode;
  patternLearningMode: PatternLearningMode;
  selectedRootFret: number;
  resetPatternWindow: () => void;
  selectLearningScale: (
    root: PitchClass,
    family: ScaleFamily,
    quality: ScaleQuality,
    rootFret: number
  ) => void;
  setPatternLearningMode: (mode: PatternLearningMode) => void;
  setNoteLabelMode: (mode: NoteLabelMode) => void;
  stepPatternLeft: () => void;
  stepPatternRight: () => void;
};

const BasicScalesContext = createContext<BasicScalesContextValue | null>(null);

export function BasicScalesProvider({ children }: { children: ReactNode }) {
  const [learningScale, setLearningScale] = useState<ScaleDescriptor>(DEFAULT_LEARNING_SCALE);
  const [noteLabelMode, setNoteLabelMode] = useState<NoteLabelMode>("sharp");
  const [patternLearningMode, setPatternLearningMode] =
    useState<PatternLearningMode>("relative");
  const [selectedRootFret, setSelectedRootFret] = useState(() =>
    getLowestFretForPitchClass(
      STANDARD_TUNING[0].openPitchClass,
      DEFAULT_LEARNING_SCALE.root,
      DEFAULT_MAX_FRET
    )
  );
  const [basePatternWindow, setBasePatternWindow] = useState<FretWindow>(
    DEFAULT_PENTATONIC_PATTERN_WINDOW
  );
  const [patternExpansion, setPatternExpansion] = useState<PatternExpansion>({
    leftSteps: 0,
    rightSteps: 0,
  });

  const activePatternWindow = getExpandedFretWindow(
    basePatternWindow,
    patternExpansion,
    DEFAULT_MAX_FRET
  );
  const canExpandPatternLeft = activePatternWindow.startFret > 0;
  const canExpandPatternRight = activePatternWindow.endFret < DEFAULT_MAX_FRET;

  function stepPatternLeft() {
    setPatternExpansion((current) => ({
      ...current,
      leftSteps: canExpandPatternLeft ? current.leftSteps + 1 : current.leftSteps,
    }));
  }

  function stepPatternRight() {
    setPatternExpansion((current) => ({
      ...current,
      rightSteps: canExpandPatternRight ? current.rightSteps + 1 : current.rightSteps,
    }));
  }

  function resetPatternWindow() {
    setPatternExpansion({ leftSteps: 0, rightSteps: 0 });
  }

  function selectLearningScale(
    root: PitchClass,
    family: ScaleFamily,
    quality: ScaleQuality,
    rootFret: number
  ) {
    setLearningScale({ root, quality, family });
    setSelectedRootFret(rootFret);
    setBasePatternWindow(
      getCollapsedScalePatternWindow(rootFret, quality, DEFAULT_MAX_FRET, patternLearningMode)
    );
    setPatternExpansion({ leftSteps: 0, rightSteps: 0 });
  }

  useEffect(() => {
    setBasePatternWindow(
      getCollapsedScalePatternWindow(
        selectedRootFret,
        learningScale.quality,
        DEFAULT_MAX_FRET,
        patternLearningMode
      )
    );
    setPatternExpansion({ leftSteps: 0, rightSteps: 0 });
  }, [learningScale.quality, patternLearningMode, selectedRootFret]);

  return (
    <BasicScalesContext.Provider
      value={{
        activePatternWindow,
        canExpandPatternLeft,
        canExpandPatternRight,
        learningScale,
        noteLabelMode,
        patternLearningMode,
        selectedRootFret,
        resetPatternWindow,
        selectLearningScale,
        setPatternLearningMode,
        setNoteLabelMode,
        stepPatternLeft,
        stepPatternRight,
      }}
    >
      {children}
    </BasicScalesContext.Provider>
  );
}

export function useBasicScales() {
  const context = useContext(BasicScalesContext);

  if (!context) {
    throw new Error("useBasicScales must be used within BasicScalesProvider");
  }

  return context;
}
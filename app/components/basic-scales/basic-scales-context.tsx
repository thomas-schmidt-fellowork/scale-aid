'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";

import {
  DEFAULT_LEARNING_SCALE,
  DEFAULT_MAX_FRET,
  DEFAULT_PENTATONIC_PATTERN_WINDOW,
  getCollapsedScalePatternWindow,
  getExpandedFretWindow,
  type FretWindow,
  type NoteLabelMode,
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
  resetPatternWindow: () => void;
  selectLearningScale: (
    root: PitchClass,
    family: ScaleFamily,
    quality: ScaleQuality,
    rootFret: number
  ) => void;
  setNoteLabelMode: (mode: NoteLabelMode) => void;
  stepPatternLeft: () => void;
  stepPatternRight: () => void;
};

const BasicScalesContext = createContext<BasicScalesContextValue | null>(null);

export function BasicScalesProvider({ children }: { children: ReactNode }) {
  const [learningScale, setLearningScale] = useState<ScaleDescriptor>(DEFAULT_LEARNING_SCALE);
  const [noteLabelMode, setNoteLabelMode] = useState<NoteLabelMode>("sharp");
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
    setBasePatternWindow(getCollapsedScalePatternWindow(rootFret, quality, DEFAULT_MAX_FRET));
    setPatternExpansion({ leftSteps: 0, rightSteps: 0 });
  }

  return (
    <BasicScalesContext.Provider
      value={{
        activePatternWindow,
        canExpandPatternLeft,
        canExpandPatternRight,
        learningScale,
        noteLabelMode,
        resetPatternWindow,
        selectLearningScale,
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
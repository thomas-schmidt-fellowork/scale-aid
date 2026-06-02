'use client';

import * as Popover from "@radix-ui/react-popover";
import * as Switch from "@radix-ui/react-switch";
import * as Tooltip from "@radix-ui/react-tooltip";
import { CircleHelp, Settings2 } from "lucide-react";
import {
  createContext,
  type ReactNode,
  useContext,
  useId,
  useRef,
  useState,
} from "react";

import ScaleSelectionControls from "@/app/components/scale-selection-controls";
import {
  DEFAULT_LEARNING_SCALE,
  DEFAULT_MAX_FRET,
  DEFAULT_PENTATONIC_PATTERN_WINDOW,
  getLowestFretForPitchClass,
  getCollapsedScalePatternWindow,
  getExpandedFretWindow,
  PITCH_CLASSES,
  STANDARD_TUNING,
  type FretWindow,
  type NoteLabelMode,
  type PatternExpansion,
  type PitchClass,
  type ScaleDescriptor,
  type ScaleFamily,
  type ScaleQuality,
} from "@/app/lib/fretboard";

type DisplaySettingsContextValue = {
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
  stepPatternLeft: () => void;
  stepPatternRight: () => void;
  setNoteLabelMode: (mode: NoteLabelMode) => void;
};

const DisplaySettingsContext = createContext<DisplaySettingsContextValue | null>(null);

const qualityLabelByValue: Record<ScaleQuality, string> = {
  major: "Dur",
  minor: "Moll",
};

const familyLabelByValue: Record<ScaleFamily, string> = {
  pentatonic: "Pentatonik",
  blues: "Blues",
  diatonic: "Voll",
};

export function useDisplaySettings() {
  const context = useContext(DisplaySettingsContext);

  if (!context) {
    throw new Error("useDisplaySettings must be used within AppShell");
  }

  return context;
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [learningScale, setLearningScale] = useState<ScaleDescriptor>(DEFAULT_LEARNING_SCALE);
  const [noteLabelMode, setNoteLabelMode] = useState<NoteLabelMode>("sharp");
  const [isScaleSummaryOpen, setIsScaleSummaryOpen] = useState(false);
  const [basePatternWindow, setBasePatternWindow] = useState<FretWindow>(
    DEFAULT_PENTATONIC_PATTERN_WINDOW
  );
  const [patternExpansion, setPatternExpansion] = useState<PatternExpansion>({
    leftSteps: 0,
    rightSteps: 0,
  });
  const scaleSummaryCloseTimeoutRef = useRef<number | null>(null);
  const compressedDisplayId = useId();
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

  function clearScaleSummaryCloseTimeout() {
    if (scaleSummaryCloseTimeoutRef.current !== null) {
      window.clearTimeout(scaleSummaryCloseTimeoutRef.current);
      scaleSummaryCloseTimeoutRef.current = null;
    }
  }

  function openScaleSummary() {
    clearScaleSummaryCloseTimeout();
    setIsScaleSummaryOpen(true);
  }

  function scheduleScaleSummaryClose() {
    clearScaleSummaryCloseTimeout();
    scaleSummaryCloseTimeoutRef.current = window.setTimeout(() => {
      setIsScaleSummaryOpen(false);
      scaleSummaryCloseTimeoutRef.current = null;
    }, 120);
  }

  function selectLearningScaleFromHeader(root: PitchClass, family: ScaleFamily, quality: ScaleQuality) {
    selectLearningScale(
      root,
      family,
      quality,
      getLowestFretForPitchClass(STANDARD_TUNING[0].openPitchClass, root, DEFAULT_MAX_FRET)
    );
  }

  return (
    <DisplaySettingsContext.Provider
      value={{
        activePatternWindow,
        canExpandPatternLeft,
        canExpandPatternRight,
        learningScale,
        noteLabelMode,
        resetPatternWindow,
        selectLearningScale,
        stepPatternLeft,
        stepPatternRight,
        setNoteLabelMode,
      }}
    >
      <div className="flex min-h-full flex-col">
        <header className="border-b border-white/10 bg-[rgba(5,7,11,0.78)] backdrop-blur-xl">
          <div className="mx-auto grid h-14 w-full max-w-[100rem] grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_rgba(77,255,196,0.4)]" />
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white">
                Scale Aid
              </span>
            </div>

            <div className="min-w-0 flex justify-center">
              <Popover.Root open={isScaleSummaryOpen} onOpenChange={setIsScaleSummaryOpen}>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    aria-label="Aktive Skala ändern"
                    onMouseEnter={openScaleSummary}
                    onMouseLeave={scheduleScaleSummaryClose}
                    onClick={openScaleSummary}
                    className="inline-flex min-w-0 cursor-pointer items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-sm transition hover:border-white/12 hover:bg-white/[0.05]"
                  >
                    <span className="font-semibold text-white">{learningScale.root}</span>
                    <span className="text-white/28">·</span>
                    <span className="text-white/72">
                      {qualityLabelByValue[learningScale.quality]}
                    </span>
                    <span className="text-white/28">·</span>
                    <span className="truncate text-white/72">
                      {familyLabelByValue[learningScale.family]}
                    </span>
                  </button>
                </Popover.Trigger>

                <Popover.Portal>
                  <Popover.Content
                    side="bottom"
                    align="center"
                    sideOffset={12}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                    onMouseEnter={openScaleSummary}
                    onMouseLeave={scheduleScaleSummaryClose}
                    className="z-50 w-[min(22rem,calc(100vw-1.5rem))] rounded-[1rem] border border-white/6 bg-[linear-gradient(180deg,rgba(16,18,23,0.985),rgba(10,11,15,0.985))] px-4 py-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.38),0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl outline-none"
                  >
                    <div className="space-y-3">
                      <div>
                        <span className="text-[0.92rem] font-medium text-white/58">Grundton</span>
                      </div>

                      <div className="grid grid-cols-6 gap-1 rounded-[0.7rem] bg-white/[0.04] p-1">
                        {PITCH_CLASSES.map((pitchClass) => {
                          const isActive = learningScale.root === pitchClass;

                          return (
                            <button
                              key={pitchClass}
                              type="button"
                              onClick={() =>
                                selectLearningScaleFromHeader(
                                  pitchClass,
                                  learningScale.family,
                                  learningScale.quality
                                )
                              }
                              className={`rounded-[0.5rem] px-2 py-2 text-center text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-white/20 ${
                                isActive
                                  ? "bg-white/[0.12] text-white"
                                  : "text-white/48 hover:bg-white/[0.03] hover:text-white"
                              }`}
                            >
                              {pitchClass}
                            </button>
                          );
                        })}
                      </div>

                      <ScaleSelectionControls
                        family={learningScale.family}
                        quality={learningScale.quality}
                        onSelectFamily={(family) =>
                          selectLearningScaleFromHeader(
                            learningScale.root,
                            family,
                            learningScale.quality
                          )
                        }
                        onSelectQuality={(quality) =>
                          selectLearningScaleFromHeader(
                            learningScale.root,
                            learningScale.family,
                            quality
                          )
                        }
                      />
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>

            <div className="flex items-center gap-2">
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    aria-label="Open settings"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-[var(--muted-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white data-[state=open]:border-[color:rgba(77,255,196,0.36)] data-[state=open]:bg-[rgba(77,255,196,0.06)]"
                  >
                    <Settings2 className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.9} />
                  </button>
                </Popover.Trigger>

                <Popover.Portal>
                  <Popover.Content
                    side="bottom"
                    align="end"
                    sideOffset={12}
                    className="z-40 w-[min(34rem,calc(100vw-1.5rem))] rounded-2xl border border-white/12 bg-[linear-gradient(180deg,rgba(15,17,23,0.98),rgba(8,9,13,0.98))] p-2 shadow-[0_24px_60px_rgba(0,0,0,0.48),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl outline-none"
                  >
                    <div className="grid grid-cols-[9rem_minmax(0,1fr)] overflow-hidden rounded-[1rem] border border-white/8 bg-white/[0.02]">
                      <aside className="border-r border-white/8 bg-[rgba(255,255,255,0.02)] p-3">
                        <p className="mb-3 text-[0.68rem] font-semibold leading-5 uppercase tracking-[0.24em] text-[var(--muted)]">
                          Settings
                        </p>
                        <button
                          type="button"
                          className="flex h-10 w-full items-center rounded-md px-2 text-left text-sm font-medium text-white/95"
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="h-4 w-0.5 rounded-full bg-[var(--accent)]" />
                            <span>Visuell</span>
                          </span>
                        </button>
                      </aside>

                      <section className="p-4">
                        <div aria-hidden="true" className="mb-3 h-5" />
                        <div className="flex min-h-10 items-center gap-3">
                          <Switch.Root
                            id={compressedDisplayId}
                            checked={noteLabelMode === "sharp"}
                            onCheckedChange={(checked) =>
                              setNoteLabelMode(checked ? "sharp" : "full")
                            }
                            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-white/14 bg-white/[0.06] p-[3px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)] outline-none transition data-[state=checked]:border-[color:rgba(77,255,196,0.36)] data-[state=checked]:bg-[rgba(77,255,196,0.16)]"
                          >
                            <Switch.Thumb className="block h-4 w-4 rounded-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.35)] transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-[var(--accent)]" />
                          </Switch.Root>

                          <label
                            htmlFor={compressedDisplayId}
                            className="text-sm font-medium text-white"
                          >
                            Komprimierte Halbtonanzeige
                          </label>

                          <Tooltip.Provider delayDuration={250} disableHoverableContent>
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <button
                                  type="button"
                                  aria-label="Mehr Informationen zur komprimierten Halbtonanzeige"
                                  className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full text-[var(--muted)] transition hover:text-white"
                                >
                                  <CircleHelp className="h-3.5 w-3.5" strokeWidth={2} />
                                </button>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content
                                  side="top"
                                  align="end"
                                  sideOffset={8}
                                  className="z-50 max-w-80 rounded-xl border border-white/12 bg-[rgba(12,14,20,0.96)] px-3 py-2.5 text-xs leading-5 text-[var(--muted-strong)] shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                                >
                                  <div className="space-y-1">
                                    <p>Halbtöne haben 2 Darstellungen, z. B. F# und Gb.</p>
                                    <p>Komprimierte Anzeige zeigt nur eine Variante zur besseren Lesbarkeit an.</p>
                                  </div>
                                  <Tooltip.Arrow className="fill-[rgba(12,14,20,0.96)]" />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          </Tooltip.Provider>
                        </div>
                      </section>
                    </div>

                    <Popover.Arrow className="fill-[rgba(15,17,23,0.98)]" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </DisplaySettingsContext.Provider>
  );
}
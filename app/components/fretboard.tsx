'use client';

import * as Popover from "@radix-ui/react-popover";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Fragment, type ReactNode, useRef, useState } from "react";

import { useDisplaySettings } from "@/app/components/app-shell";
import ScaleSelectionControls from "@/app/components/scale-selection-controls";
import {
  DEFAULT_MAX_FRET,
  getFretboard,
  getScaleAccentPitchClasses,
  getScalePitchClasses,
  isFretInWindow,
  type FretPosition,
  type GuitarString,
  type ScaleSelectorTarget,
  type ScaleFamily,
  type ScaleQuality,
} from "@/app/lib/fretboard";

type FretboardProps = {
  maxFret?: number;
};

function getStringThickness(stringNumber: number) {
  return `${0.9 + stringNumber * 0.32}px`;
}

function getStringAccent(stringNumber: number) {
  const accents: Record<number, { base: string; glow: string; edge: string }> = {
    6: { base: "rgba(255,94,94,0.72)", glow: "rgba(255,94,94,0.2)", edge: "rgba(255,210,210,0.42)" },
    5: { base: "rgba(255,214,74,0.72)", glow: "rgba(255,214,74,0.2)", edge: "rgba(255,240,188,0.42)" },
    4: { base: "rgba(84,150,255,0.72)", glow: "rgba(84,150,255,0.2)", edge: "rgba(202,222,255,0.42)" },
    3: { base: "rgba(255,156,72,0.72)", glow: "rgba(255,156,72,0.2)", edge: "rgba(255,222,190,0.42)" },
    2: { base: "rgba(86,218,142,0.72)", glow: "rgba(86,218,142,0.2)", edge: "rgba(204,245,220,0.42)" },
    1: { base: "rgba(192,118,255,0.72)", glow: "rgba(192,118,255,0.2)", edge: "rgba(232,210,255,0.42)" },
  };

  return accents[stringNumber] ?? {
    base: "rgba(255,255,255,0.55)",
    glow: "rgba(255,255,255,0.14)",
    edge: "rgba(255,255,255,0.35)",
  };
}

type NoteCellProps = {
  position: FretPosition;
  guitarString: GuitarString;
  maxFret: number;
  isScaleTone: boolean;
  isAccentScaleTone: boolean;
  isWithinActiveWindow: boolean;
  scaleSelector?: ScaleSelectorState;
};

type OpenStringCellProps = {
  position: FretPosition;
  guitarString: GuitarString;
  isScaleTone: boolean;
  isAccentScaleTone: boolean;
  isWithinActiveWindow: boolean;
  scaleSelector?: ScaleSelectorState;
};

type ScaleSelectorState = {
  isOpen: boolean;
  currentFamily: ScaleFamily;
  currentQuality: ScaleQuality;
  openByHover: () => void;
  openByClick: () => void;
  keepOpen: () => void;
  scheduleClose: () => void;
  close: () => void;
  selectScale: (family: ScaleFamily, quality: ScaleQuality) => void;
};

type ScaleRootSelectorProps = {
  label: string;
  scaleSelector: ScaleSelectorState;
  children: ReactNode;
};

function ScaleRootSelector({ label, scaleSelector, children }: ScaleRootSelectorProps) {
  return (
    <Popover.Root open={scaleSelector.isOpen} onOpenChange={(nextOpen) => !nextOpen && scaleSelector.close()}>
      <Popover.Anchor asChild>
        <span
          className="inline-flex"
          onMouseEnter={scaleSelector.openByHover}
          onMouseLeave={scaleSelector.scheduleClose}
          onClick={scaleSelector.openByClick}
        >
          {children}
        </span>
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={10}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onMouseEnter={scaleSelector.keepOpen}
          onMouseLeave={scaleSelector.scheduleClose}
          className="z-50 w-[min(17.25rem,calc(100vw-1.5rem))] rounded-[1rem] border border-white/6 bg-[linear-gradient(180deg,rgba(16,18,23,0.985),rgba(10,11,15,0.985))] px-4 py-3.5 shadow-[0_18px_40px_rgba(0,0,0,0.38),0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl outline-none"
        >
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[0.92rem] font-medium text-white/58">Grundton</span>
              <h3 className="text-[1.12rem] font-semibold tracking-[-0.03em] text-white">
                &quot;{label}&quot;
              </h3>
            </div>

            <ScaleSelectionControls
              family={scaleSelector.currentFamily}
              quality={scaleSelector.currentQuality}
              onSelectFamily={(family) =>
                scaleSelector.selectScale(family, scaleSelector.currentQuality)
              }
              onSelectQuality={(quality) =>
                scaleSelector.selectScale(scaleSelector.currentFamily, quality)
              }
            />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function OpenStringCell({
  position,
  guitarString,
  isScaleTone,
  isAccentScaleTone,
  isWithinActiveWindow,
  scaleSelector,
}: OpenStringCellProps) {
  const stringThickness = getStringThickness(guitarString.stringNumber);
  const stringAccent = getStringAccent(guitarString.stringNumber);
  const isActiveScaleTone = isScaleTone && isWithinActiveWindow;
  const isActiveAccentTone = isAccentScaleTone && isWithinActiveWindow;
  const cellDimClasses = isWithinActiveWindow ? "opacity-100" : "opacity-45";

  return (
    <div
      className={`relative flex h-[clamp(2.2rem,8.2svh,4.4rem)] items-center justify-center pr-1 ${cellDimClasses}`}
    >
      <div
        className="absolute right-0 top-1/2 h-px w-[24%] -translate-y-1/2 rounded-full"
        style={{
          height: stringThickness,
          background: `linear-gradient(90deg, ${stringAccent.edge}, ${stringAccent.base} 24%, ${stringAccent.base})`,
          boxShadow: `0 0 6px ${stringAccent.glow}`,
        }}
      />
      {scaleSelector ? (
        <ScaleRootSelector label={position.label} scaleSelector={scaleSelector}>
          <button
            type="button"
            aria-label={`${position.label} als neue Tonart waehlen`}
            className="relative z-10 inline-flex cursor-pointer items-center justify-center rounded-full p-[2px] transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <span
              className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-[clamp(0.12rem,0.24vw,0.35rem)] py-[clamp(0.08rem,0.16vw,0.18rem)] text-[clamp(0.78rem,1.55vw,1.45rem)] font-semibold leading-none ${
                isActiveAccentTone
                  ? "border border-[rgba(92,158,255,0.72)] bg-[rgba(11,28,62,0.52)] text-[#f1f7ff] shadow-[0_0_0_2px_rgba(92,158,255,0.24)]"
                  : isActiveScaleTone
                  ? "border border-[rgba(255,92,92,0.72)] bg-[rgba(58,10,14,0.45)] text-[#fff1f1] shadow-[0_0_0_2px_rgba(255,92,92,0.24)]"
                  : "text-white"
              }`}
            >
              {position.label}
            </span>
          </button>
        </ScaleRootSelector>
      ) : (
        <span className="relative z-10 inline-flex items-center justify-center rounded-full p-[2px]">
          <span
            className={`inline-flex min-w-[1.5rem] items-center justify-center rounded-full px-[clamp(0.12rem,0.24vw,0.35rem)] py-[clamp(0.08rem,0.16vw,0.18rem)] text-[clamp(0.78rem,1.55vw,1.45rem)] font-semibold leading-none ${
              isActiveAccentTone
                ? "border border-[rgba(92,158,255,0.72)] bg-[rgba(11,28,62,0.52)] text-[#f1f7ff] shadow-[0_0_0_2px_rgba(92,158,255,0.24)]"
                : isActiveScaleTone
                ? "border border-[rgba(255,92,92,0.72)] bg-[rgba(58,10,14,0.45)] text-[#fff1f1] shadow-[0_0_0_2px_rgba(255,92,92,0.24)]"
                : "text-white"
            }`}
          >
            {position.label}
          </span>
        </span>
      )}
    </div>
  );
}

function NoteCell({
  position,
  guitarString,
  maxFret,
  isScaleTone,
  isAccentScaleTone,
  isWithinActiveWindow,
  scaleSelector,
}: NoteCellProps) {
  const isNut = position.fret === 1;
  const isLastFret = position.fret === maxFret;
  const stringThickness = getStringThickness(guitarString.stringNumber);
  const stringAccent = getStringAccent(guitarString.stringNumber);
  const isActiveScaleTone = isScaleTone && isWithinActiveWindow;
  const isActiveAccentTone = isAccentScaleTone && isWithinActiveWindow;
  const baseCellBackground =
    position.fret % 2 === 0
      ? "bg-[linear-gradient(180deg,rgba(38,40,46,0.98),rgba(19,20,26,0.98))]"
      : "bg-[linear-gradient(180deg,rgba(26,28,34,0.98),rgba(11,12,16,0.98))]";
  const highlightStateClasses = isActiveAccentTone
    ? "border-[color:rgba(92,158,255,0.72)] bg-[rgba(12,29,60,0.96)] text-[#f1f7ff] shadow-[0_0_0_1px_rgba(132,184,255,0.18),0_0_12px_rgba(92,158,255,0.18)]"
    : isActiveScaleTone
      ? "border-[color:rgba(255,92,92,0.72)] bg-[rgba(58,10,14,0.96)] text-[#fff1f1] shadow-[0_0_0_1px_rgba(255,120,120,0.18),0_0_12px_rgba(255,76,76,0.16)]"
      : "border-[color:rgba(214,219,230,0.16)] bg-[rgba(7,8,12,0.96)] text-[rgba(230,234,241,0.72)] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]";
  const ringStateClasses = isActiveAccentTone
    ? "border-[rgba(92,158,255,0.42)] bg-[rgba(92,158,255,0.08)]"
    : isActiveScaleTone
      ? "border-[rgba(255,82,82,0.45)] bg-[rgba(255,64,64,0.08)]"
      : "border-transparent bg-transparent";
  const cellDimClasses = isWithinActiveWindow ? "opacity-100" : "opacity-45";

  return (
    <div
      className={`relative flex h-[clamp(2.2rem,8.2svh,4.4rem)] items-center justify-center overflow-hidden ${baseCellBackground} ${cellDimClasses} ${
        isNut
          ? "border-l-[5px] border-l-[rgba(206,212,224,0.42)]"
          : "border-l border-l-white/28"
      } ${isLastFret ? "border-r border-r-white/28" : ""}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/35" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_28%,transparent_72%,rgba(0,0,0,0.2))]" />
      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]" />
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full"
        style={{
          height: stringThickness,
          background: `linear-gradient(90deg, ${stringAccent.edge} 0%, ${stringAccent.base} 14%, ${stringAccent.base} 86%, ${stringAccent.edge} 100%)`,
          boxShadow: `0 0 6px ${stringAccent.glow}`,
        }}
      />
      {scaleSelector ? (
        <ScaleRootSelector label={position.label} scaleSelector={scaleSelector}>
          <button
            type="button"
            aria-label={`${position.label} als neue Tonart waehlen`}
            className={`relative z-10 inline-flex cursor-pointer rounded-full border p-[2px] transition hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${ringStateClasses}`}
          >
            <span className={`inline-flex min-w-0 max-w-[94%] items-center justify-center rounded-full border px-[clamp(0.08rem,0.22vw,0.4rem)] py-[clamp(0.08rem,0.16vw,0.2rem)] text-[clamp(0.3rem,0.76vw,0.82rem)] font-semibold leading-none tracking-[-0.02em] sm:px-2 sm:py-0.75 ${highlightStateClasses}`}>
              {position.label}
            </span>
          </button>
        </ScaleRootSelector>
      ) : (
        <span className={`relative z-10 inline-flex rounded-full border p-[2px] ${ringStateClasses}`}>
          <span className={`inline-flex min-w-0 max-w-[94%] items-center justify-center rounded-full border px-[clamp(0.08rem,0.22vw,0.4rem)] py-[clamp(0.08rem,0.16vw,0.2rem)] text-[clamp(0.3rem,0.76vw,0.82rem)] font-semibold leading-none tracking-[-0.02em] sm:px-2 sm:py-0.75 ${highlightStateClasses}`}>
            {position.label}
          </span>
        </span>
      )}
    </div>
  );
}

export default function Fretboard({ maxFret = DEFAULT_MAX_FRET }: FretboardProps) {
  const {
    activePatternWindow,
    canExpandPatternLeft,
    canExpandPatternRight,
    learningScale,
    noteLabelMode,
    resetPatternWindow,
    selectLearningScale,
    stepPatternLeft,
    stepPatternRight,
  } = useDisplaySettings();
  const scaleSelectorCloseTimeoutRef = useRef<number | null>(null);
  const [activeScaleSelectorTarget, setActiveScaleSelectorTarget] =
    useState<ScaleSelectorTarget | null>(null);
  const [isScaleSelectorOpen, setIsScaleSelectorOpen] = useState(false);
  const strings = getFretboard(maxFret, noteLabelMode);
  const activeScalePitchClasses = getScalePitchClasses(learningScale);
  const activeScaleAccentPitchClasses = getScaleAccentPitchClasses(learningScale);
  const displayStrings = [...strings].reverse();
  const fretNumbers = Array.from({ length: maxFret }, (_, index) => index + 1);
  const gridTemplateColumns = `clamp(1.9rem, 4.5vw, 3.2rem) repeat(${maxFret}, minmax(0, 1fr))`;
  const resetGridColumn = `${activePatternWindow.startFret + 1} / ${activePatternWindow.endFret + 2}`;

  function clearScaleSelectorCloseTimeout() {
    if (scaleSelectorCloseTimeoutRef.current !== null) {
      window.clearTimeout(scaleSelectorCloseTimeoutRef.current);
      scaleSelectorCloseTimeoutRef.current = null;
    }
  }

  function closeScaleSelector() {
    clearScaleSelectorCloseTimeout();
    setIsScaleSelectorOpen(false);
    setActiveScaleSelectorTarget(null);
  }

  function keepScaleSelectorOpen() {
    clearScaleSelectorCloseTimeout();
  }

  function scheduleScaleSelectorClose() {
    clearScaleSelectorCloseTimeout();
    scaleSelectorCloseTimeoutRef.current = window.setTimeout(() => {
      closeScaleSelector();
    }, 120);
  }

  function openScaleSelector(target: ScaleSelectorTarget, mode: "hover" | "click") {
    clearScaleSelectorCloseTimeout();

    if (mode === "hover") {
      setActiveScaleSelectorTarget(target);
      setIsScaleSelectorOpen(true);
      return;
    }

    selectLearningScale(
      target.root,
      learningScale.family,
      learningScale.quality,
      target.rootFret
    );
    setActiveScaleSelectorTarget(target);
    setIsScaleSelectorOpen(true);
  }

  function applyScaleSelection(target: ScaleSelectorTarget, family: ScaleFamily, quality: ScaleQuality) {
    setActiveScaleSelectorTarget(target);
    setIsScaleSelectorOpen(true);
    selectLearningScale(target.root, family, quality, target.rootFret);
  }

  function getScaleSelector(target: ScaleSelectorTarget): ScaleSelectorState {
    const isOpenForTarget =
      isScaleSelectorOpen &&
      activeScaleSelectorTarget?.root === target.root &&
      activeScaleSelectorTarget?.rootFret === target.rootFret;

    return {
      isOpen: isOpenForTarget,
      currentFamily: learningScale.family,
      currentQuality: learningScale.quality,
      openByHover: () => openScaleSelector(target, "hover"),
      openByClick: () => openScaleSelector(target, "click"),
      keepOpen: keepScaleSelectorOpen,
      scheduleClose: scheduleScaleSelectorClose,
      close: closeScaleSelector,
      selectScale: (family, quality) => applyScaleSelection(target, family, quality),
    };
  }

  return (
    <section className="flex h-full w-full items-center justify-center px-1.5 py-2 sm:px-3 sm:py-3">
      <div className="w-full rounded-[1.45rem] border border-white/24 bg-[linear-gradient(180deg,rgba(24,26,32,0.98),rgba(8,9,13,0.99))] p-[clamp(0.35rem,0.9vw,0.7rem)] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_16px_50px_rgba(0,0,0,0.62)]">
        <div className="rounded-[1.15rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,15,20,0.98),rgba(5,6,9,0.98))] p-[clamp(0.25rem,0.65vw,0.55rem)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="grid gap-y-1.5 sm:gap-y-2" style={{ gridTemplateColumns }}>
            <div className="col-span-full relative grid h-8" style={{ gridTemplateColumns }}>
              <div />
              {fretNumbers.map((fret) => (
                <div key={`control-${fret}`} className="flex h-8 items-center justify-center">
                  {fret === activePatternWindow.startFret ? (
                    <button
                      type="button"
                      onClick={stepPatternLeft}
                      disabled={!canExpandPatternLeft}
                      aria-label="Pattern nach links erweitern"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[rgba(10,12,17,0.92)] text-[var(--muted-strong)] shadow-[0_8px_18px_rgba(0,0,0,0.28)] transition hover:border-white/18 hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.25} />
                    </button>
                  ) : fret === activePatternWindow.endFret ? (
                    <button
                      type="button"
                      onClick={stepPatternRight}
                      disabled={!canExpandPatternRight}
                      aria-label="Pattern nach rechts erweitern"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[rgba(10,12,17,0.92)] text-[var(--muted-strong)] shadow-[0_8px_18px_rgba(0,0,0,0.28)] transition hover:border-white/18 hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                    </button>
                  ) : null}
                </div>
              ))}

              <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns }}>
                <div />
                <div className="flex h-8 items-center justify-center" style={{ gridColumn: resetGridColumn }}>
                  <button
                    type="button"
                    onClick={resetPatternWindow}
                    aria-label="Pattern auf Basismuster zurücksetzen"
                    className="pointer-events-auto inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[rgba(10,12,17,0.92)] text-white/88 shadow-[0_8px_18px_rgba(0,0,0,0.28)] transition hover:border-white/18 hover:bg-white/[0.05] hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" strokeWidth={2.15} />
                  </button>
                </div>
              </div>
            </div>

            {displayStrings.map((guitarString) => (
              <Fragment key={guitarString.stringNumber}>
                <OpenStringCell
                  position={guitarString.positions[0]}
                  guitarString={guitarString}
                  isScaleTone={activeScalePitchClasses.has(guitarString.positions[0].pitchClass)}
                  isAccentScaleTone={activeScaleAccentPitchClasses.has(
                    guitarString.positions[0].pitchClass
                  )}
                  isWithinActiveWindow={isFretInWindow(
                    guitarString.positions[0].fret,
                    activePatternWindow
                  )}
                  scaleSelector={
                    guitarString.stringNumber === 6
                      ? getScaleSelector({
                          root: guitarString.positions[0].pitchClass,
                          rootFret: guitarString.positions[0].fret,
                        })
                      : undefined
                  }
                />

                {guitarString.positions.slice(1).map((position) => (
                  <NoteCell
                    key={`${guitarString.stringNumber}-${position.fret}`}
                    position={position}
                    guitarString={guitarString}
                    maxFret={maxFret}
                    isScaleTone={activeScalePitchClasses.has(position.pitchClass)}
                    isAccentScaleTone={activeScaleAccentPitchClasses.has(position.pitchClass)}
                    isWithinActiveWindow={isFretInWindow(position.fret, activePatternWindow)}
                    scaleSelector={
                      guitarString.stringNumber === 6
                        ? getScaleSelector({ root: position.pitchClass, rootFret: position.fret })
                        : undefined
                    }
                  />
                ))}
              </Fragment>
            ))}

            <div className="h-5 sm:h-7" />
            {fretNumbers.map((fret) => (
              <div
                key={`footer-${fret}`}
                className="flex h-5 items-end justify-center text-[clamp(0.42rem,0.88vw,0.9rem)] font-semibold text-[var(--muted)] sm:h-7"
              >
                {fret}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
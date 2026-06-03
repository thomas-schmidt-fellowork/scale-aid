'use client';

import * as Popover from "@radix-ui/react-popover";
import { useRef, useState } from "react";

import { useBasicScales } from "@/app/components/basic-scales/basic-scales-context";
import ScaleSelectionControls from "@/app/components/scale-selection-controls";
import {
  DEFAULT_MAX_FRET,
  getNearestFretForPitchClass,
  PITCH_CLASSES,
  STANDARD_TUNING,
  type PitchClass,
  type ScaleFamily,
  type ScaleQuality,
} from "@/app/lib/fretboard";

const qualityLabelByValue: Record<ScaleQuality, string> = {
  major: "Dur",
  minor: "Moll",
};

const familyLabelByValue: Record<ScaleFamily, string> = {
  pentatonic: "Pentatonik",
  blues: "Blues",
  diatonic: "Voll",
};

export default function ScaleSummaryPicker() {
  const { learningScale, selectLearningScale, selectedRootFret } = useBasicScales();
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  function clearCloseTimeout() {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function openPicker() {
    clearCloseTimeout();
    setIsOpen(true);
  }

  function scheduleClose() {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimeoutRef.current = null;
    }, 120);
  }

  function selectScaleRoot(root: PitchClass, family: ScaleFamily, quality: ScaleQuality) {
    const nextRootFret =
      root === learningScale.root
        ? selectedRootFret
        : getNearestFretForPitchClass(
            STANDARD_TUNING[0].openPitchClass,
            root,
            selectedRootFret,
            DEFAULT_MAX_FRET
          );

    selectLearningScale(
      root,
      family,
      quality,
      nextRootFret
    );
  }

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label="Aktive Skala ändern"
          onMouseEnter={openPicker}
          onMouseLeave={scheduleClose}
          onClick={openPicker}
          className="inline-flex min-w-0 cursor-pointer items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-sm transition hover:border-white/12 hover:bg-white/[0.05]"
        >
          <span className="font-semibold text-white">{learningScale.root}</span>
          <span className="text-white/28">·</span>
          <span className="text-white/72">{qualityLabelByValue[learningScale.quality]}</span>
          <span className="text-white/28">·</span>
          <span className="truncate text-white/72">{familyLabelByValue[learningScale.family]}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="center"
          sideOffset={12}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onMouseEnter={openPicker}
          onMouseLeave={scheduleClose}
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
                      selectScaleRoot(
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
                selectScaleRoot(learningScale.root, family, learningScale.quality)
              }
              onSelectQuality={(quality) =>
                selectScaleRoot(learningScale.root, learningScale.family, quality)
              }
            />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
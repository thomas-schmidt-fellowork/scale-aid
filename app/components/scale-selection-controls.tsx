'use client';

import * as ToggleGroup from "@radix-ui/react-toggle-group";

import { type ScaleFamily, type ScaleQuality } from "@/app/lib/fretboard";

type ScaleSelectionControlsProps = {
  family: ScaleFamily;
  quality: ScaleQuality;
  onSelectFamily: (family: ScaleFamily) => void;
  onSelectQuality: (quality: ScaleQuality) => void;
};

const familyOptions: { family: ScaleFamily; label: string; widthClass: string }[] = [
  { family: "pentatonic", label: "Pentatonik", widthClass: "flex-[1.25]" },
  { family: "blues", label: "Blues", widthClass: "flex-1" },
  { family: "diatonic", label: "Voll", widthClass: "flex-[0.9]" },
];

export default function ScaleSelectionControls({
  family,
  quality,
  onSelectFamily,
  onSelectQuality,
}: ScaleSelectionControlsProps) {
  return (
    <div className="space-y-3">
      <ToggleGroup.Root
        type="single"
        value={quality}
        onValueChange={(value) => {
          if (value === "major" || value === "minor") {
            onSelectQuality(value);
          }
        }}
        aria-label="Tonart wählen"
        className="grid grid-cols-2 gap-1 rounded-[0.7rem] bg-white/[0.04] p-1"
      >
        {([
          ["major", "Dur"],
          ["minor", "Moll"],
        ] as const).map(([qualityValue, qualityLabel]) => (
          <ToggleGroup.Item
            key={qualityValue}
            value={qualityValue}
            className="rounded-[0.5rem] px-3 py-2 text-sm font-medium text-white/48 outline-none transition hover:bg-white/[0.03] hover:text-white focus-visible:ring-2 focus-visible:ring-white/20 data-[state=on]:bg-white/[0.12] data-[state=on]:text-white"
          >
            {qualityLabel}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>

      <div className="flex gap-1 rounded-[0.7rem] bg-white/[0.04] p-1">
        {familyOptions.map((option) => {
          const isActive = family === option.family;

          return (
            <button
              key={option.family}
              type="button"
              onClick={() => onSelectFamily(option.family)}
              className={`min-w-0 ${option.widthClass} rounded-[0.5rem] px-2.5 py-2 text-center text-[0.92rem] font-medium leading-none tracking-[-0.02em] outline-none transition focus-visible:ring-2 focus-visible:ring-white/20 ${
                isActive
                  ? "bg-white/[0.12] text-white"
                  : "bg-transparent text-white/48 hover:bg-white/[0.03] hover:text-white"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
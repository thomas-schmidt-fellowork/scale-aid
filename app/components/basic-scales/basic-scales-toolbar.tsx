'use client';

import DisplaySettingsPopover from "@/app/components/basic-scales/display-settings-popover";
import ScaleSummaryPicker from "@/app/components/basic-scales/scale-summary-picker";

export default function BasicScalesToolbar() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div />
      <div className="justify-self-center">
        <ScaleSummaryPicker />
      </div>
      <div className="justify-self-end">
        <DisplaySettingsPopover />
      </div>
    </div>
  );
}
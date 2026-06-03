'use client';

import * as Popover from "@radix-ui/react-popover";
import * as Switch from "@radix-ui/react-switch";
import * as Tooltip from "@radix-ui/react-tooltip";
import { CircleHelp, Settings2 } from "lucide-react";
import { useId } from "react";

import { useBasicScales } from "@/app/components/basic-scales/basic-scales-context";

export default function DisplaySettingsPopover() {
  const { noteLabelMode, setNoteLabelMode } = useBasicScales();
  const compressedDisplayId = useId();

  return (
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
                  onCheckedChange={(checked) => setNoteLabelMode(checked ? "sharp" : "full")}
                  className="relative inline-flex h-4 w-8 shrink-0 cursor-pointer items-center rounded-full border border-white/10 bg-white/[0.06] p-[2px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.28)] outline-none transition focus-visible:ring-2 focus-visible:ring-white/20 data-[state=checked]:border-[color:rgba(77,255,196,0.3)] data-[state=checked]:bg-[rgba(77,255,196,0.18)]"
                >
                  <Switch.Thumb className="block h-3 w-3 rounded-full bg-white/92 shadow-[0_1px_4px_rgba(0,0,0,0.28)] transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-[var(--accent)]" />
                </Switch.Root>

                <label htmlFor={compressedDisplayId} className="text-sm font-medium text-white">
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
  );
}
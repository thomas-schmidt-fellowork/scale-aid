import { Fragment } from "react";

import { getFretboard } from "@/app/lib/fretboard";

type FretboardProps = {
  maxFret?: number;
};

function getStringThickness(stringNumber: number) {
  return `${0.9 + stringNumber * 0.32}px`;
}

export default function Fretboard({ maxFret = 24 }: FretboardProps) {
  const strings = getFretboard(maxFret);
  const displayStrings = [...strings].reverse();
  const fretNumbers = Array.from({ length: maxFret }, (_, index) => index + 1);
  const gridTemplateColumns = `clamp(1.9rem, 4.5vw, 3.2rem) repeat(${maxFret}, minmax(0, 1fr))`;

  return (
    <section className="flex h-full w-full items-center justify-center px-1.5 py-2 sm:px-3 sm:py-3">
      <div className="w-full rounded-[1.45rem] border border-white/24 bg-[linear-gradient(180deg,rgba(24,26,32,0.98),rgba(8,9,13,0.99))] p-[clamp(0.35rem,0.9vw,0.7rem)] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_16px_50px_rgba(0,0,0,0.62)]">
        <div className="rounded-[1.15rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,15,20,0.98),rgba(5,6,9,0.98))] p-[clamp(0.25rem,0.65vw,0.55rem)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.03)]">
          <div className="grid gap-y-1.5 sm:gap-y-2" style={{ gridTemplateColumns }}>

            {displayStrings.map((guitarString) => (
              <Fragment key={guitarString.stringNumber}>
                <div className="flex h-[clamp(2.2rem,8.2svh,4.4rem)] items-center justify-center pr-0.5 text-[clamp(0.78rem,1.55vw,1.45rem)] font-semibold text-white">
                  {guitarString.openPitchClass}
                </div>

                {guitarString.positions.slice(1).map((position) => {
                  const isNut = position.fret === 1;
                  const isLastFret = position.fret === maxFret;
                  const stringThickness = getStringThickness(guitarString.stringNumber);

                  return (
                    <div
                      key={`${guitarString.stringNumber}-${position.fret}`}
                      className={`relative flex h-[clamp(2.2rem,8.2svh,4.4rem)] items-center justify-center overflow-hidden ${
                        position.fret % 2 === 0
                          ? "bg-[linear-gradient(180deg,rgba(38,40,46,0.98),rgba(19,20,26,0.98))]"
                          : "bg-[linear-gradient(180deg,rgba(26,28,34,0.98),rgba(11,12,16,0.98))]"
                      } ${
                        isNut
                          ? "border-l-[5px] border-l-[var(--accent)]"
                          : "border-l border-l-white/28"
                      } ${isLastFret ? "border-r border-r-white/28" : ""}`}
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />
                      <div className="absolute inset-x-0 bottom-0 h-px bg-black/35" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_28%,transparent_72%,rgba(0,0,0,0.2))]" />
                      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]" />
                      <div
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.95),rgba(255,255,255,0.18))] shadow-[0_0_10px_rgba(255,255,255,0.08)]"
                        style={{ height: stringThickness }}
                      />
                      <span className="relative z-10 inline-flex min-w-0 max-w-[94%] items-center justify-center rounded-full border border-[color:rgba(77,255,196,0.32)] bg-[rgba(3,4,7,0.97)] px-[clamp(0.08rem,0.22vw,0.4rem)] py-[clamp(0.08rem,0.16vw,0.2rem)] text-[clamp(0.3rem,0.76vw,0.82rem)] font-semibold leading-none tracking-[-0.02em] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_0_10px_rgba(77,255,196,0.08)] sm:px-2 sm:py-0.75">
                        {position.label}
                      </span>
                    </div>
                  );
                })}
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
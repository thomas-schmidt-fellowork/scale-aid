'use client';

import type { ReactNode } from "react";

import { BasicScalesProvider } from "@/app/components/basic-scales/basic-scales-context";

export default function BasicScalesWorkspace({ children }: { children: ReactNode }) {
  return (
    <BasicScalesProvider>
      <div className="flex min-h-full flex-col">
        <div className="flex min-h-0 flex-1 flex-col">
          {children}
        </div>
      </div>
    </BasicScalesProvider>
  );
}
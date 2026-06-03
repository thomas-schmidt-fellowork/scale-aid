import type { ReactNode } from "react";

import BasicScalesWorkspace from "@/app/components/basic-scales/basic-scales-workspace";

export default function BasicScalesLayout({ children }: { children: ReactNode }) {
  return <BasicScalesWorkspace>{children}</BasicScalesWorkspace>;
}
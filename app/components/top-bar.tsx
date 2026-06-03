"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteName } from "@/app/lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/basics", label: "Basics" },
  { href: "/basic-scales", label: "Basic Scales" },
];

export default function TopBar() {
  const pathname = usePathname();

  return (
    <div className="flex w-full items-center">
      <Link href="/" className="flex items-center gap-3">
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_16px_rgba(77,255,196,0.42)]" />
        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white/92">
          {siteName}
        </span>
      </Link>

      <nav className="ml-auto flex items-center gap-1">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white"
                  : "rounded-full px-4 py-2 text-sm font-medium text-white/50 transition hover:bg-white/6 hover:text-white"
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

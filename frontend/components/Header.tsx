"use client";

import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  onClick?: () => void;
}

export default function Header({ title, onClick }: HeaderProps) {
  return (
    <div className="sticky top-0 z-30 w-full border-b border-black/10 bg-myred/96 text-white shadow-[0_12px_28px_rgba(45,3,3,0.18)] backdrop-blur-sm">
      <div className="content-wrap flex min-h-[88px] items-center gap-3 py-5">
        <button
          type="button"
          onClick={onClick}
          aria-label="Go back"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 transition hover:bg-white/16 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/35"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <span className="block text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
            Attends
          </span>
          <span className="block truncate text-xl font-semibold tracking-[-0.02em]">
            {title}
          </span>
        </div>

        <div className="h-11 w-11 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
}

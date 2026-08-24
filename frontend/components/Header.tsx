"use client";

import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  onClick?: () => void;
}

export default function Header({ title, onClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-blue-700 bg-blue-600 text-white">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onClick}
          aria-label="Go back"
          className="grid size-9 place-items-center rounded-md text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="border-l border-blue-400 pl-3">
          <p className="text-xs font-medium text-blue-100">Attends</p>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      </div>
    </header>
  );
}

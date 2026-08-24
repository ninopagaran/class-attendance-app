"use client";

import { ArrowUpRight, CalendarDays } from "lucide-react";

interface CardProps {
  title: string;
  onClick?: () => void;
}

export default function CalendarCard({ title, onClick }: CardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-40 w-full flex-col rounded-lg border border-slate-200 bg-white p-5 text-left transition hover:border-blue-400 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div className="flex items-center justify-between text-slate-500">
        <CalendarDays className="size-5" strokeWidth={1.75} />
        <ArrowUpRight className="size-4" />
      </div>
      <div className="mt-auto pt-7">
        <p className="text-xs font-medium text-slate-500">Session</p>
        <h2 className="mt-2 text-base font-semibold leading-snug text-slate-900">{title}</h2>
      </div>
    </button>
  );
}

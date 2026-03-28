"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface StatButtonProps {
  label: string;
  count: number;
  names: string[]; // Array of names to show in the table
}

export default function StatButton({ label, count, names }: StatButtonProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-[1.4rem] bg-myred p-4 text-white shadow-[0_16px_30px_rgba(45,3,3,0.18)] transition duration-200 hover:bg-[#740000]"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="text-lg font-medium">
          {label} | {count}
        </span>
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="surface-card-soft mt-3 overflow-hidden border border-[#d7beb8]">
          <table className="w-full text-left text-sm text-black">
            <thead className="bg-[#f3e1dd] text-[#6f1a1a]">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
              </tr>
            </thead>
            <tbody>
              {names.map((name, idx) => (
                <tr key={idx} className="border-t border-black/10">
                  <td className="px-4 py-3 text-[#2c1a1a]">{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

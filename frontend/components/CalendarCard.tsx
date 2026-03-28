"use client";

import React from "react";

interface CardProps {
  title: string;
  onClick?: () => void;
}

const CalendarCard = ({ title, onClick }: CardProps) => {
  return (
    <button
      type="button"
      className="group surface-card-soft flex min-h-[9.5rem] w-full flex-col overflow-hidden text-left transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(55,14,14,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#890000]/20"
      onClick={onClick}
    >
      <div className="bg-myred px-4 py-3 text-white">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
          Session
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center bg-[#ebe3df] px-5 py-6">
        <span className="text-center text-lg font-semibold leading-snug tracking-[-0.02em] text-[#231515]">
          {title}
        </span>
      </div>
    </button>
  );
};

export default CalendarCard;

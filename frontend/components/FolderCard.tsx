"use client";

import React from "react";

interface TitleCardProps {
  title: string;
  onClick?: () => void;
}

const FolderCard = ({ title, onClick }: TitleCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="group mx-auto flex w-full max-w-[19rem] cursor-pointer flex-col text-left transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#890000]/20"
  >
    <div className="ml-5 h-5 w-24 rounded-t-[1rem] border-x-2 border-t-2 border-black bg-myred shadow-[0_8px_18px_rgba(45,3,3,0.12)] transition duration-200 group-hover:translate-x-1" />
    <div className="-mt-px overflow-hidden rounded-[2rem] rounded-tl-[1.35rem] border-2 border-black bg-white shadow-[0_18px_35px_rgba(31,19,19,0.12)]">
      <div className="bg-myred px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
          Course
        </p>
      </div>

      <div className="flex min-h-[8.75rem] items-center justify-center bg-[#ebe3df] px-6 py-8">
        <p className="text-center text-lg font-bold leading-snug tracking-[-0.02em] break-words text-[#231515]">
          {title}
        </p>
      </div>
    </div>
  </button>
);

export default FolderCard;

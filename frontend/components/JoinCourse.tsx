"use client";

import React, { useState } from "react";

interface JoinSessionFormProps {
  onClose: () => void;
  onJoin: (data: { code: string }) => void;
}

const JoinSessionForm: React.FC<JoinSessionFormProps> = ({ onClose, onJoin }) => {
  const [joinCode, setJoinCode] = useState("");

  const handleJoin = () => {
    if (!joinCode.trim()) {
      alert("Please enter a join code.");
      return;
    }

    onJoin({ code: joinCode.trim() });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card flex flex-col gap-5">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-myred">
            Join New Course
          </h2>
          <p className="text-sm leading-6 text-[#6a5555]">
            Enter the course code shared by your host.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="joinCode" className="text-sm font-medium text-[#3b2323]">
            Join Code
          </label>
          <input
            id="joinCode"
            type="text"
            className="h-14 rounded-2xl border border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
            placeholder="Enter course code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-2xl bg-[#f0e6e3] px-5 text-sm font-medium text-[#3a2626] transition hover:bg-[#e8dbd6]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleJoin}
            className="h-11 rounded-2xl bg-myred px-5 text-sm font-medium text-white shadow-[0_14px_28px_rgba(45,3,3,0.18)] transition hover:bg-[#740000]"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinSessionForm;

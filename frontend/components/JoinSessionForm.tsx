"use client";

import React, { useState } from "react";

interface JoinSessionFormProps {
  onClose: () => void;
  onJoin: (data: {
    number1: number;
    number2: number;
    photo: File | null;
  }) => void;
}

const JoinSessionForm: React.FC<JoinSessionFormProps> = ({
  onClose,
  onJoin,
}) => {
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);

  const handleJoin = () => {
    if (!photo) {
      alert("Please upload a photo before joining.");
      return;
    }

    onJoin({
      number1,
      number2,
      photo,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card flex flex-col gap-5">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#221515]">
            Join Session
          </h2>
          <p className="text-sm leading-6 text-[#6a5555]">
            Confirm your location and attach a proof image before submitting
            attendance.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <div className="flex flex-col flex-1 min-w-0">
              <label className="text-sm font-medium text-[#3b2323]">
                Latitude
              </label>
              <input
                type="number"
                value={number1}
                onChange={(e) => setNumber1(parseFloat(e.target.value))}
                className="h-14 w-full rounded-2xl border border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
              />
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <label className="text-sm font-medium text-[#3b2323]">
                Longitude
              </label>
              <input
                type="number"
                value={number2}
                onChange={(e) => setNumber2(parseFloat(e.target.value))}
                className="h-14 w-full rounded-2xl border border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
              />
            </div>
          </div>
          <label className="text-sm font-medium text-[#3b2323]">
            Upload Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            className="rounded-2xl border border-dashed border-[#c9abaa] bg-[#faf5f2] px-4 py-4 text-sm text-[#4a3434]"
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

"use client";

import React, { useState } from "react";

interface UpdateProfileFormProps {
  onClose: () => void;
  onUpdate: (data: { name: string; email: string }) => void;
  initialName?: string;
  initialEmail?: string;
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  onClose,
  onUpdate,
  initialName = "",
  initialEmail = "",
}) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  const handleUpdate = () => {
    if (!name.trim() || !email.trim()) {
      alert("Please enter both name and email.");
      return;
    }

    onUpdate({ name: name.trim(), email: email.trim() });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card flex flex-col gap-5">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#221515]">
            Update Profile
          </h2>
          <p className="text-sm leading-6 text-[#6a5555]">
            Edit your account details and save the latest information.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-[#3b2323]">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="h-14 rounded-2xl border border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-[#3b2323]">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="h-14 rounded-2xl border border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onClick={handleUpdate}
            className="h-11 rounded-2xl bg-myred px-5 text-sm font-medium text-white shadow-[0_14px_28px_rgba(45,3,3,0.18)] transition hover:bg-[#740000]"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileForm;

// src/components/SimpleUnenrollModal.tsx (or whatever name you choose)
"use client";

import React from "react";

// Define the interface for the 'course' data
// (Assuming 'session' in your original code refers to a course object given the fields)
interface CourseDetails {
  course_id: number;
  name: string;
  join_code: string;
  geolocation_latitude: number | null;
  geolocation_longitude: number | null;
  late_threshold_minutes: number;
  present_threshold_minutes: number;
}

interface SimpleUnenrollModalProps {
  course: CourseDetails; // Renamed from 'session' to 'course' for clarity
  onCancel: () => void;
  onUnenroll: () => void;
}

export default function SimpleUnenrollModal({ course, onCancel, onUnenroll }: SimpleUnenrollModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-card flex max-w-sm flex-col gap-5">
        <div className="border-b border-black/10 pb-3 text-center">
          <h2 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#221515]">
            {course.name}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6a5555]">
            Leave this course and remove it from your attending list.
          </p>
        </div>

        <p className="text-center text-sm leading-6 text-[#5d4949]">
          Are you sure you want to unenroll from this course?
        </p>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-2xl bg-[#f0e6e3] px-5 text-sm font-medium text-[#3a2626] transition hover:bg-[#e8dbd6]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onUnenroll}
            className="h-11 rounded-2xl bg-myred px-5 text-sm font-medium text-white shadow-[0_14px_28px_rgba(45,3,3,0.18)] transition hover:bg-[#740000]"
          >
            Unenroll
          </button>
        </div>
      </div>
    </div>
  );
}

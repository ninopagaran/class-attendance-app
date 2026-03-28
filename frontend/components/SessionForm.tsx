// frontend/components/SessionForm.tsx
"use client";

import React, { useState } from "react";
import { toast } from "sonner"; // Import toast for notifications

// Remove the mock data import, as sessions will be created via API
// import { sessionsSample } from '@/content/data';

interface SessionFormProps {
  onClose: () => void;
  // onCreate will now trigger a re-fetch in the parent component
  // so we don't necessarily need to pass the new session object back here directly,
  // but it's good practice for consistency if the backend sends it.
  onCreate: (session?: {
    // Make session optional as parent might just re-fetch
    session_id: number;
    start_time: number;
    end_time: number;
    course_id: number;
    // ... any other properties returned by backend
  }) => void;
  courseId: number; // NEW: Prop to receive the course ID
}

const SessionForm: React.FC<SessionFormProps> = ({
  onClose,
  onCreate,
  courseId,
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent double submissions

  const toUnix = (timeStr: string): number | null => {
    // Ensure the date string is in a format Date constructor can reliably parse (ISO 8601)
    // datetime-local inputs usually provide "YYYY-MM-DDTHH:MM" which is fine.
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) {
      console.error("Invalid date string for conversion:", timeStr);
      return null;
    }
    return Math.floor(date.getTime() / 1000); // Convert to Unix timestamp (seconds)
  };

  const handleSubmit = async () => {
    // Make handleSubmit async
    if (isSubmitting) return; // Prevent multiple clicks

    const unixStart = toUnix(startTime);
    const unixEnd = toUnix(endTime);

    if (!unixStart || !unixEnd) {
      toast.error(
        "Invalid date/time format. Please select valid start and end times.",
      );
      return;
    }

    if (unixStart >= unixEnd) {
      toast.error("Start time must be before end time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/sessions`, {
        // API endpoint for creating a session
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_time: unixStart,
          end_time: unixEnd,
          // course_id is already in the URL path, no need to send in body
        }),
      });

      const data = await response.json(); // Parse response data

      if (response.ok) {
        toast.success(data.message || "Session created successfully!");
        onCreate(data.session); // Pass the session object returned by backend, if any
        onClose(); // Close the form on success
      } else {
        // Handle specific error messages from the backend
        toast.error(data.error || "Failed to create session.");
        console.error("API Error:", data);
      }
    } catch (error) {
      console.error("Network or unexpected error:", error);
      toast.error("Network error or unexpected issue creating session.");
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card flex flex-col gap-5">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#221515]">
            Create New Session
          </h2>
          <p className="text-sm leading-6 text-[#6a5555]">
            Pick the start and end times for this class session.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="startTime"
            className="text-sm font-medium text-[#3b2323]"
          >
            Start Time
          </label>
          <input
            id="startTime"
            type="datetime-local"
            className="h-14 w-full rounded-2xl border border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="endTime"
            className="text-sm font-medium text-[#3b2323]"
          >
            End Time
          </label>
          <input
            id="endTime"
            type="datetime-local"
            className="h-14 w-full rounded-2xl border border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515] outline-none transition focus:border-[#890000]/25 focus:ring-4 focus:ring-[#890000]/10"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-2xl bg-[#f0e6e3] px-5 text-sm font-medium text-[#3a2626] transition hover:bg-[#e8dbd6]"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-11 rounded-2xl bg-myred px-5 text-sm font-medium text-white shadow-[0_14px_28px_rgba(45,3,3,0.18)] transition hover:bg-[#740000]"
            disabled={isSubmitting} // Disable during submission
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionForm;

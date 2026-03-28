// frontend/app/(root)/[hosting_or_attending]/sessions/[id]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarClock, MapPin, ScanFace } from "lucide-react";

import Header from "@/components/Header";

// Define interfaces for your data structures, matching backend responses
interface SessionDetails {
  session_id: number;
  course_id: number;
  start_time: number;
  end_time: number;
  course_name: string; // This comes from the JOIN in the backend's /sessions/<id> route
  host_id: number; // This also comes from the JOIN
}

interface AttendanceRecord {
  attendance_id: number;
  session_id: number;
  user_id: number;
  status: "Present" | "Late" | "Absent";
  late_minutes: number | null;
  joined_at: number;
  user_geolocation_latitude: number | null; // Added based on new API
  user_geolocation_longitude: number | null; // Added based on new API
  proof_base64: string | null; // Added based on new API
}

const SessionSummary = () => {
  const router = useRouter();
  const params = useParams(); // Get URL parameters
  // Ensure sessionId is parsed correctly from the dynamic route segment
  const sessionId = params.id ? parseInt(params.id as string, 10) : null;

  const { isLoggedIn, loading: authLoading, user } = useAuth(); // Assuming 'user' is available from AuthContext

  const [sessionData, setSessionData] = useState<SessionDetails | null>(null);
  const [attendanceRecord, setAttendanceRecord] =
    useState<AttendanceRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessionAndAttendance = useCallback(async () => {
    // Prevent fetching if still authenticating, not logged in, user data is missing, or sessionId is invalid
    if (authLoading || !isLoggedIn || !user || sessionId === null) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null); // Clear any previous errors
    try {
      // 1. Fetch Session Details from /api/sessions/<session_id>
      const sessionResponse = await fetch(`/api/sessions/${sessionId}`);
      const sessionJson = await sessionResponse.json();

      if (!sessionResponse.ok) {
        // If session not found or forbidden, set error and redirect
        setError(sessionJson.error || "Failed to fetch session details.");
        toast.error(sessionJson.error || "Failed to fetch session details.");
        router.back(); // Or redirect to a fallback page like /attending or /hosting
        return;
      }
      setSessionData(sessionJson);

      // 2. Fetch User's Attendance Status for this Session from /api/users/<user_id>/attendances
      // We will then filter this list to find the specific attendance for the current sessionId
      const attendanceResponse = await fetch(
        `/api/users/${user.id}/attendances`,
      );
      const attendanceJson = await attendanceResponse.json();

      if (attendanceResponse.ok) {
        // Find the attendance record for the current session
        const userAttendanceForSession = attendanceJson.find(
          (record: AttendanceRecord) => record.session_id === sessionId,
        );
        setAttendanceRecord(userAttendanceForSession || null); // Set to null if no record found for this session
      } else {
        // If there's an error fetching attendance, log it but don't block session display
        console.error(
          "Error fetching attendance status:",
          attendanceJson.error || attendanceJson.message,
        );
        toast.error(
          attendanceJson.error ||
            attendanceJson.message ||
            "Failed to fetch attendance status.",
        );
        setAttendanceRecord(null); // Ensure no old attendance data is displayed
      }
    } catch (err) {
      console.error("Network or unexpected error fetching data:", err);
      setError("Network error or unexpected issue fetching session data.");
      toast.error("Network error fetching session data.");
      setSessionData(null);
      setAttendanceRecord(null);
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, isLoggedIn, user, sessionId, router]); // Dependencies for useCallback

  // Effect hook to trigger the data fetching
  useEffect(() => {
    fetchSessionAndAttendance();
  }, [fetchSessionAndAttendance]); // Re-run when fetch function itself changes (due to dependency changes)

  // Helper functions for date and time formatting
  const getDateSession = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp (seconds) to milliseconds
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (unix: number) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const date = new Date(unix * 1000);
    return date.toLocaleTimeString("en-US", options);
  };

  // Helper function to get status color
  const getStatusColor = (status: AttendanceRecord["status"] | undefined) => {
    switch (status) {
      case "Present":
        return "text-green-600";
      case "Late":
        return "text-yellow-600";
      case "Absent":
        return "text-red-600";
      default:
        return "text-gray-600"; // Default color if status is undefined/null
    }
  };

  // --- Conditional Rendering for Loading/Error States ---
  if (authLoading || isLoading) {
    return (
      <div className="paper-shell flex min-h-screen w-full items-center justify-center">
        <p>Loading session summary...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white w-full">
        <p>Please log in to view session summaries.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="paper-shell flex min-h-screen w-full items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white w-full">
        <p>Session not found or inaccessible.</p>
      </div>
    );
  }

  // Once all data is loaded and available
  return (
    <div className="paper-shell min-h-screen flex flex-col w-full">
      <Header
        title={getDateSession(sessionData.start_time)}
        onClick={() => router.back()}
      />

      <main className="content-wrap flex w-full flex-1 flex-col gap-8 py-8 sm:py-10">
        <section className="surface-card p-6 text-center sm:p-8">
          <span className="paper-badge mx-auto">Attendance Result</span>
          <div className="mt-4 space-y-2">
            <h1 className="section-title">Session Summary</h1>
            <p className="section-copy">{sessionData.course_name}</p>
          </div>

          <div className="meta-grid mt-8 text-left">
            <div className="meta-card">
              <div className="flex items-center gap-2 text-[#7b4f4f]">
                <CalendarClock className="h-4 w-4" />
                <span className="meta-label">Start Time</span>
              </div>
              <p className="meta-value">{formatTime(sessionData.start_time)}</p>
            </div>
            <div className="meta-card">
              <div className="flex items-center gap-2 text-[#7b4f4f]">
                <CalendarClock className="h-4 w-4" />
                <span className="meta-label">End Time</span>
              </div>
              <p className="meta-value">{formatTime(sessionData.end_time)}</p>
            </div>
            <div className="meta-card sm:col-span-2 xl:col-span-2">
              <div className="flex items-center gap-2 text-[#7b4f4f]">
                <span className="meta-label">Status</span>
              </div>
              {attendanceRecord ? (
                <p
                  className={`meta-value text-2xl ${getStatusColor(attendanceRecord.status)}`}
                >
                  {attendanceRecord.status}
                </p>
              ) : (
                <p className="meta-value text-[#6a5555]">
                  Attendance status not available
                </p>
              )}
            </div>
          </div>
        </section>

        {attendanceRecord ? (
          <section className="surface-card p-5 sm:p-7">
            <div className="mb-6 space-y-1">
              <p className="section-kicker">Details</p>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#211414]">
                Recorded attendance data
              </h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="record-card space-y-4">
                {attendanceRecord.status === "Late" &&
                  attendanceRecord.late_minutes !== null && (
                    <div>
                      <p className="meta-label">Late Arrival</p>
                      <p className="meta-value">
                        {attendanceRecord.late_minutes} minutes late
                      </p>
                    </div>
                  )}

                {attendanceRecord.joined_at &&
                  attendanceRecord.status !== "Absent" && (
                    <div className="flex items-center gap-2 text-[#4d3a3a]">
                      <CalendarClock className="h-4 w-4 text-[#7b4f4f]" />
                      <span>Joined at {formatTime(attendanceRecord.joined_at)}</span>
                    </div>
                  )}

                {attendanceRecord.user_geolocation_latitude !== null &&
                  attendanceRecord.user_geolocation_longitude !== null && (
                    <div className="flex items-start gap-2 text-[#4d3a3a]">
                      <MapPin className="mt-0.5 h-4 w-4 text-[#7b4f4f]" />
                      <span>
                        {attendanceRecord.user_geolocation_latitude},{" "}
                        {attendanceRecord.user_geolocation_longitude}
                      </span>
                    </div>
                  )}
              </div>

              <div className="record-card">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b3d3d]">
                  <ScanFace className="h-4 w-4" />
                  Proof Image
                </div>
                {attendanceRecord.proof_base64 ? (
                  <img
                    src={`data:image/jpeg;base64,${attendanceRecord.proof_base64}`}
                    alt="Proof of attendance"
                    className="w-full rounded-[1.35rem] border border-black/10 object-contain"
                  />
                ) : (
                  <div className="empty-state min-h-[14rem]">
                    <p className="section-copy">No proof image was attached.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : (
          <div className="empty-state">
            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-semibold text-[#241616]">
                No recorded attendance
              </h3>
              <p className="section-copy">
                Attendance data is not available for this session yet.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SessionSummary;

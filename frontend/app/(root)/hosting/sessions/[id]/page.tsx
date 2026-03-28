// frontend/app/(root)/[hosting_or_attending]/sessions/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation"; // Import useParams to get the session ID
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { CalendarClock, MapPin, ScanFace, Users } from "lucide-react";

import Header from "@/components/Header";
import StatButton from "@/components/StatButton";

// Define the expected structure of a single attendance record from the new API
interface RawAttendanceRecord {
  attendance_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  status: "Present" | "Late" | "Absent";
  joined_at: number;
  user_geolocation_latitude: number | null;
  user_geolocation_longitude: number | null;
  proof_base64: string | null;
}

// Define the expected structure of the entire API response for session attendances
interface RawAttendanceSummaryResponse {
  session_id: number;
  course_id: number;
  session_start_time: number;
  session_end_time: number;
  attendances: RawAttendanceRecord[];
}

// Define the structure needed for your existing StatButton components and overall summary
interface AttendanceSummaryData {
  present: { count: number; names: string[] };
  late: { count: number; names: string[] };
  absent: { count: number; names: string[] };
  total_attendees_recorded: number;
  session_details: {
    session_id: number;
    course_id: number;
    start_time: number;
    end_time: number;
  };
}

interface Session {
  session_id: number;
  course_id: number;
  start_time: number;
  end_time: number;
}

export default function AttendanceSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id ? parseInt(params.id as string, 10) : null;

  const [attendanceSummary, setAttendanceSummary] =
    useState<AttendanceSummaryData | null>(null);
  const [rawAttendanceRecords, setRawAttendanceRecords] = useState<
    RawAttendanceRecord[]
  >([]); // New state to store individual records
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const fetchAttendanceSummary = useCallback(async () => {
    if (sessionId === null || isNaN(sessionId)) {
      setError("Invalid session ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/attendances`); // Using the new route
      const data:
        | RawAttendanceSummaryResponse
        | { message: string; error?: string } = await response.json();

      const res = await fetch(`/api/sessions/${sessionId}`);
      const data2 = await res.json();

      if (res.ok)
        setSession({
          session_id: data2.session_id,
          course_id: data2.course_id,
          start_time: data2.start_time,
          end_time: data2.end_time,
        });

      if (response.ok) {
        // Process the raw attendance data into the format needed for StatButtons
        const presentNames: string[] = [];
        const lateNames: string[] = [];
        const absentNames: string[] = [];
        let totalAttendees = 0;

        // Ensure data is of type RawAttendanceSummaryResponse before accessing .attendances
        if ("attendances" in data && Array.isArray(data.attendances)) {
          data.attendances.forEach((record) => {
            totalAttendees++;
            if (record.status === "Present") {
              presentNames.push(record.user_name);
            } else if (record.status === "Late") {
              lateNames.push(record.user_name);
            } else if (record.status === "Absent") {
              absentNames.push(record.user_name);
            }
          });

          setAttendanceSummary({
            present: { count: presentNames.length, names: presentNames },
            late: { count: lateNames.length, names: lateNames },
            absent: { count: absentNames.length, names: absentNames },
            total_attendees_recorded: totalAttendees,
            session_details: {
              session_id: data.session_id,
              course_id: data.course_id,
              start_time: data.session_start_time,
              end_time: data.session_end_time,
            },
          });
          setRawAttendanceRecords(data.attendances); // Store raw records
        } else {
          // Handle case where 'attendances' might be missing but response.ok is true (e.g., empty session)
          setAttendanceSummary({
            present: { count: 0, names: [] },
            late: { count: 0, names: [] },
            absent: { count: 0, names: [] },
            total_attendees_recorded: 0,
            session_details: {
              // Default session details if no attendance data comes
              session_id: sessionId,
              course_id: 0, // Placeholder
              start_time: Date.now() / 1000, // Placeholder
              end_time: Date.now() / 1000, // Placeholder
            },
          });
          setRawAttendanceRecords([]);
          toast.info(
            (data as { message: string }).message ||
              "No attendance records found for this session.",
          );
        }
      } else {
        // Handle error response from the API
        setError(
          (data as { error?: string; message?: string }).error ||
            (data as { message: string }).message ||
            "Failed to fetch attendance summary.",
        );
        toast.error(
          (data as { error?: string; message?: string }).error ||
            (data as { message: string }).message ||
            "Failed to fetch attendance summary.",
        );
        setAttendanceSummary(null);
        setRawAttendanceRecords([]);
      }
    } catch (err) {
      console.error("Error fetching attendance summary:", err);
      setError("Network error or unexpected issue.");
      toast.error(
        "Network error or unexpected issue fetching attendance summary.",
      );
      setAttendanceSummary(null);
      setRawAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchAttendanceSummary();
  }, [fetchAttendanceSummary]);

  // Function to convert Unix timestamp to a readable date string
  const formatUnixTimestampToDate = (timestamp: number | undefined) => {
    if (!timestamp) return "Loading Date...";
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function for date and time formatting
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
  const getStatusColor = (
    status: RawAttendanceRecord["status"] | undefined,
  ) => {
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

  const formattedDate = formatUnixTimestampToDate(
    attendanceSummary?.session_details?.start_time,
  );

  const formatUnixTime2 = (timeStamp: number) => {
    const time = new Date(timeStamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return time.toLocaleTimeString("en-US", options);
  };

  if (loading) {
    return (
      <div className="paper-shell flex min-h-screen w-full items-center justify-center">
        <p>Loading attendance summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="paper-shell min-h-screen w-full">
        <Header title="Attendance Summary" onClick={() => router.back()} />
        <main className="content-wrap flex min-h-[calc(100vh-88px)] flex-col items-center justify-center py-10">
          <div className="surface-card max-w-xl p-8 text-center">
            <p className="section-kicker">Session Error</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#241616]">
              Couldn&apos;t load this session
            </h1>
            <p className="mt-3 section-copy text-red-700">Error: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  // If no attendance summary but no error, means no records found.
  return (
    <div className="paper-shell min-h-screen w-full">
      <Header
        title={attendanceSummary ? formattedDate : "Attendance Summary"}
        onClick={() => router.back()}
      />
      <main className="content-wrap flex w-full flex-1 flex-col gap-8 py-8 sm:py-10">
        <section className="surface-card p-6 sm:p-8">
          <div className="space-y-3">
            <span className="paper-badge">Host View</span>
            <div className="space-y-2">
              <h1 className="section-title">
                {attendanceSummary ? formattedDate : "Attendance Summary"}
              </h1>
              <p className="section-copy">
                Review the attendance split for this session and inspect each
                submitted record below.
              </p>
            </div>
          </div>

          <div className="meta-grid mt-8">
            <div className="meta-card">
              <div className="flex items-center gap-2 text-[#7b4f4f]">
                <CalendarClock className="h-4 w-4" />
                <span className="meta-label">Start Time</span>
              </div>
              <p className="meta-value">
                {session?.start_time
                  ? formatUnixTime2(session.start_time)
                  : "No start time"}
              </p>
            </div>
            <div className="meta-card">
              <div className="flex items-center gap-2 text-[#7b4f4f]">
                <CalendarClock className="h-4 w-4" />
                <span className="meta-label">End Time</span>
              </div>
              <p className="meta-value">
                {session?.end_time ? formatUnixTime2(session.end_time) : "No end time"}
              </p>
            </div>
            <div className="meta-card">
              <div className="flex items-center gap-2 text-[#7b4f4f]">
                <Users className="h-4 w-4" />
                <span className="meta-label">Recorded</span>
              </div>
              <p className="meta-value">
                {attendanceSummary?.total_attendees_recorded ?? 0} attendees
              </p>
            </div>
          </div>
        </section>

        {!attendanceSummary ? (
          <div className="empty-state">
            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-semibold text-[#241616]">
                No attendance summary yet
              </h3>
              <p className="section-copy">
                No attendance records are available for this session right now.
              </p>
            </div>
          </div>
        ) : (
          <>
            <section className="surface-card p-5 sm:p-7">
              <div className="mb-6 space-y-1">
                <p className="section-kicker">Overview</p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#211414]">
                  Attendance totals
                </h2>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <StatButton
                  label="Present"
                  count={attendanceSummary.present.count}
                  names={attendanceSummary.present.names}
                />
                <StatButton
                  label="Absent"
                  count={attendanceSummary.absent.count}
                  names={attendanceSummary.absent.names}
                />
                <StatButton
                  label="Late"
                  count={attendanceSummary.late.count}
                  names={attendanceSummary.late.names}
                />
              </div>
            </section>

            {rawAttendanceRecords.length > 0 && (
              <section className="surface-card p-5 sm:p-7">
                <div className="mb-6 space-y-1">
                  <p className="section-kicker">Records</p>
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#211414]">
                    Individual attendance entries
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {rawAttendanceRecords.map((record) => (
                    <article key={record.attendance_id} className="record-card">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-[#241616]">
                            {record.user_name}
                          </p>
                          <p className="mt-1 text-sm text-[#725c5c]">
                            {record.user_email}
                          </p>
                        </div>
                        <span
                          className={`rounded-full bg-[#f7ebe7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusColor(record.status)}`}
                        >
                          {record.status}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3 text-sm text-[#4d3a3a]">
                        {record.joined_at > 0 && (
                          <div className="flex items-center gap-2">
                            <CalendarClock className="h-4 w-4 text-[#7b4f4f]" />
                            <span>Joined: {formatTime(record.joined_at)}</span>
                          </div>
                        )}
                        {record.user_geolocation_latitude !== null &&
                          record.user_geolocation_longitude !== null && (
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 text-[#7b4f4f]" />
                              <span>
                                {record.user_geolocation_latitude},{" "}
                                {record.user_geolocation_longitude}
                              </span>
                            </div>
                          )}
                        {record.proof_base64 && (
                          <div className="overflow-hidden rounded-[1.35rem] border border-black/10 bg-white">
                            <div className="flex items-center gap-2 border-b border-black/10 bg-[#f4e4df] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b3d3d]">
                              <ScanFace className="h-4 w-4" />
                              Proof Image
                            </div>
                            <div className="p-4">
                              <img
                                src={`data:image/jpeg;base64,${record.proof_base64}`}
                                alt="Proof of attendance"
                                className="w-full rounded-xl border border-black/10 object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

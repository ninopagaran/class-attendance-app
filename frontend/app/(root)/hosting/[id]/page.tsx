"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

import SessionForm from "@/components/SessionForm";
import CourseForm2 from "@/components/CourseForm2"; // <--- IMPORT YOUR COURSE FORM HERE
import Header from "@/components/Header";
import CalendarCard from "@/components/CalendarCard";
import { CalendarDays, Hash, MapPin, Pencil, TimerReset } from "lucide-react";

interface Course {
  course_id: number;
  name: string;
  join_code: string;
  host_id: number;
  host_name: string;
  late_threshold_minutes: number;
  present_threshold_minutes: number;
  geolocation_latitude: number | null; // <--- ADD | null for robustness
  geolocation_longitude: number | null; // <--- ADD | null for robustness
  created_at: number;
}

// Ensure Session interface matches what your SessionForm expects for onCreate
interface Session {
  session_id: number;
  course_id: number;
  start_time: number;
  end_time: number;
}

// Define the structure for CourseFormData expected by CourseForm
// This should match the initialCourseData prop type in CourseForm.tsx
interface CourseFormData {
  course_id?: number;
  name: string;
  join_code: string;
  geolocation_latitude: number | null;
  geolocation_longitude: number | null;
  present_threshold_minutes: number;
  late_threshold_minutes: number;
}

const HostingCourse = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id ? parseInt(params.id as string, 10) : null;

  const { isLoggedIn, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [showSessionForm, setShowSessionForm] = useState(false); // Renamed from showForm for clarity
  const [showCourseForm, setShowCourseForm] = useState(false); // <--- NEW STATE FOR COURSE FORM

  const fetchCourseDetails = useCallback(async () => {
    if (authLoading || !isLoggedIn || courseId === null) {
      return;
    }
    setIsLoadingCourse(true);
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();

      if (response.ok) {
        setCourse(data);
      } else {
        toast.error(data.error || "Failed to fetch course details.");
        setCourse(null);
        router.push("/hosting");
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast.error("Network error or unexpected issue fetching course details.");
      setCourse(null);
      router.push("/hosting");
    } finally {
      setIsLoadingCourse(false);
    }
  }, [authLoading, isLoggedIn, courseId, router]);

  const fetchCourseSessions = useCallback(async () => {
    if (authLoading || !isLoggedIn || courseId === null) {
      return;
    }
    setIsLoadingSessions(true);
    try {
      const response = await fetch(`/api/courses/${courseId}/sessions`);
      const data = await response.json();

      if (response.ok) {
        setSessions(data || []);
      } else {
        toast.error(data.error || "Failed to fetch sessions.");
        setSessions([]);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Network error or unexpected issue fetching sessions.");
      setSessions([]);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [authLoading, isLoggedIn, courseId]);

  useEffect(() => {
    fetchCourseDetails();
    fetchCourseSessions();
  }, [fetchCourseDetails, fetchCourseSessions]);

  const handleCheckSession = (id: number) => {
    router.push(`/hosting/sessions/${id}`);
  };

  // Handler for creating a new session
  const handleCreateSession = () => {
    setShowSessionForm(false);
    fetchCourseSessions(); // Re-fetch to ensure data consistency
  };

  // <--- NEW HANDLERS FOR COURSE FORM ---
  const handleUpdateCourse = async (
    id: number,
    updatedData: CourseFormData,
  ) => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Include authorization token if needed, e.g., 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success("Course updated successfully!");
        fetchCourseDetails(); // Re-fetch course details to update UI
        setShowCourseForm(false); // Close the form
      } else {
        toast.error(data.error || "Failed to update course.");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Network error or unexpected issue updating course.");
    }
  };

  const handleDeleteCourse = async (id: number) => {
    // Optional: Add a confirmation dialog before deleting
    if (
      !window.confirm(
        "Are you sure you want to delete this course? All associated sessions will also be removed.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
        // Include authorization token if needed
      });

      if (response.ok) {
        toast.success("Course deleted successfully!");
        router.push("/hosting"); // Redirect to hosting page as course is deleted
        setShowCourseForm(false); // Close the form
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete course.");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Network error or unexpected issue deleting course.");
    }
  };
  // <--- END NEW HANDLERS ---

  const getDateSession = (start_time: number) => {
    const date = new Date(start_time * 1000);

    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleDateString("en-US", options);
  };

  if (authLoading || isLoadingCourse || isLoadingSessions) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading course and sessions...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view course details and sessions.</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Course not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-start w-full pb-12">
        <Header title="Hosting" onClick={() => router.push("/hosting")} />
        <main className="content-wrap flex w-full flex-1 flex-col gap-8 py-8 sm:py-10">
          <section className="surface-card overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <span className="paper-badge">Hosted Course</span>
                <div className="space-y-2">
                  <h1 className="section-title">{course.name}</h1>
                  <p className="section-copy max-w-2xl">
                    Manage this course, review its attendance rules, and open a
                    session to inspect attendance records.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-myred px-5 text-sm font-semibold text-white transition hover:bg-[#740000]"
                onClick={() => setShowCourseForm(true)}
              >
                <Pencil className="h-4 w-4" />
                Edit Course
              </button>
            </div>

            <div className="meta-grid mt-8">
              <div className="meta-card">
                <div className="flex items-center gap-2 text-[#7b4f4f]">
                  <Hash className="h-4 w-4" />
                  <span className="meta-label">Join Code</span>
                </div>
                <p className="meta-value font-mono">{course.join_code}</p>
              </div>

              <div className="meta-card">
                <div className="flex items-center gap-2 text-[#7b4f4f]">
                  <TimerReset className="h-4 w-4" />
                  <span className="meta-label">Late Threshold</span>
                </div>
                <p className="meta-value">{course.late_threshold_minutes} min</p>
              </div>

              <div className="meta-card">
                <div className="flex items-center gap-2 text-[#7b4f4f]">
                  <TimerReset className="h-4 w-4" />
                  <span className="meta-label">Present Threshold</span>
                </div>
                <p className="meta-value">
                  {course.present_threshold_minutes} min
                </p>
              </div>

              <div className="meta-card">
                <div className="flex items-center gap-2 text-[#7b4f4f]">
                  <MapPin className="h-4 w-4" />
                  <span className="meta-label">Location Gate</span>
                </div>
                <p className="meta-value text-sm sm:text-base">
                  {course.geolocation_latitude !== null &&
                  course.geolocation_longitude !== null
                    ? `${course.geolocation_latitude}, ${course.geolocation_longitude}`
                    : "Not configured"}
                </p>
              </div>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-7">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <p className="section-kicker">Sessions</p>
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#211414]">
                  Attendance windows
                </h2>
                <p className="section-copy">
                  Each session opens into its own attendance summary and proof
                  records.
                </p>
              </div>
              <div className="paper-badge inline-flex gap-2">
                <CalendarDays className="h-3.5 w-3.5" />
                {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
              </div>
            </div>

            {sessions.length === 0 ? (
              <div className="empty-state">
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-semibold text-[#241616]">
                    No sessions yet
                  </h3>
                  <p className="section-copy">
                    Create the first session for this course to start recording
                    attendance.
                  </p>
                </div>
              </div>
            ) : (
              <div className="brand-grid">
                {sessions.map((session) => (
                  <CalendarCard
                    key={session.session_id}
                    title={getDateSession(session.start_time)}
                    onClick={() => handleCheckSession(session.session_id)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <button
          type="button"
          className="floating-action"
          onClick={() => setShowSessionForm(true)}
          aria-label="Create session"
        >
          <img src="/add.svg" alt="Create New Session" className="w-8 h-8" />
        </button>

        {/* Conditional Rendering for SessionForm */}
        {showSessionForm && courseId && (
          <SessionForm
            onClose={() => setShowSessionForm(false)}
            onCreate={handleCreateSession}
            courseId={courseId}
          />
        )}

        {/* Conditional Rendering for CourseForm */}
        {showCourseForm &&
          course && ( // <--- RENDER COURSE FORM HERE
            <CourseForm2
              onClose={() => setShowCourseForm(false)}
              initialCourseData={course} // Pass the current course data to pre-fill the form
              onUpdate={handleUpdateCourse}
              onDelete={handleDeleteCourse}
            />
          )}
      </div>
    </div>
  );
};

export default HostingCourse;

"use client";

import React, { useState, useEffect, useCallback } from "react"; // Add useCallback
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // For notifications
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth

import CourseForm from "@/components/CourseForm";
import Header from "@/components/Header"; // Import your headers component
import FolderCard from "@/components/FolderCard";

// Remove the mock data import
// import { coursesSample } from "@/content/data";

// Define an interface for your Course data structure
// Make sure this matches the structure returned by your backend's /courses endpoint
interface Course {
  course_id: number;
  name: string;
  join_code: string;
  host_id: number;
  host_name: string;
  late_threshold_minutes: number;
  present_threshold_minutes: number;
  geolocation_latitude: number;
  geolocation_longitude: number;
  created_at: number; // Unix timestamp
}

const Hosting = () => {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth(); // Get login status and loading state

  const [courses, setCourses] = useState<Course[]>([]); // Initialize as empty array
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Function to fetch courses from the backend
  const fetchHostedCourses = useCallback(async () => {
    // Only attempt to fetch if authentication status is known and user is logged in
    if (authLoading) {
      // Still loading auth status, do nothing yet
      return;
    }
    if (!isLoggedIn) {
      // Not logged in, no courses to fetch for a host
      setIsLoadingCourses(false); // Update loading state even if not fetching
      // toast.error("Please log in to view your hosted courses."); // Already handled by layout
      return;
    }

    setIsLoadingCourses(true); // Start loading
    try {
      const response = await fetch("/api/courses"); // Your backend endpoint
      const data = await response.json();

      if (response.ok) {
        setCourses(data || []); // Assuming your backend returns { "courses": [...] }
      } else {
        toast.error(data.error || "Failed to fetch hosted courses.");
        setCourses([]); // Clear courses on error
      }
    } catch (error) {
      console.error("Error fetching hosted courses:", error);
      toast.error("Network error or unexpected issue when fetching courses.");
      setCourses([]); // Clear courses on network error
    } finally {
      setIsLoadingCourses(false); // End loading
    }
  }, [isLoggedIn, authLoading]); // Dependencies for useCallback

  // useEffect to trigger fetching when component mounts or auth state changes
  useEffect(() => {
    fetchHostedCourses();
  }, [fetchHostedCourses]); // Dependency on fetchHostedCourses (memoized by useCallback)

  // handleCreateCourse now just triggers a refresh of the courses list
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreateCourse = (newCourse: Course) => {
    // Type newCourse as Course
    setShowForm(false); // Close the form first
    fetchHostedCourses(); // Re-fetch all courses to ensure consistency
    // Optionally, you could optimistically add the newCourse to state
    // setCourses((prev) => [...prev, newCourse]);
    // but re-fetching is safer for ensuring backend consistency.
  };

  const handleClickCourse = (id: number) => {
    router.push(`/hosting/${id}`);
  };

  // Render loading or "not logged in" states
  if (isLoadingCourses || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading your hosted courses...</p>
      </div>
    );
  }

  // This check is also handled by (root)/layout.tsx, but good to have a fallback message
  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Please log in to view and manage your hosted courses.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-start w-full pb-12">
        <Header title="Hosting" onClick={() => router.push("/home")} />

        <main className="content-wrap flex w-full flex-1 flex-col gap-8 py-8 sm:py-10">
          <section className="surface-card p-5 sm:p-7">
            <div className="space-y-2">
              <h1 className="section-title">Courses you&apos;re hosting</h1>
              <p className="section-copy max-w-2xl">
                Create and manage your courses here, then open a course to work
                with sessions and attendance records.
              </p>
            </div>
          </section>

          <section className="surface-card p-5 sm:p-7">
            {courses.length === 0 ? (
              <div className="surface-card-soft flex min-h-[16rem] items-center justify-center px-6 text-center">
                <div className="max-w-md space-y-2">
                  <h2 className="text-xl font-semibold text-[#241616]">
                    No hosted courses yet
                  </h2>
                  <p className="text-sm leading-6 text-[#6a5555]">
                    Start by creating a course. Your hosted classes will appear
                    here once they&apos;re ready.
                  </p>
                </div>
              </div>
            ) : (
              <div className="brand-grid">
                {courses.map((course) => (
                  <FolderCard
                    key={course.course_id}
                    title={course.name}
                    onClick={() => handleClickCourse(course.course_id)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <button
          type="button"
          className="floating-action"
          onClick={() => setShowForm(true)}
          aria-label="Create course"
        >
          <img src="/add.svg" alt="Create New Course" className="w-8 h-8" />
        </button>

        {showForm && (
          <CourseForm
            onClose={() => setShowForm(false)}
            onCreate={handleCreateCourse} // This will trigger a re-fetch
          />
        )}
      </div>
    </div>
  );
};

export default Hosting;

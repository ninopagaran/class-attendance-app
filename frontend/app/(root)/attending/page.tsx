"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import JoinCourse from "@/components/JoinCourse";
import Header from "@/components/Header";
import FolderCard from "@/components/FolderCard";
import { Plus } from "lucide-react";

interface CourseEnrollment {
  enrollment_id: number;
  course_id: number;
  name: string;
  join_code: string;
  host_id: number;
  host_name: string;
  enrolled_at: number;
}

const Attending = () => {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading, user } = useAuth(); // Get user object from AuthContext

  const [courses, setCourses] = useState<CourseEnrollment[]>([]);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch enrolled courses
  const fetchEnrollments = useCallback(async () => {
    // Only fetch if auth is done loading and user is logged in AND user ID is available
    if (authLoading || !isLoggedIn || !user?.id) {
      setIsLoading(false); // Ensure loading state is false if we can't fetch
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Construct the URL with the user's ID
      const response = await fetch(`/api/users/${user.id}/enrollments`);
      const data = await response.json();

      if (response.ok) {
        setCourses(data);
      } else {
        setError(data.error || "Failed to fetch courses you are attending.");
        toast.error(data.error || "Failed to fetch courses.");
        setCourses([]);
      }
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError("Network error or unexpected issue.");
      toast.error("Network error fetching courses.");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, isLoggedIn, user]); // Dependencies now include the 'user' object

  // useEffect to trigger fetching enrollments
  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const handleJoinCourse = async (data: { code: string }) => {
    setShowJoinForm(false);
    if (!isLoggedIn) {
      toast.error("You must be logged in to join a course.");
      return;
    }

    try {
      const response = await fetch("/api/enrollments", {
        // This route remains the same (POST to /enrollments)
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ join_code: data.code }),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message || "Successfully joined course!");
        fetchEnrollments(); // Re-fetch the list of courses to update the UI
      } else {
        toast.error(responseData.error || "Failed to join course.");
      }
    } catch (err) {
      console.error("Error joining course:", err);
      toast.error("Network error or unexpected issue while joining course.");
    }
  };

  const handleClickCourse = (id: number) => {
    router.push(`/attending/${id}`);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white w-full">
        <p>Loading your courses...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white w-full">
        <p>Please log in to view the courses you are attending.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white w-full text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-start w-full pb-12">
        <Header title="Attending" onClick={() => router.push("/home")} />

        <main className="content-wrap flex w-full flex-1 flex-col gap-6 py-6 sm:py-8">
          <section className="surface-card p-6 sm:p-8">
            <p className="section-kicker">Student view</p>
            <h1 className="section-title mt-2">Courses you attend</h1>
            <p className="section-copy mt-3 max-w-2xl">
              Join a course with its code, then open its sessions when it is time
              to record your attendance.
            </p>
          </section>

          <section className="surface-card p-5 sm:p-6">
            {courses.length === 0 ? (
              <div className="surface-card-soft flex min-h-[16rem] items-center justify-center px-6 text-center">
                <div className="max-w-md space-y-2">
                  <h2 className="display-type text-2xl font-semibold text-ink">
                    No courses yet
                  </h2>
                  <p className="section-copy mt-2">
                    Join a course with the code shared by your host. It will show
                    up here with its sessions.
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
          onClick={() => setShowJoinForm(true)}
          aria-label="Join course"
        >
          <Plus className="h-4 w-4" />
          <span>Join course</span>
        </button>

        {showJoinForm && (
          <JoinCourse
            onClose={() => setShowJoinForm(false)}
            onJoin={handleJoinCourse}
          />
        )}
      </div>
    </div>
  );
};

export default Attending;

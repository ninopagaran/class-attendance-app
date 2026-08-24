"use client";

import { BookOpenCheck, ClipboardPenLine, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch("/api/auth/status");
        const data = await response.json();

        if (response.ok) {
          setEmail(data.user.email || "");
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };

    fetchEmail();
  }, []);

  return (
    <main className="content-wrap min-h-screen py-6 sm:py-8">
      <section className="rounded-lg bg-blue-600 px-6 py-5 text-white sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-100">Welcome to Attends</p>
            <h1 className="mt-1 text-2xl font-semibold">Choose what you want to do.</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 self-start rounded-md bg-blue-700 px-3 py-2 text-left text-sm hover:bg-blue-800 sm:self-auto"
          >
            <UserRound className="size-4" />
            <span className="max-w-56 truncate">{email || "View profile"}</span>
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-lg border bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">Manage the courses you host or join a course as a student.</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => router.push("/hosting")}
            className="rounded-lg border border-slate-200 p-5 text-left hover:border-blue-400 hover:bg-blue-50"
          >
            <ClipboardPenLine className="size-6 text-blue-600" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Hosting</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">Create courses, open sessions, and check attendance records.</p>
            <span className="mt-4 inline-block text-sm font-medium text-blue-600">Open hosting</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/attending")}
            className="rounded-lg border border-slate-200 p-5 text-left hover:border-blue-400 hover:bg-blue-50"
          >
            <BookOpenCheck className="size-6 text-blue-600" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Attending</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">Join a course and submit attendance for its sessions.</p>
            <span className="mt-4 inline-block text-sm font-medium text-blue-600">Open attending</span>
          </button>
        </div>
      </section>
    </main>
  );
}

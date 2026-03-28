"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Home = () => {

  const router = useRouter();

  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await fetch('/api/auth/status');

        const data = await response.json();

        if (response.ok) {
          setEmail(data.user.email || "No email found");
        } else {
          console.error("Failed to fetch email:", data.message);
          setEmail("No email found");
        }
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    }

    fetchEmail();
  }, []);


  return (
    <main className="content-wrap flex min-h-screen w-full flex-col gap-8 py-8 sm:py-10">
      <section className="brand-panel overflow-hidden px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              Dashboard
            </p>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                Welcome to Attends
              </h1>
              <p className="max-w-xl text-sm leading-6 text-white/78 sm:text-base">
                Choose whether you&apos;re managing a course or joining one,
                then jump straight into your sessions.
              </p>
            </div>
          </div>

          <Button
            className="h-16 rounded-full border border-[#d8c3bd] bg-[#fff8f5] px-4 text-sm font-semibold text-[#1f1212] shadow-[0_18px_35px_rgba(20,5,5,0.18)] hover:bg-[#f7eded] sm:min-w-[19rem]"
            onClick={() => router.push('/profile')}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-myred shadow-[0_10px_20px_rgba(45,3,3,0.2)]">
              <img src="/profile.svg" alt="Profile" className="h-5 w-5 shrink-0" />
            </span>
            <span className="truncate text-[15px] font-semibold tracking-[-0.01em]">
              {email || "View Profile"}
            </span>
          </Button>
        </div>
      </section>

      <section className="surface-card p-5 sm:p-7">
        <div className="mb-6 space-y-1">
          <h2 className="section-title text-[1.75rem]">Choose your workspace</h2>
          <p className="section-copy max-w-2xl">
            Keep the flow simple: host a course to manage attendance, or join a
            course you&apos;re taking.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={() => router.push('/hosting')}
            className="group surface-card-soft flex min-h-[15rem] flex-col items-start justify-between p-6 text-left transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(55,14,14,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#890000]/20"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-myred shadow-[0_12px_24px_rgba(45,3,3,0.18)]">
              <img src="/create.svg" alt="Create" className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-[-0.02em] text-[#211414]">
                Hosting
              </h3>
              <p className="text-sm leading-6 text-[#665252]">
                Create courses, generate join codes, and manage attendance from
                your own course space.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => router.push('/attending')}
            className="group surface-card-soft flex min-h-[15rem] flex-col items-start justify-between p-6 text-left transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(55,14,14,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#890000]/20"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-myred shadow-[0_12px_24px_rgba(45,3,3,0.18)]">
              <img src="/enter.svg" alt="Enter" className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-[-0.02em] text-[#211414]">
                Attending
              </h3>
              <p className="text-sm leading-6 text-[#665252]">
                Join a course with a code and keep your classes and sessions in
                one place.
              </p>
            </div>
          </button>
        </div>
      </section>
    </main>
  )
}

export default Home

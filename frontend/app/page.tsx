import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="brand-shell flex min-h-screen items-center px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 text-white">
        <section className="space-y-4 text-center">
          <p className="mx-auto w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
            Attendance Made Simple
          </p>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold tracking-[-0.04em] sm:text-6xl">
              Attends
            </h1>
            <p className="mx-auto max-w-sm text-sm leading-6 text-white/78 sm:text-base">
              Create courses, join sessions, and manage attendance from one
              focused workspace.
            </p>
          </div>
        </section>

        <section className="surface-card space-y-4 p-5 text-left sm:p-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-[#221515]">
              Get started quickly
            </h2>
            <p className="text-sm leading-6 text-[#6a5555]">
              Use your account to host a class or join one with a code.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="h-14 rounded-2xl bg-white text-base font-semibold text-[#1f1313] shadow-[0_18px_35px_rgba(45,3,3,0.16)] hover:bg-[#f7efef]"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              className="h-14 rounded-2xl border border-white/15 bg-[#6f0000]/45 text-base font-medium text-white shadow-none hover:bg-[#5e0000]/60"
            >
              <Link href="/sign-in">Already have an account?</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import { CalendarCheck2, Users } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg border bg-white shadow-sm">
        <header className="flex items-center justify-between bg-blue-600 px-6 py-4 text-white">
          <Link href="/" className="text-xl font-semibold">Attends</Link>
          <Link href="/sign-in" className="text-sm font-medium hover:underline">Sign in</Link>
        </header>

        <div className="grid gap-8 p-6 sm:p-10 md:grid-cols-[1.25fr_0.75fr]">
          <section>
            <p className="text-sm font-medium text-blue-600">Simple attendance tracking for classes</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Keep track of your class attendance.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
              Hosts can create courses and sessions. Students can join a course and submit their attendance.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700">
                Create account
              </Link>
              <Link href="/sign-in" className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                I already have an account
              </Link>
            </div>
          </section>

          <section className="rounded-lg bg-slate-50 p-5">
            <h2 className="text-base font-semibold text-slate-800">What you can do</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="flex gap-3">
                <CalendarCheck2 className="size-5 shrink-0 text-blue-600" />
                <p><span className="font-medium text-slate-800">Host sessions</span><br />Create attendance sessions for your course.</p>
              </div>
              <div className="flex gap-3">
                <Users className="size-5 shrink-0 text-blue-600" />
                <p><span className="font-medium text-slate-800">Join a course</span><br />Use a course code from your instructor.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

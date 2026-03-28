// frontend/components/AuthForm.tsx
"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // Import useEffect

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { publicConfig } from "@/lib/public-config";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z.string().min(3, "Name must be at least 3 characters.")
        : z.string().optional(),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const { login, isLoggedIn, loading: authLoading, allowSignup } = useAuth(); // Destructure isLoggedIn and authLoading
  const router = useRouter();
  const signupEnabled = allowSignup && publicConfig.allowSignup;
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Effect to check auth status and redirect if already logged in
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.push("/");
    }
  }, [authLoading, isLoggedIn, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (type === "sign-up" && !signupEnabled) {
      toast.error("Public sign up is currently disabled.");
      router.replace("/sign-in");
      return;
    }

    try {
      const endpoint = type === "sign-up" ? "/signup" : "/signin";
      const apiUrl = `/api${endpoint}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        if (type === "sign-up") {
          const signInResponse = await fetch("/api/signin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          });

          const signInData = await signInResponse.json();

          if (signInResponse.ok) {
            login({
              id: signInData.user_id,
              name: signInData.name,
              email: signInData.email,
            });
            toast.success("Account created and logged in successfully!");
          } else {
            toast.error(signInData.error || "Failed to log in after signup.");
            console.error("Sign-in after signup error:", signInData.error);
          }
        } else {
          login({ id: data.user_id, name: data.name, email: data.email });
        }
      } else {
        toast.error(data.error || "An error occurred.");
        console.error("API Error:", data.error);
      }
    } catch (error: unknown) {
      toast.error(
        `There was an error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  const isSignIn = type === "sign-in";

  // If authentication status is still loading or user is already logged in, show a loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading authentication status...</p>
      </div>
    );
  }

  // If user is already logged in, they will be redirected by useEffect, so no need to render the form.
  // This check is mainly for the initial render before useEffect kicks in or if navigation is slow.
  if (isLoggedIn) {
    return null; // Or a simple message like "Redirecting..."
  }

  if (type === "sign-up" && !signupEnabled) {
    return (
      <div className="flex min-h-screen w-full max-w-md flex-col justify-center py-8">
        <div className="space-y-8">
          <section className="space-y-4 text-center text-white">
            <p className="mx-auto w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              Welcome to Attends
            </p>
            <div className="space-y-3">
              <h1 className="text-5xl font-bold tracking-[-0.04em] sm:text-6xl">
                Sign Up Closed
              </h1>
              <p className="mx-auto max-w-sm text-sm leading-6 text-white/78 sm:text-base">
                This deployment is currently not accepting new public accounts.
              </p>
            </div>
          </section>

          <div className="surface-card overflow-hidden px-6 py-7 sm:px-7 sm:py-8">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#221515]">
                Access is limited
              </h2>
              <p className="text-sm leading-6 text-[#6a5555]">
                If you already have an account, sign in instead.
              </p>
            </div>

            <Link
              href="/sign-in"
              className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-myred text-base font-semibold text-white shadow-[0_16px_28px_rgba(45,3,3,0.22)] transition hover:bg-[#730000]"
            >
              Go To Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full max-w-md flex-col justify-center py-8">
      <div className="space-y-8">
        <section className="space-y-4 text-center text-white">
          <p className="mx-auto w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
            Welcome to Attends
          </p>
          <div className="space-y-3">
            <h1 className="text-5xl font-bold tracking-[-0.04em] sm:text-6xl">
              {isSignIn ? "Sign In" : "Create Account"}
            </h1>
            <p className="mx-auto max-w-sm text-sm leading-6 text-white/78 sm:text-base">
              {isSignIn
                ? "Access your courses, sessions, and attendance tools."
                : "Set up your account and start hosting or joining courses in minutes."}
            </p>
          </div>
        </section>

        <div className="surface-card overflow-hidden px-6 py-7 sm:px-7 sm:py-8">
          <div className="mb-6 space-y-1">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#221515]">
              {isSignIn ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-sm leading-6 text-[#6a5555]">
              {isSignIn
                ? "Enter your details to continue."
                : "Fill in your information to create your account."}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <label className="text-sm font-medium text-[#3b2323]">
                        Name
                      </label>
                      <FormControl>
                        <Input
                          placeholder="Your full name"
                          {...field}
                          className="h-14 rounded-2xl border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515]"
                        />
                      </FormControl>
                      <FormMessage className="min-h-[16px] text-xs text-red-600" />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <label className="text-sm font-medium text-[#3b2323]">
                      Email
                    </label>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        {...field}
                        className="h-14 rounded-2xl border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515]"
                      />
                    </FormControl>
                    <FormMessage className="min-h-[16px] text-xs text-red-600" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <label className="text-sm font-medium text-[#3b2323]">
                      Password
                    </label>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="h-14 rounded-2xl border-black/10 bg-[#faf5f2] px-4 text-sm text-[#221515]"
                      />
                    </FormControl>
                    <FormMessage className="min-h-[16px] text-xs text-red-600" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="mt-2 h-14 w-full rounded-2xl bg-myred text-base font-semibold text-white shadow-[0_16px_28px_rgba(45,3,3,0.22)] hover:bg-[#730000]"
              >
                {isSignIn ? "Login" : "Sign Up"}
              </Button>
            </form>
          </Form>

          <p className="mt-5 text-center text-sm leading-6 text-[#5b4444]">
            {isSignIn ? (
              signupEnabled ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="font-semibold text-myred transition hover:text-[#690000]"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                "Public signup is currently disabled."
              )
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="font-semibold text-myred transition hover:text-[#690000]"
                >
                  Login
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

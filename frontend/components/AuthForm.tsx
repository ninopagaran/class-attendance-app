"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

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
import { publicConfig } from "@/lib/public-config";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) =>
  z.object({
    name:
      type === "sign-up"
        ? z.string().min(3, "Name must be at least 3 characters.")
        : z.string().optional(),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
  });

const fieldClassName =
  "h-10 rounded-md border-slate-300 bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20";

const AuthForm = ({ type }: { type: FormType }) => {
  const { login, isLoggedIn, loading: authLoading, allowSignup } = useAuth();
  const router = useRouter();
  const signupEnabled = allowSignup && publicConfig.allowSignup;
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const isSignIn = type === "sign-in";

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.push("/home");
    }
  }, [authLoading, isLoggedIn, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (type === "sign-up" && !signupEnabled) {
      toast.error("Public sign up is currently disabled.");
      router.replace("/sign-in");
      return;
    }

    try {
      const response = await fetch(`/api${type === "sign-up" ? "/signup" : "/signin"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "An error occurred.");
        return;
      }

      if (type === "sign-up") {
        const signInResponse = await fetch("/api/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email, password: values.password }),
        });
        const signInData = await signInResponse.json();

        if (!signInResponse.ok) {
          toast.error(signInData.error || "Failed to log in after signup.");
          return;
        }

        login({
          id: signInData.user_id,
          name: signInData.name,
          email: signInData.email,
        });
        toast.success("Account created and signed in.");
        return;
      }

      login({ id: data.user_id, name: data.name, email: data.email });
    } catch (error: unknown) {
      toast.error(
        `There was an error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  if (authLoading || isLoggedIn) {
    return null;
  }

  if (type === "sign-up" && !signupEnabled) {
    return (
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <p className="text-sm font-medium text-blue-600">Attends</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Sign up is closed</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
            This deployment is not accepting new public accounts at the moment.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go to sign in <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:p-8">
      <section>
        <p className="text-sm font-medium text-blue-600">Attends</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          {isSignIn ? "Sign in" : "Create an account"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
            {isSignIn
              ? "Enter your email and password to continue."
              : "Fill in the details below to get started."}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Name</label>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} className={fieldClassName} />
                    </FormControl>
                    <FormMessage className="min-h-4 text-xs text-red-700" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Email address</label>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} className={fieldClassName} />
                  </FormControl>
                  <FormMessage className="min-h-4 text-xs text-red-700" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="At least 8 characters"
                      {...field}
                      className={fieldClassName}
                    />
                  </FormControl>
                  <FormMessage className="min-h-4 text-xs text-red-700" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-2 h-10 w-full rounded-md bg-blue-600 text-sm font-medium text-white shadow-none hover:bg-blue-700"
            >
              {isSignIn ? "Sign in" : "Create account"}
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </form>
        </Form>

        <p className="mt-5 text-sm leading-6 text-slate-600">
          {isSignIn ? (
            signupEnabled ? (
              <>
                Need an account?{" "}
                <Link href="/sign-up" className="font-medium text-blue-600 hover:underline">
                  Create one
                </Link>
              </>
            ) : (
              "Public sign up is currently disabled."
            )
          ) : (
            <>
              Already registered?{" "}
              <Link href="/sign-in" className="font-medium text-blue-600 hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </section>
    </div>
  );
};

export default AuthForm;

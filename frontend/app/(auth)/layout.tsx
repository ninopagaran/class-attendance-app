"use client"; // This layout uses client-side hooks

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook
import { useRouter } from "next/navigation"; // For client-side navigation

function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isLoggedIn, loading } = useAuth(); // Get login status and loading state
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not loading and user is already logged in
    if (!loading && isLoggedIn) {
      router.replace("/home"); // Redirect to your main app page
    }
  }, [isLoggedIn, loading, router]); // Re-run effect if these values change

  // While loading, or if already logged in, you might show a loading spinner
  // or just nothing before redirect. If already logged in, children won't render anyway.
  if (loading || isLoggedIn) {
    return null; // Or a loading spinner, or a simple message
  }
  return (
    <div className="brand-shell flex min-h-screen w-full items-center justify-center px-4 sm:px-6">
      {children}
    </div>
  );
}

export default AuthLayout;

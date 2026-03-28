"use client"; // This layout uses client-side hooks

import { useEffect, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth hook
import { useRouter } from "next/navigation"; // For client-side navigation
// You might have other imports here for common UI elements like a header, sidebar, etc.

function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { isLoggedIn, loading } = useAuth(); // Get login status and loading state
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not loading and user is NOT logged in
    if (!loading && !isLoggedIn) {
      router.replace("/sign-in"); // Redirect to the sign-in page
    }
  }, [isLoggedIn, loading, router]); // Re-run effect if these values change

  // While loading, or if not logged in, you might show a loading spinner
  // or return null to prevent content from flashing before redirect.
  if (loading || !isLoggedIn) {
    return null; // Or a loading spinner / placeholder content
  }

  // If user is logged in and not loading, render the child routes
  return <div className="paper-shell flex w-full min-h-screen">{children}</div>;
}

export default RootLayout;

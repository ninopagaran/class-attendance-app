"use client"; // This component uses client-side hooks

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation"; // For client-side navigation
import { toast } from "sonner"; // For notifications

// Define the shape of your user data
interface User {
  id: number;
  name: string;
  email: string;
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean; // To indicate if auth status is being loaded
  allowSignup: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initially true when checking session
  const [allowSignup, setAllowSignup] = useState(true);
  const router = useRouter(); // Initialize useRouter for client-side redirects

  // Function to check the session status with the backend
  const checkSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/status"); // Use the proxy
      const data = await response.json();
      setAllowSignup(data.allowSignup !== false);

      if (response.ok && data.isLoggedIn) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check session:", error);
      setUser(null); // Assume not logged in on error
      setAllowSignup(false);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  // Check session status on component mount
  useEffect(() => {
    checkSession();
  }, [checkSession]); // Re-run if checkSession changes (it won't with useCallback)

  // Function to handle login (called after successful API call in AuthForm)
  const login = useCallback(
    (userData: User) => {
      setUser(userData);
      toast.success("Logged in successfully!");
      router.replace("/home"); // Redirect to home page
    },
    [router],
  );

  // Function to handle logout
  const logout = useCallback(async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" }); // Use the proxy
      if (response.ok) {
        setUser(null);
        toast.success("Logged out successfully.");
        router.replace("/sign-in"); // Redirect to login page after logout
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to log out.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Network error during logout.");
    }
  }, [router]);

  const value = {
    user,
    isLoggedIn: !!user, // Convert user object to a boolean
    login,
    logout,
    loading,
    allowSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

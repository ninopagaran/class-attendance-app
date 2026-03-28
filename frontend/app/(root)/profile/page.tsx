"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import UpdateProfileForm from "@/components/UpdateProfile"; // Assuming this component exists
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { toast } from "sonner";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component

// Define a simple modal for password confirmation for deletion
// In a real app, this would likely be a separate component file (e.g., components/DeleteUserForm.tsx)
interface DeleteUserFormProps {
  onClose: () => void;
  onDeleteConfirm: (passwordConfirmation: string) => Promise<void>;
}

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({
  onClose,
  onDeleteConfirm,
}) => {
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    await onDeleteConfirm(passwordConfirmation);
    setIsDeleting(false);
    onClose(); // Close the modal after the attempt, regardless of success/fail
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#221515]">
          Confirm Account Deletion
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#6a5555]">
          This action cannot be undone. Please enter your password to confirm.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="h-14 rounded-2xl border-black/10 bg-[#faf5f2] px-4"
            required
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isDeleting}
              className="h-11 rounded-2xl border-black/10 bg-[#f3ece8] text-[#3a2626] hover:bg-[#ece2de]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-2xl bg-red-600 px-5 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * Renders the user profile page, displaying user information and providing options to update details,
 * delete account, and log out.
 */
const Profile = () => {
  const router = useRouter();
  // Removed 'fetchAuthStatus' from destructuring as per user feedback
  const { user, logout, isLoggedIn, loading: authLoading } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showUpdateDetailsForm, setShowUpdateDetailsForm] =
    useState<boolean>(false);
  const [showDeleteUserForm, setShowDeleteUserForm] = useState<boolean>(false);

  // Set initial name and email from auth context user data
  useEffect(() => {
    if (!authLoading && user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [authLoading, user]);

  // Redirect if not logged in after auth check completes
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/sign-in"); // Redirect to login if not logged in
    }
  }, [authLoading, isLoggedIn, router]);

  /**
   * Handles the update of user details (name and email).
   * This function will be passed to the UpdateProfileForm.
   */
  const handleUpdateDetails = useCallback(
    async ({
      name: updatedName,
      email: updatedEmail,
    }: {
      name: string;
      email: string;
    }) => {
      if (!user?.id) {
        toast.error("User ID not available for update.");
        return;
      }

      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: updatedName, email: updatedEmail }),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message || "Profile updated successfully!");
          setName(updatedName); // Update local state
          setEmail(updatedEmail); // Update local state
          // Since 'fetchAuthStatus' is not available, we can trigger a refresh
          // or rely on AuthContext to update its user state on its own.
          // For immediate UI consistency in other parts of the app that rely on AuthContext.user,
          // you might consider router.refresh() here or implement a way to update AuthContext's user state.
          // For now, only local state in this component is updated.
        } else {
          toast.error(
            data.error || data.message || "Failed to update profile.",
          );
          console.error("Profile update error:", data);
        }
      } catch (error) {
        console.error("Network error during profile update:", error);
        toast.error("Network error during profile update.");
      }
    },
    [user],
  ); // Removed fetchAuthStatus from dependencies

  /**
   * Handles the deletion of the user account.
   * This function will be passed to the DeleteUserForm.
   */
  const handleDeleteUser = useCallback(
    async (passwordConfirmation: string) => {
      if (!user?.id) {
        toast.error("User ID not available for deletion.");
        return;
      }

      try {
        const response = await fetch(`/api/users/${user.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password_confirmation: passwordConfirmation }),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          toast.success(data.message || "Account deleted successfully!");
          logout(); // Log out the user from AuthContext
          router.push("/"); // Redirect to login page
        } else {
          toast.error(
            data.error || data.message || "Failed to delete account.",
          );
          console.error("Account deletion error:", data);
        }
      } catch (error) {
        console.error("Network error during account deletion:", error);
        toast.error("Network error during account deletion.");
      }
    },
    [user, logout, router],
  );

  /**
   * Handles the user logout process.
   */
  const handleLogout = useCallback(async () => {
    try {
      logout(); // Use logout from AuthContext
      toast.success("Logged out successfully!");
      router.push("/sign-in"); // Redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
    }
  }, [logout, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start w-full">
      <Header title="Profile" onClick={() => router.back()} />

      <main className="content-wrap flex w-full flex-1 flex-col gap-6 py-8 sm:py-10">
        <section className="surface-card flex flex-col items-center gap-5 px-6 py-8 text-center sm:px-8 sm:py-10">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#f0e4e0] text-4xl font-bold text-myred shadow-[0_16px_32px_rgba(55,14,14,0.08)]">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h1 className="section-title">{name}</h1>
            <p className="section-copy">{email}</p>
          </div>
        </section>

        <section className="surface-card p-5 sm:p-7">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#211414]">
              Account actions
            </h2>
            <p className="section-copy">
              Update your account details, or manage account removal if needed.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <Button
              className="h-14 w-full rounded-[1.4rem] bg-myred px-6 text-base font-medium hover:bg-[#730000]"
              onClick={() => setShowUpdateDetailsForm(true)}
            >
              Update Details
            </Button>

            <Button
              className="h-14 w-full rounded-[1.4rem] bg-red-600 px-6 text-base font-medium text-white hover:bg-red-700"
              onClick={() => setShowDeleteUserForm(true)}
            >
              Delete User
            </Button>
          </div>
        </section>

        <section className="surface-card p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#211414]">
                Session
              </h2>
              <p className="section-copy">
                End your current session securely on this device.
              </p>
            </div>

            <Button
              className="h-14 rounded-full bg-myred px-8 text-base font-medium hover:bg-[#730000]"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </section>
      </main>

      {/* Update Profile Form Modal */}
      {showUpdateDetailsForm && (
        <UpdateProfileForm
          onClose={() => setShowUpdateDetailsForm(false)}
          onUpdate={handleUpdateDetails}
          initialName={name}
          initialEmail={email}
        />
      )}

      {/* Delete User Form Modal */}
      {showDeleteUserForm && (
        <DeleteUserForm
          onClose={() => setShowDeleteUserForm(false)}
          onDeleteConfirm={handleDeleteUser}
        />
      )}
    </div>
  );
};

export default Profile;

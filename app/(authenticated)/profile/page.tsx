"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/components/ButtonPrimary";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState({
    name: "",
  });
  const [passwordMode, setPasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      });
      setEditableData({
        name: session.user.name || "",
      });
      setIsLoading(false);
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, status, router]);

  // Reset image error when userData changes
  useEffect(() => {
    setImageError(false);
  }, [userData.image]);

  const handleEditModeToggle = () => {
    if (editMode) {
      // Discard changes and exit edit mode
      setEditableData({
        name: userData.name,
      });
    }
    setEditMode(!editMode);
    setPasswordMode(false);
    setError("");
    setSuccessMessage("");
  };

  const handlePasswordModeToggle = () => {
    setPasswordMode(!passwordMode);
    setEditMode(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
    setSuccessMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editableData.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the userData state with the new values
        setUserData((prev) => ({
          ...prev,
          name: editableData.name,
        }));
        setSuccessMessage("Profile updated successfully!");
        setEditMode(false);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch {
      setError("An error occurred while updating your profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setError("");
    setSuccessMessage("");

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      setIsChangingPassword(false);
      return;
    }

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password changed successfully!");
        setPasswordMode(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch {
      setError("An error occurred while changing your password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-400 to-purple-500 px-4 sm:px-6 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Profile</h1>
        </div>

        <div className="p-4 sm:p-6">
          {successMessage && (
            <div className="mb-4 sm:mb-6 bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 sm:mb-6 bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-4 rounded-full overflow-hidden bg-gray-200">
                {userData.image && !imageError ? (
                  <Image
                    src={userData.image}
                    alt={userData.name || "Profile picture"}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-3xl sm:text-4xl md:text-5xl font-semibold">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 w-full md:w-auto">
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editableData.name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-500 text-sm sm:text-base"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <ButtonPrimary
                      type="submit"
                      text={isSaving ? "Saving..." : "Save Changes"}
                      disabled={isSaving}
                    />
                    <button
                      type="button"
                      onClick={handleEditModeToggle}
                      className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : passwordMode ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Change Password
                  </h2>

                  {!userData.email.includes("@gmail.com") ? (
                    <>
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Password must be at least 8 characters long
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                        <ButtonPrimary
                          type="submit"
                          text={isChangingPassword ? "Changing..." : "Change Password"}
                          disabled={isChangingPassword}
                        />
                        <button
                          type="button"
                          onClick={handlePasswordModeToggle}
                          className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-4">
                      <p className="text-gray-700">
                        Password cannot be changed for Google accounts. Your password is managed by Google.
                      </p>
                      <button
                        type="button"
                        onClick={handlePasswordModeToggle}
                        className="mt-4 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base transition-colors"
                      >
                        Back to Profile
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Account Information
                    </h2>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="mt-1 text-base sm:text-lg">{userData.name || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="mt-1 text-base sm:text-lg">{userData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Account Type
                        </p>
                        <p className="mt-1 text-base sm:text-lg">
                          {userData.email.includes("@gmail.com")
                            ? "Google Account"
                            : "Email & Password"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <ButtonPrimary
                      text="Edit Profile"
                      onClick={handleEditModeToggle}
                    />
                    <button
                      type="button"
                      onClick={handlePasswordModeToggle}
                      className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
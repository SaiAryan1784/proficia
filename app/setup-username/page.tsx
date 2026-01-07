"use client";

// ... imports
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function UsernameSetupPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ... (useEffect logics remain same)

  // Redirect logic
  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (session.user.username) {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router]);

  // Check username logic
  useEffect(() => {
    if (username.length >= 3 && username.length <= 20) {
      const delayDebounceFn = setTimeout(async () => {
        setCheckingUsername(true);
        try {
          const response = await fetch(`/api/user/check-username?username=${encodeURIComponent(username)}`);
          const data = await response.json();
          setUsernameAvailable(data.available);
        } catch (error) {
          console.error('Error checking username:', error);
          setUsernameAvailable(null);
        } finally {
          setCheckingUsername(false);
        }
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setUsernameAvailable(null);
      setCheckingUsername(false);
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length < 3 || username.length > 20) {
      setError("Username must be between 3 and 20 characters");
      return;
    }

    if (!usernameAvailable) {
      setError("Please choose an available username");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/update-username", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        // Update the session in the background and redirect immediately
        update().catch(console.error);
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error ?? "Failed to set username");
        setIsLoading(false);
      }
    } catch {
      setError("An error occurred while setting your username");
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session?.user || session.user.username) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 space-y-6 bg-card rounded-xl shadow-lg border border-border"
      >
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-foreground"
          >
            Choose Your Username
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            Pick a unique username for your profile page
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="username" className="block text-sm font-medium text-foreground">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                placeholder="Choose a unique username"
                value={username}
                required
                maxLength={20}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                  if (value.length <= 20) {
                    setUsername(value);
                  }
                }}
                className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 border border-input rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground text-sm sm:text-base pr-10"
              />
              {username.length >= 3 && username.length <= 20 && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {(() => {
                    if (checkingUsername) {
                      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>;
                    }
                    if (usernameAvailable === true) {
                      return <FaCheck className="h-4 w-4 text-green-500" />;
                    }
                    if (usernameAvailable === false) {
                      return <FaTimes className="h-4 w-4 text-destructive" />;
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
            {username.length > 20 && (
              <p className="mt-1 text-sm text-destructive">Username cannot exceed 20 characters</p>
            )}
            {username.length >= 3 && username.length <= 20 && usernameAvailable === false && (
              <p className="mt-1 text-sm text-destructive">Username is already taken</p>
            )}
            {username.length >= 3 && username.length <= 20 && usernameAvailable === true && (
              <p className="mt-1 text-sm text-green-600">Username is available</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Username must be 3-20 characters. Only lowercase letters, numbers, and underscores allowed.
              <span className="ml-2 text-muted-foreground/70">({username.length}/20)</span>
            </p>
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              type="submit"
              disabled={!usernameAvailable || isLoading}
              className={`
                w-full py-3 px-4 rounded-lg font-medium transition-colors border
                ${usernameAvailable && !isLoading
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary'
                  : 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                }
              `}
            >
              {isLoading ? 'Setting Username...' : 'Continue'}
            </button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground">
            You can change your username later in profile settings
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

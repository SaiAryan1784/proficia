"use client";

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

  // Redirect if user already has username or is not authenticated
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

  // Check username availability with debounce
  useEffect(() => {
    if (username.length >= 3) {
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session?.user || session.user.username) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white"
          >
            Choose Your Username
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-sm text-gray-600 dark:text-gray-400"
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
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                placeholder="Choose a unique username"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base pr-10"
              />
              {username.length >= 3 && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {(() => {
                    if (checkingUsername) {
                      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>;
                    }
                    if (usernameAvailable === true) {
                      return <FaCheck className="h-4 w-4 text-green-500" />;
                    }
                    if (usernameAvailable === false) {
                      return <FaTimes className="h-4 w-4 text-red-500" />;
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
            {username.length >= 3 && usernameAvailable === false && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">Username is already taken</p>
            )}
            {username.length >= 3 && usernameAvailable === true && (
              <p className="mt-1 text-sm text-green-600 dark:text-green-400">Username is available</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Username must be at least 3 characters. Only lowercase letters, numbers, and underscores allowed.
            </p>
          </motion.div>
          
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600 dark:text-red-400"
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
                w-full py-3 px-4 rounded-md font-medium transition-colors
                ${usernameAvailable && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
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
          <p className="text-xs text-gray-500 dark:text-gray-400">
            You can change your username later in profile settings
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

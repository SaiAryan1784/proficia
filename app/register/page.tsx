"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import NavbarPrimary from "@/components/NavbarPrimary";
import ButtonPrimary from "@/components/ButtonPrimary";
import { FaGoogle, FaCheck, FaTimes } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Check username availability with debounce
  useEffect(() => {
    if (username.length >= 3) {
      const delayDebounceFn = setTimeout(async () => {
        setCheckingUsername(true);
        try {
          const response = await fetch(`/api/user/check-username?username=${encodeURIComponent(username)}`);
          
          if (!response.ok) {
            console.error('Username check failed:', response.status, response.statusText);
            setUsernameAvailable(null);
            return;
          }
          
          const data = await response.json();
          console.log('Username check response:', data);
          setUsernameAvailable(data.available);
        } catch (error) {
          console.error('Username check error:', error);
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
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, email, password }),
      });
      if (response.ok) {
        router.push("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Store intent to set username after Google sign-in
    localStorage.setItem('needsUsername', 'true');
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarPrimary />
      <div className="flex-1 flex justify-center items-center px-4 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm mx-auto p-6 sm:p-8 space-y-6 bg-white rounded-lg shadow-lg"
        >
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-gray-900"
            >
              Create Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-gray-600"
            >
              Join us today and get started
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col space-y-4"
          >
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex items-center justify-center w-full max-w-xs mx-auto py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <FaGoogle className="mr-2 text-red-500" />
              Sign up with Google
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or register with email</span>
              </div>
            </div>
          </motion.div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    placeholder="Choose a unique username"
                    value={username}
                    required
                    onChange={(e) => {
                      const cleanValue = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                      setUsername(cleanValue);
                    }}
                    className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm pr-10"
                  />
                  {username.length >= 3 && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {checkingUsername ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
                      ) : usernameAvailable === true ? (
                        <FaCheck className="h-4 w-4 text-green-500" />
                      ) : usernameAvailable === false ? (
                        <FaTimes className="h-4 w-4 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
                {username.length >= 3 && usernameAvailable === false && (
                  <p className="mt-1 text-sm text-red-600">Username is already taken</p>
                )}
                {username.length >= 3 && usernameAvailable === true && (
                  <p className="mt-1 text-sm text-green-600">Username is available</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Username must be at least 3 characters. Only lowercase letters, numbers, and underscores allowed.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="pt-2 flex flex-col items-center"
            >
              <div className="w-full max-w-xs mx-auto">
                <ButtonPrimary 
                  text={isLoading ? "Loading..." : "Register"} 
                  type="submit" 
                  disabled={isLoading} 
                />
              </div>
              
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          </form>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="text-center mt-4"
          >
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Login here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
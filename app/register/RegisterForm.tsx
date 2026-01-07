"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FaGoogle, FaCheck, FaTimes } from 'react-icons/fa';
import { FiArrowRight } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/BrandLogo";

export default function RegisterForm() {
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
    if (username.length >= 3 && username.length <= 20) {
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

    if (username.length < 3 || username.length > 20) {
      setError("Username must be between 3 and 20 characters");
      return;
    }

    if (password.length < 8 || password.length > 16) {
      setError("Password must be between 8 and 16 characters");
      return;
    }

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
    localStorage.setItem('needsUsername', 'true');
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-border shadow-xl shadow-primary/5">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <BrandLogo variant="icon" width={48} />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription>
              Join Proficia to start your engineering journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <FaGoogle className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    id="username"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => {
                      const cleanValue = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                      if (cleanValue.length <= 20) setUsername(cleanValue);
                    }}
                    required
                    className={cn("h-11 pr-10",
                      username.length >= 3 && usernameAvailable === false && "border-destructive focus-visible:ring-destructive",
                      username.length >= 3 && usernameAvailable === true && "border-green-500 focus-visible:ring-green-500"
                    )}
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {checkingUsername ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : usernameAvailable === true ? (
                      <FaCheck className="h-4 w-4 text-green-500" />
                    ) : usernameAvailable === false ? (
                      <FaTimes className="h-4 w-4 text-destructive" />
                    ) : null}
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  3-20 chars, lowercase letters & numbers only.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Start Learning"}
                {!isLoading && <FiArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="ml-1 text-primary hover:underline font-medium">
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
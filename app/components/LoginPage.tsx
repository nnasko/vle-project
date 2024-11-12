// app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PencilRuler, ArrowRight, KeyRound, Mail } from "lucide-react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

type LoginStep = "email" | "password" | "set-password";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<LoginStep>("email");
  const [error, setError] = useState<string | null>(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (!data.exists) {
        setError(
          "No account found with this email. Please contact your administrator."
        );
        setIsLoading(false);
        return;
      }

      // Check if user has set password
      const passCheckResponse = await fetch("/api/auth/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const passCheckData = await passCheckResponse.json();

      if (!passCheckResponse.ok) {
        throw new Error(passCheckData.error || "Something went wrong");
      }

      setIsFirstLogin(!passCheckData.hasPassword);
      setStep(passCheckData.hasPassword ? "password" : "set-password");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (step === "set-password") {
        // Set initial password
        const response = await fetch("/api/auth/set-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to set password");
        }
      }

      // Login
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        const data = await loginResponse.json();
        throw new Error(data.error || "Invalid credentials");
      }

      toast.success(
        isFirstLogin ? "Password set successfully!" : "Logged in successfully!"
      );
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <PencilRuler className="h-12 w-12 text-black mb-4" />
            <h1 className="text-2xl font-bold text-black tracking-wider">
              AAA<span className="font-light">+ College</span>
            </h1>
          </div>

          <Card className="bg-neutral-700 border-2 border-neutral-600">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-white">
                {step === "email"
                  ? "Welcome"
                  : step === "set-password"
                  ? "Set Your Password"
                  : "Welcome Back"}
              </CardTitle>
              <CardDescription className="text-center">
                {step === "email"
                  ? "Enter your email to continue"
                  : step === "set-password"
                  ? "Create a password for your account"
                  : "Enter your password to login"}
              </CardDescription>
              {error && (
                <div className="text-red-500 text-sm text-center mt-2">
                  {error}
                </div>
              )}
            </CardHeader>

            <form
              onSubmit={
                step === "email" ? handleEmailSubmit : handlePasswordSubmit
              }
            >
              <CardContent className="space-y-4">
                {step === "email" ? (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="m.simpson@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-neutral-800 border-neutral-600 text-white pl-10"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white">
                        Password
                      </Label>
                      {step === "password" && (
                        <Button
                          type="button"
                          variant="link"
                          className="px-0 font-normal text-primary text-sm text-white"
                          onClick={() => router.push("/forgot-password")}
                        >
                          Forgot password?
                        </Button>
                      )}
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        minLength={
                          process.env.NODE_ENV === "development" ? 1 : 8
                        }
                        className="bg-neutral-800 border-neutral-600 pl-10 text-white"
                      />
                    </div>
                    {step === "set-password" && (
                      <p className="text-sm text-neutral-400">
                        Password must be at least{" "}
                        {process.env.NODE_ENV === "development" ? 1 : 8}{" "}
                        characters long
                      </p>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-main hover:bg-second"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {step === "email" ? "Checking..." : "Signing in..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {step === "email"
                        ? "Continue"
                        : step === "set-password"
                        ? "Set password & Sign in"
                        : "Sign in"}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {step !== "email" && (
            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="text-neutral-500 hover:text-black"
                onClick={() => {
                  setStep("email");
                  setPassword("");
                  setError(null);
                }}
              >
                ← Use a different email
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2 bg-neutral-900 flex items-center justify-center border-l-4 border-main">
        <img
          src="/campus.jpg"
          alt="College campus"
          className="max-w-full h-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

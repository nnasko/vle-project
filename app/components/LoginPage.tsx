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
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const [step, setStep] = useState<"email" | "password" | "create">("email");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call to check if user exists
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Replace with actual API call to check if user exists
    const userExists = email.includes("existing"); // Temporary logic for demo
    setIsExistingUser(userExists);
    setStep(userExists ? "password" : "create");
    setIsLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Handle login/registration logic here
    toast.success(
      step === "password"
        ? "Successfully logged in!"
        : "Account created successfully!"
    );

    setIsLoading(false);
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
                {step === "email" ? "Welcome" : "Welcome back"}
              </CardTitle>
              <CardDescription className="text-center">
                {step === "email"
                  ? "Enter your email to continue"
                  : step === "password"
                  ? "Enter your password to login"
                  : "Create a password for your new account"}
              </CardDescription>
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
                          variant="link"
                          className="px-0 font-normal text-primary text-sm text-white"
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
                        className="bg-neutral-800 border-neutral-600 pl-10 text-white"
                      />
                    </div>
                    {step === "create" && (
                      <p className="text-sm text-neutral-400">
                        Password must be at least 8 characters long
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
                        : step === "password"
                        ? "Sign in"
                        : "Create account"}
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
                }}
              >
                ← Use a different email
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2 bg-neutral-900 flex items-center justify-center border-l-4 border-main ">
        <img
          src="/campus.jpg"
          alt="College campus"
          className="max-w-full h-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
